import type { Metadata } from "next";
import { Questionnaire } from "@/components/questionnaire/questionnaire";

export const metadata: Metadata = {
  title: "Find your needs",
  description: "Answer 15 quick questions and send your project brief to DOT THREE on WhatsApp.",
};

export default function QuestionnairePage() {
  return (
    <>
      <header className="bg-stone">
        <div className="mx-auto max-w-3xl px-4 pt-16 pb-12 sm:px-8">
          <p className="eyebrow">Find your needs</p>
          <h1 className="display mt-4 text-5xl sm:text-6xl">Tell us about your project</h1>
          <p className="text-ink-soft mt-4">
            Fifteen quick questions about your site, your space and your plans. It takes about three minutes, and your
            answers go straight to the studio on WhatsApp.
          </p>
        </div>
      </header>
      <Questionnaire />
    </>
  );
}
