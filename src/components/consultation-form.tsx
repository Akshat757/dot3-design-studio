"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { services } from "@/data/studio";
import {
  type Booking,
  bookingSlots,
  buildBookingMessage,
  buildIcs,
  formatDate,
  isoDate,
  meetingModes,
  upcomingDays,
} from "@/lib/booking";
import { isValidIndianMobile } from "@/lib/questionnaire";
import { useIsClient } from "@/lib/use-is-client";
import { whatsappUrl } from "@/lib/whatsapp";

const empty: Booking = { name: "", phone: "", projectType: "", mode: "", date: "", slot: "", message: "" };

// Dates depend on today, so the form renders only in the browser (the site is built once, ahead of time).
export function ConsultationForm() {
  const isClient = useIsClient();
  if (!isClient) return <div className="min-h-[40rem]" />;
  return <BookingForm />;
}

function BookingForm() {
  const [form, setForm] = useState<Booking>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);
  const [days] = useState(() => upcomingDays(12));
  const set = <K extends keyof Booking>(key: K, value: Booking[K]) => setForm((f) => ({ ...f, [key]: value }));

  const errors = {
    name: form.name.trim().length < 2 ? "Enter your name." : "",
    phone: !isValidIndianMobile(form.phone) ? "Enter a 10-digit Indian mobile number." : "",
    projectType: !form.projectType ? "Choose a project type." : "",
    mode: !form.mode ? "Choose how you'd like to meet." : "",
    date: !form.date ? "Pick a date." : "",
    slot: !form.slot ? "Pick a time." : "",
  };
  const valid = Object.values(errors).every((e) => !e);
  const show = (key: keyof typeof errors) => (submitted ? errors[key] : "");

  const downloadIcs = () => {
    const url = URL.createObjectURL(new Blob([buildIcs(form)], { type: "text/calendar;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "dot-three-consultation.ics" });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-greige border p-8 text-center sm:p-12"
        >
          <p className="eyebrow">Request sent</p>
          <h2 className="display mt-4 text-4xl">See you soon, {form.name.trim().split(" ")[0]}</h2>
          <p className="text-ink-soft mt-4">
            You asked for {formatDate(form.date)} at {bookingSlots.find((s) => s.id === form.slot)?.label}. The studio
            will confirm the slot on WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={downloadIcs}
              className="border-ink hover:bg-ink hover:text-paper rounded-full border px-6 py-3 text-sm"
            >
              Add to calendar (.ics)
            </button>
            <a
              href={whatsappUrl(buildBookingMessage(form))}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-soft px-6 py-3 text-sm underline"
            >
              Open WhatsApp again
            </a>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0, y: -20 }}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
            if (!valid) return;
            window.open(whatsappUrl(buildBookingMessage(form)), "_blank", "noopener,noreferrer");
            setSent(true);
          }}
          className="space-y-10"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField
              label="Full name"
              autoComplete="name"
              value={form.name}
              onChange={(v) => set("name", v)}
              error={show("name")}
            />
            <TextField
              label="Mobile number"
              type="tel"
              autoComplete="tel"
              placeholder="+91 98XXX XXXXX"
              value={form.phone}
              onChange={(v) => set("phone", v)}
              error={show("phone")}
            />
          </div>

          <Chips
            label="Project type"
            options={services.map((s) => s.title)}
            value={form.projectType}
            onChange={(v) => set("projectType", v)}
            error={show("projectType")}
          />
          <Chips
            label="How would you like to meet?"
            options={meetingModes}
            value={form.mode}
            onChange={(v) => set("mode", v)}
            error={show("mode")}
          />

          <fieldset className="min-w-0">
            <legend className="eyebrow">Preferred date</legend>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {days.map((d) => {
                const iso = isoDate(d);
                const on = form.date === iso;
                return (
                  <button
                    key={iso}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set("date", iso)}
                    className={`flex min-w-16 flex-col items-center border px-3 py-3 transition-colors ${
                      on ? "border-ink bg-ink text-paper" : "border-greige hover:border-ink"
                    }`}
                  >
                    <span className="text-xs uppercase">{d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
                    <span className="display text-2xl">{d.getDate()}</span>
                    <span className="text-xs">{d.toLocaleDateString("en-IN", { month: "short" })}</span>
                  </button>
                );
              })}
            </div>
            <ErrorText text={show("date")} />
          </fieldset>

          <Chips
            label="Preferred time"
            options={bookingSlots.map((s) => s.label)}
            value={bookingSlots.find((s) => s.id === form.slot)?.label ?? ""}
            onChange={(label) => set("slot", bookingSlots.find((s) => s.label === label)?.id ?? "")}
            error={show("slot")}
          />

          <label className="block">
            <span className="eyebrow">Anything we should know? (optional)</span>
            <textarea
              rows={3}
              maxLength={500}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              className="border-greige focus:border-ink mt-2 w-full border bg-transparent p-3 outline-none"
            />
          </label>

          <div>
            <button
              type="submit"
              className="rounded-full bg-[#25d366] px-8 py-4 text-sm font-medium text-white hover:brightness-95"
            >
              Request slot on WhatsApp
            </button>
            <p className="text-ink-soft mt-3 text-xs">
              Opens WhatsApp with your request filled in. The studio confirms the slot there.
            </p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function TextField({
  label,
  value,
  onChange,
  error,
  ...rest
}: { label: string; value: string; onChange: (v: string) => void; error: string } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
>) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className="border-greige focus:border-ink mt-2 w-full border-b bg-transparent py-2 text-lg outline-none"
      />
      <ErrorText text={error} />
    </label>
  );
}

function Chips({
  label,
  options,
  value,
  onChange,
  error,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error: string;
}) {
  return (
    <fieldset>
      <legend className="eyebrow">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              value === o ? "border-ink bg-ink text-paper" : "border-greige hover:border-ink"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      <ErrorText text={error} />
    </fieldset>
  );
}

const ErrorText = ({ text }: { text: string }) =>
  text ? (
    <span role="alert" className="text-accent mt-2 block text-xs">
      {text}
    </span>
  ) : null;
