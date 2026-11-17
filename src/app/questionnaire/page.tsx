import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find your needs",
  description: "Answer 15 quick questions and send your project brief to DOT THREE on WhatsApp.",
};

// Phase 2: the step-by-step questionnaire from QUESTIONNAIRE.md goes here once the client approves the questions.
export default function QuestionnairePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-8">
      <p className="eyebrow">Find your needs</p>
      <h1 className="display mt-4 text-6xl">Tell us about your project</h1>
      <p className="text-ink-soft mt-6">
        Fifteen quick questions about your site, your space and your plans. Your answers go straight to the studio on
        WhatsApp.
      </p>
      <p className="eyebrow mt-10">Coming soon</p>
      <Link
        href="/consultation/"
        className="bg-ink text-paper hover:bg-accent mt-6 inline-block rounded-full px-6 py-3 text-sm"
      >
        Book a consultation instead
      </Link>
    </div>
  );
}
