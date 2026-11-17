import { describe, expect, it } from "vitest";
import { questions } from "@/data/questionnaire";
import {
  type Answers,
  audienceOf,
  buildMessage,
  canContinue,
  describeAnswer,
  isValidIndianMobile,
} from "./questionnaire";

const q = (id: string) => questions.find((x) => x.id === id)!;
const contact = { name: "Rohan Sharma", phone: "+91 98765 43210", via: "WhatsApp call", time: "Evening" };

describe("questionnaire", () => {
  it("has 15 questions with unique ids", () => {
    expect(questions).toHaveLength(15);
    expect(new Set(questions.map((x) => x.id)).size).toBe(15);
  });

  it("derives audience from project type", () => {
    expect(audienceOf({})).toBe("residential");
    expect(audienceOf({ type: { values: ["office"], texts: {} } })).toBe("commercial");
    expect(audienceOf({ type: { values: ["farmhouse"], texts: {} } })).toBe("residential");
  });

  it("requires the text for 'other' style options", () => {
    const loc = q("location");
    expect(canContinue(loc, { values: ["mp"], texts: {} }, "residential")).toBe(false);
    expect(canContinue(loc, { values: ["mp"], texts: { mp: "Dewas" } }, "residential")).toBe(true);
    expect(describeAnswer(loc, { values: ["mp"], texts: { mp: "Dewas" } }, "residential")).toBe(
      "Elsewhere in Madhya Pradesh: Dewas",
    );
  });

  it("lets optional questions be skipped but not left half-done", () => {
    const features = q("features");
    expect(canContinue(features, undefined, "residential")).toBe(true);
    expect(canContinue(features, { values: ["other"], texts: {} }, "residential")).toBe(false);
  });

  it("drops picks that no longer apply after the project type changes", () => {
    const spaces = q("spaces");
    const a = { values: ["pooja", "reception"], texts: {} };
    expect(describeAnswer(spaces, a, "residential")).toBe("Pooja room");
    expect(describeAnswer(spaces, a, "commercial")).toBe("Reception / lobby");
  });

  it("formats size fields with Indian number grouping", () => {
    const size = q("size");
    expect(describeAnswer(size, { values: [], texts: { plot: "240000", floors: "3" } }, "residential")).toBe(
      "Plot area 2,40,000 sq ft · Floors planned 3",
    );
  });

  it("builds the WhatsApp message with answered questions only", () => {
    const answers: Answers = {
      type: { values: ["home"], texts: {} },
      location: { values: ["indore"], texts: {} },
      budget: { values: ["50-1cr"], texts: {} },
      notes: { values: [], texts: { value: "Need parking\nfor 2 cars" } },
    };
    const msg = buildMessage(answers, contact);
    expect(msg).toContain("*Name:* Rohan Sharma");
    expect(msg).toContain("*Contact via:* WhatsApp call, Evening");
    expect(msg).toContain("*Project:* Home / bungalow");
    expect(msg).toContain("*Budget:* ₹50 lakh – 1 crore");
    expect(msg).toContain("*Notes:* Need parking for 2 cars");
    expect(msg).not.toContain("*Vastu:*");
  });

  it("validates Indian mobile numbers", () => {
    for (const ok of ["9876543210", "+91 98765 43210", "91-98765-43210", "+919876543210"])
      expect(isValidIndianMobile(ok)).toBe(true);
    for (const bad of ["12345", "5876543210", "98765 4321", "+1 98765 43210"])
      expect(isValidIndianMobile(bad)).toBe(false);
  });
});
