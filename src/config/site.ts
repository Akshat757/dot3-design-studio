// Single source for studio contact details. Everything else reads from here.
export const site = {
  name: "DOT THREE Design Studio",
  shortName: "DOT THREE",
  tagline: "Manifesting dreams",
  disciplines: ["Architecture", "Interior", "Landscape", "Furniture"],
  url: "https://www.dotthreedesignstudio.com",
  email: "dotthreedesignstudio@gmail.com",
  phones: ["+91 98060 50877", "+91 75099 33333"],
  // TODO(client): confirm which number receives WhatsApp leads.
  whatsapp: "919806050877",
  address: {
    lines: ["Office No. 105, Fortune Business Centre", "165 R.N.T. Marg, Madhumilan Square", "Indore, Madhya Pradesh"],
    mapUrl: "https://maps.google.com/?q=Fortune+Business+Centre+Madhumilan+Square+Indore",
  },
  social: {} as Record<string, string>,
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/projects/", label: "Projects" },
  { href: "/about/", label: "Studio" },
  { href: "/questionnaire/", label: "Find your needs" },
] as const;
