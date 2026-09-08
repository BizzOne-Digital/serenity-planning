export default function SectionHeading({
  eyebrow,
  heading,
  subtext,
  align = "center",
  dark = false,
}: {
  eyebrow?: string;
  heading: string;
  subtext?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <div className={`mb-10 md:mb-14 ${align === "center" ? "text-center mx-auto max-w-2xl" : "text-left"}`}>
      {eyebrow && (
        <p className={`mb-2 text-sm font-semibold uppercase tracking-widest ${dark ? "text-gold-warm" : "text-gold-warm"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-serif text-3xl md:text-4xl font-semibold ${dark ? "text-ivory" : "text-purple-deep"}`}>
        {heading}
      </h2>
      {subtext && (
        <p className={`mt-4 text-base md:text-lg leading-relaxed ${dark ? "text-ivory/80" : "text-ink/70"}`}>
          {subtext}
        </p>
      )}
    </div>
  );
}
