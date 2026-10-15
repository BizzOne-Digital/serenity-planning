// Read-only release checks: npm run verify:seo -- https://www.serenityfuneralplans.com
// For local checks supply the local origin. No inquiry or appointment is submitted.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createLoader } = require('./testing/helpers.cjs');
const { PAGE_SEO, SITE_URL, absoluteUrl } = createLoader()('lib/seo.ts');
const origin = process.argv[2] || 'http://127.0.0.1:3100';

const decode = (value = '') => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  .replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)]
  .map((match) => [match[1], decode(match[2])]));
const documents = new Map();
let imageCount = 0;

for (const page of Object.values(PAGE_SEO)) {
  const response = await fetch(new URL(page.path, origin));
  assert.equal(response.status, 200, `${page.path}: HTTP 200`);
  assert.ok(!/noindex/i.test(response.headers.get('x-robots-tag') || ''));
  const html = await response.text();
  documents.set(page.path, html);
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1]);
  assert.equal(title, page.title, `${page.path}: title`);
  assert.equal((title.match(/serenity planning/gi) || []).length, 1);
  const meta = [...html.matchAll(/<meta\b[^>]*>/g)].map((match) => attrs(match[0]));
  const metaValue = (key) => meta.find((entry) => entry.name === key || entry.property === key)?.content;
  assert.equal(metaValue('description'), page.description, `${page.path}: description`);
  assert.ok(!/noindex/i.test(metaValue('robots') || ''));
  const canonicals = [...html.matchAll(/<link\b[^>]*>/g)].map((match) => attrs(match[0]))
    .filter((entry) => entry.rel === 'canonical');
  assert.equal(canonicals.length, 1, `${page.path}: exactly one canonical`);
  assert.equal(new URL(canonicals[0].href).href, absoluteUrl(page.path));
  for (const key of ['og:title', 'og:description', 'og:url', 'og:image', 'twitter:card', 'twitter:image']) {
    assert.ok(metaValue(key), `${page.path}: ${key}`);
  }
  assert.equal(new URL(metaValue('og:url')).href, new URL(canonicals[0].href).href);
  const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
  assert.equal(headings.length, 1, `${page.path}: one H1`);
  assert.equal(decode(headings[0][1].replace(/<[^>]*>/g, '')), page.h1);
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || '';
  let previousLevel = 0;
  for (const heading of main.matchAll(/<h([1-6])\b/g)) {
    const level = Number(heading[1]);
    assert.ok(level <= previousLevel + 1, `${page.path}: heading level ${previousLevel} to ${level}`);
    previousLevel = level;
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    const image = attrs(match[0]);
    assert.ok(Object.hasOwn(image, 'alt'), `${page.path}: image alt`);
    assert.ok((Number(image.width) > 0 && Number(image.height) > 0) || image['data-nimg'] === 'fill',
      `${page.path}: image dimensions or an explicitly sized fill container`);
    assert.ok(image.srcSet || image.srcset, `${page.path}: responsive source`);
    imageCount++;
  }
  for (const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    const schema = JSON.parse(match[1]);
    if (schema['@type'] === 'ItemList') {
      assert.equal(schema.itemListElement.length, 8);
      schema.itemListElement.forEach((entry, i) => {
        assert.equal(entry['@type'], 'ListItem');
        assert.equal(entry.position, i + 1);
        assert.equal(entry.item['@type'], 'Service');
        assert.ok(!Object.hasOwn(entry.item, 'position'));
        const target = new URL(entry.item.url);
        assert.ok(target.hash, 'Service schema points to an actual section');
      });
    }
  }
  assert.ok(!/href="#"/.test(html), `${page.path}: no placeholder links`);
  console.log(`PASS ${page.path}: metadata, canonical, headings, images and JSON-LD`);
}

for (const [path, html] of documents) {
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const target = new URL(decode(match[1]), origin);
    if (![new URL(origin).origin, SITE_URL].includes(target.origin) || !target.hash) continue;
    const destination = documents.get(target.pathname);
    assert.ok(destination?.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`),
      `${path}: working destination ${target.pathname}${target.hash}`);
  }
}

const home = documents.get('/');
assert.ok(home.includes('Understand Available Plan Pricing'));
assert.ok(!home.includes('Lock In Today'));
assert.ok(!home.includes('Testimonials coming soon'));
const services = documents.get('/services');
assert.ok(services.includes('military funeral honors'));
const { SERVICE_DETAILS } = createLoader()('lib/service-details.ts');
for (const description of Object.values(SERVICE_DETAILS)) {
  // React entity-escapes text nodes in the original HTML.
  assert.ok(decode(services).includes(description), 'Full service explanation is server rendered');
}
const about = documents.get('/about');
assert.ok(about.includes('poster="/serenity-intro-poster.jpg"'));
assert.ok(about.includes('preload="metadata"'));
const shirtContact = await fetch(new URL('/contact?interest=memorial-tshirt', origin));
const contactHtml = await shirtContact.text();
assert.ok(/<option[^>]*selected=""[^>]*>Memorial T-Shirt<\/option>/.test(contactHtml), 'Shirt inquiry is preselected');
assert.equal([...contactHtml.matchAll(/<link\b[^>]*>/g)].map((match) => attrs(match[0]))
  .find((entry) => entry.rel === 'canonical')?.href, absoluteUrl('/contact'));
for (const query of ['constructor', '__proto__', 'unknown', 'memorial-tshirt&interest=unknown']) {
  const response = await fetch(new URL(`/contact?interest=${query}`, origin));
  assert.equal(response.status, 200, `Unexpected inquiry parameter stays usable: ${query}`);
}

const sitemap = await fetch(new URL('/sitemap.xml', origin));
assert.equal(sitemap.status, 200);
assert.ok(sitemap.headers.get('content-type')?.includes('xml'));
const xml = await sitemap.text();
const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]));
assert.deepEqual(locations.sort(), Object.values(PAGE_SEO).map((page) => absoluteUrl(page.path)).sort());
assert.ok(!xml.includes('<lastmod>'));
const robots = await fetch(new URL('/robots.txt', origin));
assert.equal(robots.status, 200);
assert.ok(robots.headers.get('content-type')?.includes('text/plain'));
assert.ok((await robots.text()).includes(`Sitemap: ${SITE_URL}/sitemap.xml`));
const missing = await fetch(new URL('/seo-check-nonexistent-page', origin));
assert.equal(missing.status, 404);
const slash = await fetch(new URL('/about/', origin), { redirect: 'manual' });
assert.equal(slash.status, 308);
assert.equal(new URL(slash.headers.get('location'), origin).pathname, '/about');
for (const image of ['/og-image.jpg', '/serenity-intro-poster.jpg', '/hero.jpg', '/logo.png']) {
  const response = await fetch(new URL(image, origin));
  assert.equal(response.status, 200);
  assert.ok(response.headers.get('content-type')?.startsWith('image/'));
}
console.log(`PASS ${imageCount} image instances; all service fragments, inquiry context, crawl files, share assets, slash redirect and real 404`);
