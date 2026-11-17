import Link from "next/link";
import { nav, site } from "@/config/site";
import { services } from "@/data/studio";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="bg-greige/50 mt-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="text-ink-soft mt-4 max-w-sm text-sm">{site.disciplines.join(" · ")}</p>
          <address className="text-ink-soft mt-6 text-sm leading-6 not-italic">
            {site.address.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact/" className="hover:text-accent">
                Contact
              </Link>
            </li>
          </ul>
          <p className="eyebrow mt-8">Services</p>
          <p className="text-ink-soft mt-4 text-sm">{services.map((s) => s.title).join(" · ")}</p>
        </div>
        <div>
          <p className="eyebrow">Keep in touch</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-accent">
                {site.email}
              </a>
            </li>
            {site.phones.map((phone) => (
              <li key={phone}>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-accent">
                  {phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-greige text-ink-soft border-t px-4 py-6 text-center text-xs">
        © {new Date().getFullYear()} {site.name}
      </p>
    </footer>
  );
}
