import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { Cursor } from "@/components/motion/cursor";
import { Intro, introScript } from "@/components/motion/intro";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { FooterScroll } from "@/components/footer/footer-scroll";
import { FooterShowcase } from "@/components/footer/footer-showcase";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { site } from "@/config/site";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

// Free stand-in for the deck's TAN Moncheri display face until a licence is confirmed.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Architecture & Interior Design, Indore`,
    template: `%s | ${site.name}`,
  },
  description:
    "DOT THREE Design Studio is an architecture, interior, landscape and furniture design studio in Indore, Madhya Pradesh.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Intro />
        <SmoothScroll>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <div data-footer-1 className="footer-1">
            <SiteFooter />
          </div>
          <FooterShowcase />
          <FooterScroll />
        </SmoothScroll>
        <WhatsAppButton />
        <Cursor />
      </body>
    </html>
  );
}
