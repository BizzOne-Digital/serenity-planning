export default function PageHero({ heading, subtext }: { heading: string; subtext?: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-deep to-purple-primary py-24 md:py-32 text-center">
      <svg
        className="pointer-events-none absolute -top-10 -right-10 h-64 w-64 opacity-20"
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="90" fill="none" stroke="#D6AD55" strokeWidth="1" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="#D6AD55" strokeWidth="1" />
      </svg>
      <div className="relative mx-auto max-w-3xl px-6">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-ivory">{heading}</h1>
        {subtext && <p className="mt-5 text-lg text-ivory/80 leading-relaxed">{subtext}</p>}
      </div>
    </section>
  );
}
