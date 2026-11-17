"use client";

import Image from "next/image";
import type { Audience, Question } from "@/data/questionnaire";
import { type Answer, visibleChoices, visibleFields } from "@/lib/questionnaire";

type Props = {
  question: Question;
  answer: Answer;
  audience: Audience;
  onChange: (a: Answer) => void;
};

export function QuestionStep({ question, answer, audience, onChange }: Props) {
  const setText = (key: string, value: string) => onChange({ ...answer, texts: { ...answer.texts, [key]: value } });

  return (
    <fieldset>
      <legend className="display text-4xl leading-tight sm:text-5xl">{question.title}</legend>
      {question.help && <p className="text-ink-soft mt-3">{question.help}</p>}
      {question.optional && <p className="eyebrow mt-3">Optional</p>}

      <div className="mt-8">
        {(question.kind === "single" || question.kind === "multi") && (
          <Choices question={question} answer={answer} audience={audience} onChange={onChange} setText={setText} />
        )}

        {question.kind === "fields" && (
          <div className="grid gap-6 sm:grid-cols-2">
            {visibleFields(question, audience).map((f) =>
              f.kind === "number" ? (
                <label key={f.id} className="block">
                  <span className="eyebrow">{f.label}</span>
                  <span className="border-greige focus-within:border-ink mt-2 flex items-baseline gap-2 border-b">
                    <input
                      inputMode="numeric"
                      value={answer.texts[f.id] ?? ""}
                      onChange={(e) => setText(f.id, e.target.value.replace(/[^\d,.]/g, ""))}
                      className="w-full bg-transparent py-2 text-lg outline-none"
                    />
                    {f.suffix && <span className="text-ink-soft text-sm">{f.suffix}</span>}
                  </span>
                </label>
              ) : (
                <label key={f.id} className="flex cursor-pointer items-center gap-3 self-end py-2">
                  <input
                    type="checkbox"
                    checked={answer.values.includes(f.id)}
                    onChange={(e) =>
                      onChange({
                        ...answer,
                        values: e.target.checked ? [...answer.values, f.id] : answer.values.filter((v) => v !== f.id),
                      })
                    }
                    className="accent-accent size-5"
                  />
                  <span>{f.label}</span>
                </label>
              ),
            )}
          </div>
        )}

        {question.kind === "text" && (
          <textarea
            rows={4}
            maxLength={600}
            placeholder={question.placeholder}
            value={answer.texts.value ?? ""}
            onChange={(e) => setText("value", e.target.value)}
            aria-label={question.title}
            className="border-greige focus:border-ink w-full border bg-transparent p-4 text-lg outline-none"
          />
        )}
      </div>
    </fieldset>
  );
}

function Choices({
  question,
  answer,
  audience,
  onChange,
  setText,
}: Props & { question: Extract<Question, { kind: "single" | "multi" }>; setText: (k: string, v: string) => void }) {
  const options = visibleChoices(question, audience);
  const multi = question.kind === "multi";
  const max = multi ? question.max : 1;
  const hasImages = options.some((o) => o.image);

  const toggle = (value: string) => {
    if (!multi) return onChange({ ...answer, values: [value] });
    const on = answer.values.includes(value);
    if (on) return onChange({ ...answer, values: answer.values.filter((v) => v !== value) });
    if (max && answer.values.length >= max) return;
    onChange({ ...answer, values: [...answer.values, value] });
  };

  return (
    <>
      <div className={hasImages ? "grid grid-cols-2 gap-3 sm:grid-cols-3" : "flex flex-col gap-2"}>
        {options.map((o) => {
          const selected = answer.values.includes(o.value);
          const atMax = multi && !!max && answer.values.length >= max && !selected;
          return (
            <button
              key={o.value}
              type="button"
              role={multi ? "checkbox" : "radio"}
              aria-checked={selected}
              disabled={atMax}
              onClick={() => toggle(o.value)}
              className={`group relative overflow-hidden border text-left transition-colors disabled:opacity-40 ${
                selected ? "border-ink bg-ink text-paper" : "border-greige hover:border-ink"
              } ${hasImages ? "" : "px-5 py-4"}`}
            >
              {hasImages ? (
                <>
                  {o.image ? (
                    <Image
                      src={o.image}
                      alt=""
                      width={400}
                      height={300}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="bg-mist text-ink-soft flex aspect-[4/3] w-full items-center justify-center text-3xl">
                      ?
                    </span>
                  )}
                  <span className="block px-3 py-2 text-sm">{o.label}</span>
                </>
              ) : (
                <span className="flex items-center justify-between gap-4">
                  <span>{o.label}</span>
                  <span
                    aria-hidden
                    className={`size-4 shrink-0 border ${multi ? "" : "rounded-full"} ${
                      selected ? "border-paper bg-paper" : "border-ink-soft"
                    }`}
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>
      {options
        .filter((o) => o.withText && answer.values.includes(o.value))
        .map((o) => (
          <label key={o.value} className="mt-6 block">
            <span className="eyebrow">{o.withText}</span>
            <input
              autoFocus
              maxLength={120}
              value={answer.texts[o.value] ?? ""}
              onChange={(e) => setText(o.value, e.target.value)}
              className="border-greige focus:border-ink mt-2 w-full border-b bg-transparent py-2 text-lg outline-none"
            />
          </label>
        ))}
    </>
  );
}
