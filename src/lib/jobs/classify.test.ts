import { describe, expect, it } from "vitest";
import { classifyJob, daysUntil, isNewJob, normaliseDate } from "./classify";

describe("job categories", () => {
  it("tags Young Professional posts at ICAR institutes", () => {
    const c = classifyJob({ title: "Young Professional-II (YP-II)", institute: "ICAR-IARI, New Delhi" });
    expect(c).toContain("Young Professional");
    expect(c).toContain("ICAR");
  });

  it("tags SRF and JRF positions", () => {
    expect(classifyJob({ title: "Senior Research Fellow (SRF)" })).toContain("SRF/JRF");
    expect(classifyJob({ title: "Junior Research Fellow" })).toContain("SRF/JRF");
  });

  it("tags horticulture posts", () => {
    expect(classifyJob({ title: "YP-I, Division of Vegetable Science" })).toContain("Horticulture");
  });

  it("tags government officer posts", () => {
    expect(classifyJob({ title: "Horticulture Development Officer", organisationType: "Government" })).toContain(
      "Government Jobs",
    );
  });
});

describe("job dates", () => {
  it("marks a job new for 3 days after detection", () => {
    const now = new Date("2026-10-24T12:00:00Z").getTime();
    expect(isNewJob("2026-10-22T12:00:00Z", now)).toBe(true);
    expect(isNewJob("2026-10-20T12:00:00Z", now)).toBe(false);
  });

  it("counts days left until the deadline and goes negative when expired", () => {
    const now = new Date("2026-10-24T06:00:00Z");
    expect(daysUntil("2026-10-30", now)).toBe(7);
    expect(daysUntil("2026-10-20", now)! < 0).toBe(true);
    expect(daysUntil(null, now)).toBeNull();
  });

  it("rejects invented or malformed dates", () => {
    expect(normaliseDate("2026-02-30")).toBeNull();
    expect(normaliseDate("30/10/2026")).toBeNull();
    expect(normaliseDate("2026-11-13")).toBe("2026-11-13");
  });
});
