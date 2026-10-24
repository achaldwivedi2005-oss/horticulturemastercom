import { describe, expect, it } from "vitest";
import { categorize, cleanTitle } from "./categorize";

describe("study material categories", () => {
  it("puts PYQ papers under Competitive Exam Preparation", () => {
    expect(categorize("ICAR_AIEEA_PG_2020.pdf", ["ICAR JRF PYQ"])).toContain("Competitive Exam Preparation");
  });

  it("detects Vegetable Science from olericulture", () => {
    expect(categorize("MCQ Objective Olericulture.pdf", ["Books"])).toContain("Vegetable Science");
  });

  it("uses the subfolder name for the subject", () => {
    expect(categorize("paper 2021.pdf", ["ICAR SRF PYQ", "Floriculture "])).toContain("Floriculture");
  });

  it("falls back to General Horticulture", () => {
    expect(categorize("notes.pdf", ["Books"])).toEqual(["General Horticulture"]);
  });

  it("cleans file names into titles", () => {
    expect(cleanTitle("vegetable varieties.pdf.pdf")).toBe("vegetable varieties");
    expect(cleanTitle("ICAR AIEEA PG Horticulture 2019 pyq pdf")).toBe("ICAR AIEEA PG Horticulture 2019 pyq");
  });
});
