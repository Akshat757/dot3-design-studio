import { site } from "@/config/site";
import { type Audience, type Question, questions, residentialTypes } from "@/data/questionnaire";

// One shape for every answer: picked option/checkbox ids in `values`,
// free text keyed by option value, field id, or "value" for text questions.
export type Answer = { values: string[]; texts: Record<string, string> };
export type Answers = Record<string, Answer>;
export type Contact = { name: string; phone: string; via: string; time: string };

export const emptyAnswer = (): Answer => ({ values: [], texts: {} });

export function audienceOf(answers: Answers): Audience {
  const type = answers.type?.values[0];
  return !type || residentialTypes.includes(type) ? "residential" : "commercial";
}

const forAudience = <T extends { audience?: Audience }>(items: T[], audience: Audience) =>
  items.filter((i) => !i.audience || i.audience === audience);

export const visibleChoices = (q: Extract<Question, { kind: "single" | "multi" }>, audience: Audience) =>
  forAudience(q.options, audience);

export const visibleFields = (q: Extract<Question, { kind: "fields" }>, audience: Audience) =>
  forAudience(q.fields, audience);

// Picks that still apply (e.g. home-only spaces drop out if the project type changes to an office).
const pickedChoices = (q: Extract<Question, { kind: "single" | "multi" }>, a: Answer, audience: Audience) =>
  visibleChoices(q, audience).filter((o) => a.values.includes(o.value));

const clean = (s: string | undefined) => (s ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim();

export function isAnswered(q: Question, a: Answer | undefined, audience: Audience): boolean {
  if (!a) return false;
  switch (q.kind) {
    case "single":
    case "multi": {
      const picked = pickedChoices(q, a, audience);
      return picked.length > 0 && picked.every((o) => !o.withText || clean(a.texts[o.value]).length > 0);
    }
    case "fields":
      return visibleFields(q, audience).some((f) => a.values.includes(f.id) || clean(a.texts[f.id]).length > 0);
    case "text":
      return clean(a.texts.value).length > 0;
  }
}

// Optional questions can be left empty, but a started answer (e.g. "Something else" with no text) must be finished.
export function canContinue(q: Question, a: Answer | undefined, audience: Audience) {
  if (!q.optional) return isAnswered(q, a, audience);
  const started = q.kind === "single" || q.kind === "multi" ? !!a && pickedChoices(q, a, audience).length > 0 : false;
  return !started || isAnswered(q, a, audience);
}

const formatNumber = (s: string) => {
  const n = Number(s.replace(/,/g, ""));
  return Number.isFinite(n) && s.trim() !== "" ? n.toLocaleString("en-IN") : clean(s);
};

/** Human-readable answer for the review screen and the WhatsApp message, or "" if unanswered. */
export function describeAnswer(q: Question, a: Answer | undefined, audience: Audience): string {
  if (!a || !isAnswered(q, a, audience)) return "";
  switch (q.kind) {
    case "single":
    case "multi":
      return pickedChoices(q, a, audience)
        .map((o) => (o.withText ? `${o.label}: ${clean(a.texts[o.value])}` : o.label))
        .join(", ");
    case "fields": {
      const fields = visibleFields(q, audience);
      const numbers = fields
        .filter((f) => f.kind === "number" && clean(a.texts[f.id]))
        .map((f) => `${f.label} ${formatNumber(a.texts[f.id])}${f.suffix ? ` ${f.suffix}` : ""}`);
      const checks = fields.filter((f) => f.kind === "checkbox" && a.values.includes(f.id)).map((f) => f.label);
      return [...numbers, ...(checks.length ? [checks.join(", ")] : [])].join(" · ");
    }
    case "text":
      return clean(a.texts.value);
  }
}

export const isValidIndianMobile = (phone: string) => /^(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(phone.trim());

export function buildMessage(answers: Answers, contact: Contact): string {
  const audience = audienceOf(answers);
  const lines = [
    `Hello ${site.shortName}! I filled in the needs questionnaire on your website.`,
    "",
    `*Name:* ${clean(contact.name)}`,
    `*Phone:* ${clean(contact.phone)}`,
  ];
  const reach = [contact.via, contact.time].filter(Boolean).join(", ");
  if (reach) lines.push(`*Contact via:* ${clean(reach)}`);
  lines.push("");
  for (const q of questions) {
    const text = describeAnswer(q, answers[q.id], audience);
    if (text) lines.push(`*${q.summary}:* ${text}`);
  }
  return lines.join("\n");
}
