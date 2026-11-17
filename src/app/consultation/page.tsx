import type { Metadata } from "next";
import { ConsultationForm } from "@/components/consultation-form";
import { site } from "@/config/site";
import { pillars } from "@/data/studio";

export const metadata: Metadata = {
  title: "Book a consultation",
  description: "Book a consultation with DOT THREE Design Studio in Indore: studio visit, site visit or video call.",
};

export default function ConsultationPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-16 px-4 py-16 sm:px-8 lg:grid-cols-5">
      <aside className="min-w-0 lg:col-span-2">
        <p className="eyebrow">Consult · Design · Execute</p>
        <h1 className="display mt-4 text-5xl sm:text-6xl">Book a consultation</h1>
        <p className="text-ink-soft mt-6">
          Meet the studio to talk through your site, your requirements and your timeline. Pick a slot and we’ll confirm
          it on WhatsApp.
        </p>
        <ol className="mt-10 space-y-6">
          {pillars.map((p, i) => (
            <li key={p.title} className="border-greige flex gap-4 border-t pt-4">
              <span className="display text-accent text-3xl">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-ink-soft text-sm">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <address className="text-ink-soft mt-10 text-sm leading-6 not-italic">
          {site.address.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      </aside>
      <div className="min-w-0 lg:col-span-3">
        <ConsultationForm />
      </div>
    </div>
  );
}
