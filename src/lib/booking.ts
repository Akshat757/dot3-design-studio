import { site } from "@/config/site";

// TODO(client): confirm studio days and consultation slots. Times are IST.
export const bookingSlots = [
  { id: "11:00", label: "11:00 am" },
  { id: "12:30", label: "12:30 pm" },
  { id: "15:00", label: "3:00 pm" },
  { id: "16:30", label: "4:30 pm" },
  { id: "18:00", label: "6:00 pm" },
];
export const closedWeekdays = [0]; // Sunday
export const meetingModes = ["Studio visit", "Site visit", "Video call"];
export const MEETING_MINUTES = 60;

export type Booking = {
  name: string;
  phone: string;
  projectType: string;
  mode: string;
  date: string; // YYYY-MM-DD
  slot: string; // HH:mm, IST
  message: string;
};

const pad = (n: number) => String(n).padStart(2, "0");
export const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** The next `count` open days, starting tomorrow. */
export function upcomingDays(count: number, from = new Date()): Date[] {
  const days: Date[] = [];
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  while (days.length < count) {
    d.setDate(d.getDate() + 1);
    if (!closedWeekdays.includes(d.getDay())) days.push(new Date(d));
  }
  return days;
}

export function formatDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}

const slotLabel = (slot: string) => bookingSlots.find((s) => s.id === slot)?.label ?? slot;
const clean = (s: string) => s.replace(/[\u0000-\u001f\u007f]/g, " ").trim();

export function buildBookingMessage(b: Booking): string {
  const lines = [
    `Hello ${site.shortName}! I'd like to book a consultation.`,
    "",
    `*Name:* ${clean(b.name)}`,
    `*Phone:* ${clean(b.phone)}`,
    `*Project:* ${b.projectType}`,
    `*Meeting:* ${b.mode}`,
    `*Preferred slot:* ${formatDate(b.date)} at ${slotLabel(b.slot)}`,
  ];
  if (clean(b.message)) lines.push(`*Notes:* ${clean(b.message)}`);
  return lines.join("\n");
}

// IST is UTC+5:30 all year, so local IST time converts to UTC with a fixed offset.
function istToUtcStamp(date: string, time: string, addMinutes = 0): string {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d, hh, mm) - 330 * 60_000 + addMinutes * 60_000);
  return `${utc.getUTCFullYear()}${pad(utc.getUTCMonth() + 1)}${pad(utc.getUTCDate())}T${pad(utc.getUTCHours())}${pad(utc.getUTCMinutes())}00Z`;
}

const icsEscape = (s: string) =>
  s
    .replace(/\\/g, "\\\\")
    .replace(/[,;]/g, (c) => `\\${c}`)
    .replace(/\r?\n/g, "\\n");

export function buildIcs(b: Booking, now = new Date()): string {
  const location = b.mode === "Studio visit" ? site.address.lines.join(", ") : b.mode;
  const stamp = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DOT THREE Design Studio//Consultation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${b.date}-${b.slot.replace(":", "")}-${Math.abs(hash(b.phone))}@dotthreedesignstudio.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${istToUtcStamp(b.date, b.slot)}`,
    `DTEND:${istToUtcStamp(b.date, b.slot, MEETING_MINUTES)}`,
    `SUMMARY:${icsEscape(`Consultation with ${site.name} (requested)`)}`,
    `LOCATION:${icsEscape(location)}`,
    `DESCRIPTION:${icsEscape(`${b.mode} for ${b.projectType}. The studio will confirm this slot on WhatsApp. Phone: ${site.phones.join(" / ")}`)}`,
    "STATUS:TENTATIVE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return h;
}
