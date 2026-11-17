"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { contactOptions, type Question, questions } from "@/data/questionnaire";
import {
  type Answer,
  type Answers,
  type Contact,
  audienceOf,
  buildMessage,
  canContinue,
  describeAnswer,
  emptyAnswer,
  isValidIndianMobile,
} from "@/lib/questionnaire";
import { useIsClient } from "@/lib/use-is-client";
import { whatsappUrl } from "@/lib/whatsapp";
import { QuestionStep } from "./question-step";

const STORAGE_KEY = "dot3-questionnaire-v1";
const CONTACT_STEP = questions.length;
const REVIEW_STEP = questions.length + 1;

type Saved = { step: number; answers: Answers; contact: Contact };
const emptyContact: Contact = { name: "", phone: "", via: "", time: "" };

function load(): Saved | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

function save(state: Saved | null) {
  try {
    if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private mode or blocked storage: progress just isn't remembered.
  }
}

// Saved progress lives in localStorage, so the form renders only in the browser.
export function Questionnaire() {
  const isClient = useIsClient();
  if (!isClient) return <div className="mx-auto min-h-[32rem] max-w-3xl px-4 py-12 sm:px-8 sm:py-20" />;
  return <QuestionnaireForm initial={load()} />;
}

function QuestionnaireForm({ initial }: { initial: Saved | null }) {
  const [step, setStep] = useState(() => Math.min(initial?.step ?? 0, REVIEW_STEP));
  const [answers, setAnswers] = useState<Answers>(() => initial?.answers ?? {});
  const [contact, setContact] = useState<Contact>(() => ({ ...emptyContact, ...initial?.contact }));
  const [direction, setDirection] = useState(1);
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    save({ step, answers, contact });
  }, [step, answers, contact]);

  const audience = audienceOf(answers);
  const question: Question | undefined = questions[step];
  const contactValid = contact.name.trim().length > 1 && isValidIndianMobile(contact.phone);
  const canNext = question ? canContinue(question, answers[question.id], audience) : contactValid;

  const go = (to: number) => {
    setDirection(to > step ? 1 : -1);
    setStep(to);
    headingRef.current?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
  };

  const setAnswer = (id: string, a: Answer) => setAnswers((prev) => ({ ...prev, [id]: a }));

  const reset = () => {
    save(null);
    setAnswers({});
    setContact(emptyContact);
    go(0);
  };

  const message = buildMessage(answers, contact);
  const progress = Math.min(step, questions.length) / questions.length;

  return (
    <div ref={headingRef} className="mx-auto max-w-3xl scroll-mt-24 px-4 py-12 sm:px-8 sm:py-20">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">
          {question ? `Question ${step + 1} of ${questions.length}` : step === CONTACT_STEP ? "Almost done" : "Review"}
        </p>
        {step > 0 && (
          <button type="button" onClick={reset} className="text-ink-soft hover:text-accent text-xs underline">
            Start over
          </button>
        )}
      </div>
      <div
        className="bg-greige mt-4 h-px w-full overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={questions.length}
        aria-valuenow={Math.min(step, questions.length)}
        aria-label="Questionnaire progress"
      >
        <motion.div
          className="bg-accent h-full origin-left"
          animate={{ scaleX: progress }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <form
        className="mt-10 min-h-[24rem]"
        onSubmit={(e) => {
          e.preventDefault();
          if (canNext && step < REVIEW_STEP) go(step + 1);
        }}
      >
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {question && (
              <QuestionStep
                question={question}
                answer={answers[question.id] ?? emptyAnswer()}
                audience={audience}
                onChange={(a) => setAnswer(question.id, a)}
              />
            )}

            {step === CONTACT_STEP && <ContactStep contact={contact} onChange={setContact} />}

            {step === REVIEW_STEP && (
              <div>
                <h2 className="display text-4xl sm:text-5xl">Review your answers</h2>
                <p className="text-ink-soft mt-3">Sending opens WhatsApp with your answers filled in. Just tap send.</p>
                <dl className="divide-greige border-greige mt-8 divide-y border-y">
                  {questions.map((q, i) => {
                    const text = describeAnswer(q, answers[q.id], audience);
                    return (
                      <div key={q.id} className="flex items-start justify-between gap-4 py-3">
                        <div>
                          <dt className="eyebrow">{q.summary}</dt>
                          <dd className={`mt-1 text-sm ${text ? "" : "text-ink-soft italic"}`}>{text || "Skipped"}</dd>
                        </div>
                        <button
                          type="button"
                          onClick={() => go(i)}
                          className="text-accent shrink-0 text-xs underline"
                          aria-label={`Edit ${q.summary}`}
                        >
                          Edit
                        </button>
                      </div>
                    );
                  })}
                  <div className="flex items-start justify-between gap-4 py-3">
                    <div>
                      <dt className="eyebrow">Contact</dt>
                      <dd className="mt-1 text-sm">
                        {contact.name} · {contact.phone}
                        {contact.via && ` · ${contact.via}`}
                        {contact.time && `, ${contact.time.toLowerCase()}`}
                      </dd>
                    </div>
                    <button type="button" onClick={() => go(CONTACT_STEP)} className="text-accent text-xs underline">
                      Edit
                    </button>
                  </div>
                </dl>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={whatsappUrl(message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#25d366] px-6 py-3 text-sm font-medium text-white hover:brightness-95"
                  >
                    Send on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(message);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      } catch {
                        setCopied(false);
                      }
                    }}
                    className="border-ink hover:bg-ink hover:text-paper rounded-full border px-6 py-3 text-sm"
                  >
                    {copied ? "Copied" : "Copy answers"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {step < REVIEW_STEP && (
          <div className="border-greige mt-12 flex items-center justify-between border-t pt-6">
            <button
              type="button"
              onClick={() => go(step - 1)}
              disabled={step === 0}
              className="text-ink-soft hover:text-ink text-sm disabled:invisible"
            >
              ← Back
            </button>
            <div className="flex items-center gap-4">
              {question?.optional && !isAnsweredOrStarted(answers[question.id]) && (
                <button type="button" onClick={() => go(step + 1)} className="text-ink-soft hover:text-ink text-sm">
                  Skip
                </button>
              )}
              <button
                type="submit"
                disabled={!canNext}
                className="bg-ink text-paper hover:bg-accent disabled:bg-greige disabled:text-ink-soft rounded-full px-6 py-3 text-sm transition-colors"
              >
                {step === CONTACT_STEP ? "Review" : "Next →"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

const isAnsweredOrStarted = (a: Answer | undefined) =>
  !!a && (a.values.length > 0 || Object.values(a.texts).some((t) => t.trim()));

function ContactStep({ contact, onChange }: { contact: Contact; onChange: (c: Contact) => void }) {
  const phoneTouched = contact.phone.trim().length > 0;
  const phoneValid = isValidIndianMobile(contact.phone);
  return (
    <div>
      <h2 className="display text-4xl sm:text-5xl">How can we reach you?</h2>
      <p className="text-ink-soft mt-3">The studio will get back to you on this number.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow">Full name</span>
          <input
            autoComplete="name"
            value={contact.name}
            onChange={(e) => onChange({ ...contact, name: e.target.value })}
            className="border-greige focus:border-ink mt-2 w-full border-b bg-transparent py-2 text-lg outline-none"
            required
          />
        </label>
        <label className="block">
          <span className="eyebrow">Mobile number</span>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 98XXX XXXXX"
            value={contact.phone}
            onChange={(e) => onChange({ ...contact, phone: e.target.value })}
            aria-invalid={phoneTouched && !phoneValid}
            aria-describedby="phone-hint"
            className="border-greige focus:border-ink mt-2 w-full border-b bg-transparent py-2 text-lg outline-none"
            required
          />
          <span id="phone-hint" className="text-ink-soft mt-1 block text-xs">
            {phoneTouched && !phoneValid ? "Enter a 10-digit Indian mobile number." : " "}
          </span>
        </label>
      </div>
      <ChipGroup
        label="Preferred way to talk"
        options={contactOptions.via}
        value={contact.via}
        onChange={(via) => onChange({ ...contact, via })}
      />
      <ChipGroup
        label="Best time to reach you"
        options={contactOptions.time}
        value={contact.time}
        onChange={(time) => onChange({ ...contact, time })}
      />
    </div>
  );
}

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="mt-8">
      <legend className="eyebrow">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(value === o ? "" : o)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              value === o ? "border-ink bg-ink text-paper" : "border-greige hover:border-ink"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
