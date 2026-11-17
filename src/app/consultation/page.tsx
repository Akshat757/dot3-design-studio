import type { Metadata } from "next";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Book a consultation",
  description: "Book a consultation with DOT THREE Design Studio in Indore.",
};

// Phase 4: port the booking form (name, phone, project type, slot → WhatsApp + .ics) from reference/.
export default function ConsultationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-8">
      <p className="eyebrow">Consult · Design · Execute</p>
      <h1 className="display mt-4 text-6xl">Book a consultation</h1>
      <p className="text-ink-soft mt-6">Meet the studio to talk through your site, requirements and timeline.</p>
      <a
        href={whatsappUrl("Hello DOT THREE, I'd like to book a consultation.")}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-ink text-paper hover:bg-accent mt-10 inline-block rounded-full px-6 py-3 text-sm"
      >
        Book on WhatsApp
      </a>
    </div>
  );
}
