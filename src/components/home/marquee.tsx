/** Endless ribbon of words, duplicated once so the CSS loop is seamless. */
export function Marquee({ words }: { words: readonly string[] }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {words.map((w) => (
        <span key={w} className="flex items-center">
          <span className="display px-8 text-5xl whitespace-nowrap sm:text-7xl">{w}</span>
          <span className="bg-accent size-3 rounded-full" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="border-greige overflow-hidden border-y py-8">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
