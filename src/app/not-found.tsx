import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-32 text-center sm:px-8">
      <p className="eyebrow">404</p>
      <h1 className="display mt-4 text-6xl">This space is still on the drawing board</h1>
      <Link href="/" className="bg-ink text-paper hover:bg-accent mt-10 inline-block rounded-full px-6 py-3 text-sm">
        Back home
      </Link>
    </div>
  );
}
