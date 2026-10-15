const assert = require('node:assert/strict');
const test = require('node:test');
const sharp = require('sharp');
const { statSync } = require('node:fs');
const { createLoader, createMemoryStore } = require('./testing/helpers.cjs');
const legacy = require('./testing/legacy-content.json');

const load = createLoader();
const seo = load('lib/seo.ts');
const schema = load('lib/jsonld.ts');

function loadSeed(store, connectDB = async () => {}) {
  return createLoader({
    '@/lib/mongodb': { connectDB },
    ...Object.fromEntries(Object.entries(store.models).map(([name, model]) => [
      `@/models/${name}`, { __esModule: true, default: model },
    ])),
  })('lib/seed.ts');
}

test('all nine pages have distinct metadata, one brand and their own canonical', () => {
  assert.equal(Object.keys(seo.PAGE_SEO).length, 9);
  const titles = new Set(), descriptions = new Set();
  for (const [key, page] of Object.entries(seo.PAGE_SEO)) {
    const meta = seo.buildMetadata(key, { canonical: `${seo.SITE_URL}/?incorrect=1#fragment` });
    assert.equal(meta.title.absolute, page.title);
    assert.equal((meta.title.absolute.match(/serenity planning/gi) || []).length, 1);
    assert.equal(meta.alternates.canonical, seo.absoluteUrl(page.path));
    assert.equal(meta.openGraph.url, meta.alternates.canonical);
    assert.equal(meta.openGraph.description, page.description);
    assert.equal(meta.twitter.card, 'summary_large_image');
    titles.add(meta.title.absolute);
    descriptions.add(meta.description);
  }
  assert.equal(titles.size, 9);
  assert.equal(descriptions.size, 9);
});

test('admin titles cannot repeat the brand; custom share fields still work', () => {
  assert.equal(seo.withBrand('About Serenity Planning | San Antonio | Serenity Planning'),
    'About Serenity Planning | San Antonio');
  assert.equal(seo.withBrand('Our Story'), 'Our Story | Serenity Planning');
  const meta = seo.buildMetadata('about', {
    title: 'Our Founder', description: 'Custom description',
    ogTitle: 'Custom share title', ogDescription: 'Custom share summary', ogImage: '/flyer.jpg',
  });
  assert.equal(meta.title.absolute, 'Our Founder | Serenity Planning');
  assert.equal(meta.openGraph.title, 'Custom share title');
  assert.equal(meta.twitter.description, 'Custom share summary');
  assert.equal(meta.twitter.images[0], '/flyer.jpg');
});

test('all sixteen service references use ListItem wrappers and the stable business ID', () => {
  for (let page = 0; page < 2; page++) {
    const list = schema.servicesJsonLd(legacy.Service);
    assert.equal(list.itemListElement.length, 8);
    list.itemListElement.forEach((entry, index) => {
      assert.equal(entry['@type'], 'ListItem');
      assert.equal(entry.position, index + 1);
      assert.equal(entry.item['@type'], 'Service');
      assert.ok(!Object.hasOwn(entry.item, 'position'));
      assert.equal(entry.item.provider['@id'], schema.organizationJsonLd()['@id']);
      assert.equal(entry.item.url, `${seo.SITE_URL}/services#${legacy.Service[index].slug}`);
    });
  }
  const business = schema.organizationJsonLd();
  assert.equal(business['@type'], 'LocalBusiness');
  assert.ok(!business.address.streetAddress);
  assert.ok(!business.sameAs);
  assert.ok(!schema.memorialTshirtJsonLd().offers);
  const faq = schema.faqJsonLd(legacy.FAQ);
  assert.equal(faq.mainEntity.length, 8);
  assert.equal(faq.mainEntity[0].acceptedAnswer.text, legacy.FAQ[0].answer);
});

test('legacy database defaults migrate and concurrent page loads share one initialization', async () => {
  const store = createMemoryStore(legacy);
  let connections = 0;
  const seed = loadSeed(store, async () => { connections++; });
  await Promise.all([seed.ensureSeeded(), seed.ensureSeeded(), seed.ensureSeeded()]);
  assert.equal(connections, 1);
  for (const content of store.records.PageContent) {
    assert.equal(content.seo.title, seo.PAGE_SEO[content.page].title);
    assert.equal(content.seo.description, seo.PAGE_SEO[content.page].description);
    if (content.page !== 'home') assert.equal(content.sections.hero.heading, seo.PAGE_SEO[content.page].h1);
  }
  const details = load('lib/service-details.ts').SERVICE_DETAILS;
  store.records.Service.forEach((service) => assert.equal(service.fullDescription, details[service.slug]));
  const count = store.calls.length;
  await seed.ensureSeeded();
  assert.equal(store.calls.length, count);
});

test('migration preserves customized content and repeated cold starts are safe', async () => {
  const store = createMemoryStore(legacy);
  const about = store.records.PageContent.find((page) => page.page === 'about');
  about.seo = { title: 'Approved founder title', description: 'Approved biography summary' };
  about.sections.hero.heading = 'Approved founder heading';
  store.records.Service[0].fullDescription = 'Approved custom service details';
  await loadSeed(store).ensureSeeded();
  assert.equal(about.seo.title, 'Approved founder title');
  assert.equal(about.seo.description, 'Approved biography summary');
  assert.equal(about.sections.hero.heading, 'Approved founder heading');
  assert.equal(store.records.Service[0].fullDescription, 'Approved custom service details');
  const migrated = structuredClone(store.records);
  await loadSeed(store).ensureSeeded();
  assert.deepEqual(store.records, migrated);
});

test('fresh seeding uses updated service detail and failed initialization can retry', async () => {
  const store = createMemoryStore(Object.fromEntries(Object.keys(legacy).map((name) => [name, []])));
  let attempts = 0;
  const seed = loadSeed(store, async () => { if (++attempts === 1) throw new Error('Temporary DB failure'); });
  await assert.rejects(seed.ensureSeeded(), /Temporary DB failure/);
  await seed.ensureSeeded();
  assert.equal(store.records.PageContent.length, 4);
  assert.equal(store.records.Service.length, 8);
  assert.equal(store.records.FAQ.length, 8);
  assert.ok(store.records.Service.every((service) => service.fullDescription.length > 250));
});

test('sitemap and robots cover only final public pages and declare the preferred origin', () => {
  const sitemap = load('app/sitemap.ts').default();
  assert.deepEqual(sitemap.map((entry) => entry.url),
    Object.values(seo.PAGE_SEO).map((page) => seo.absoluteUrl(page.path)));
  assert.ok(sitemap.every((entry) => !entry.lastModified && !/[?#]/.test(entry.url)));
  const robots = load('app/robots.ts').default();
  assert.equal(robots.sitemap, `${seo.SITE_URL}/sitemap.xml`);
  assert.equal(robots.rules.allow, '/');
});

test('optimized assets retain expected dimensions at substantially reduced sizes', async () => {
  const expectations = [
    ['logo.png', 720, 240, 175000], ['hero.jpg', 1672, 941, 250000],
    ['og-image.jpg', 1200, 630, 150000], ['serenity-intro-poster.jpg', 1274, 720, 100000],
  ];
  for (const [file, width, height, maxBytes] of expectations) {
    const metadata = await sharp(`public/${file}`).metadata();
    assert.equal(metadata.width, width);
    assert.equal(metadata.height, height);
    assert.ok(statSync(`public/${file}`).size < maxBytes, `${file} should stay optimized`);
  }
});

test('animated headings and service cards remain visible in server HTML before hydration', () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const FadeIn = load('components/ui/FadeIn.tsx').default;
  const ServiceCard = load('components/sections/ServiceCard.tsx').default;
  for (const element of [
    React.createElement(FadeIn, null, React.createElement('h1', null, 'Visible planning heading')),
    React.createElement(ServiceCard, { service: legacy.Service[0], detailed: true }),
  ]) {
    const html = renderToStaticMarkup(element);
    assert.ok(!/opacity:0(?:;|")/.test(html), 'Important content must not start invisible');
    assert.ok(html.includes('<h1') || html.includes(legacy.Service[0].title));
  }
});

test('shirt inquiry context accepts only the supported query value', async () => {
  const ContactForm = () => null;
  const ContactPage = createLoader({
    '@/lib/data': { getPageContent: async () => null },
    '@/components/forms/ContactForm': { __esModule: true, default: ContactForm },
    '@/components/ui/PageHero': { __esModule: true, default: () => null },
  })('app/contact/page.tsx').default;
  function findForm(element) {
    if (Array.isArray(element)) return element.map(findForm).find(Boolean);
    if (!element || typeof element !== 'object') return undefined;
    return element.type === ContactForm ? element : findForm(element.props?.children);
  }
  for (const [interest, expected] of [
    ['memorial-tshirt', 'Memorial T-Shirt'],
    [undefined, ''], ['unknown', ''], ['constructor', ''], ['__proto__', ''],
    [['memorial-tshirt', 'unknown'], ''],
  ]) {
    const page = await ContactPage({ searchParams: { interest } });
    assert.equal(findForm(page).props.defaultInterest, expected);
  }
});
