import { site } from "@/config/site";

// Keeps the wa.me URL under practical length limits on Android/iOS.
const MAX_MESSAGE_CHARS = 3500;

export function whatsappUrl(message: string, number: string = site.whatsapp): string {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message.slice(0, MAX_MESSAGE_CHARS))}`;
}

export const defaultMessage = `Hello ${site.shortName}, I'd like to talk about a project.`;
