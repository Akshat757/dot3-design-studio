import type { Metadata } from "next";
import { site } from "@/config/site";
import { defaultMessage, whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description: "Visit, call, email or WhatsApp DOT THREE Design Studio in Indore.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-8">
      <p className="eyebrow">Keep in touch</p>
      <h1 className="display mt-4 text-6xl">Contact</h1>
      <dl className="mt-12 grid gap-10 sm:grid-cols-2">
        <div>
          <dt className="eyebrow">Studio</dt>
          <dd className="mt-2 leading-7">
            {site.address.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <a
              href={site.address.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent mt-2 inline-block underline"
            >
              Open in Maps
            </a>
          </dd>
        </div>
        <div className="space-y-6">
          <div>
            <dt className="eyebrow">Email</dt>
            <dd className="mt-2">
              <a href={`mailto:${site.email}`} className="hover:text-accent">
                {site.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Phone</dt>
            {site.phones.map((phone) => (
              <dd key={phone} className="mt-2">
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-accent">
                  {phone}
                </a>
              </dd>
            ))}
          </div>
          <a
            href={whatsappUrl(defaultMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-ink text-paper hover:bg-accent inline-block rounded-full px-6 py-3 text-sm"
          >
            Message us on WhatsApp
          </a>
        </div>
      </dl>
    </div>
  );
}
