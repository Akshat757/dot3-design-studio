import { describe, expect, it } from "vitest";
import { type Booking, buildBookingMessage, buildIcs, upcomingDays } from "./booking";

const booking: Booking = {
  name: "Asha Jain",
  phone: "9876543210",
  projectType: "Residential",
  mode: "Studio visit",
  date: "2026-11-20",
  slot: "11:00",
  message: "Corner plot; east facing",
};

describe("booking", () => {
  it("skips Sundays and starts tomorrow", () => {
    // Saturday 14 Nov 2026
    const days = upcomingDays(3, new Date(2026, 10, 14));
    expect(days.map((d) => d.getDate())).toEqual([16, 17, 18]);
  });

  it("builds a readable WhatsApp message", () => {
    const msg = buildBookingMessage(booking);
    expect(msg).toContain("*Preferred slot:* Friday, 20 November at 11:00 am");
    expect(msg).toContain("*Notes:* Corner plot; east facing");
  });

  it("converts IST slots to UTC in the calendar file", () => {
    const ics = buildIcs(booking, new Date("2026-11-17T10:00:00Z"));
    expect(ics).toContain("DTSTART:20261120T053000Z");
    expect(ics).toContain("DTEND:20261120T063000Z");
    expect(ics).toContain("LOCATION:Office No. 105\\, Fortune Business Centre");
    expect(ics.split("\r\n")[0]).toBe("BEGIN:VCALENDAR");
  });
});
