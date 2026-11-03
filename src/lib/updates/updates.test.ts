import { describe, expect, it } from "vitest";
import { parseKeyDates, updateWindow } from "./updates";

const now = new Date("2026-10-27T12:00:00+05:30");

describe("updateWindow", () => {
  it("marks a last date that has passed as CLOSED", () => {
    expect(updateWindow("2026-10-24", 7, now)).toBe("CLOSED");
  });
  it("marks a last date within 7 days as CLOSING SOON", () => {
    expect(updateWindow("2026-11-02", 7, now)).toBe("CLOSING SOON");
  });
  it("marks a later last date as OPEN", () => {
    expect(updateWindow("2026-11-30", 7, now)).toBe("OPEN");
  });
  it("shows no status when no official last date exists", () => {
    expect(updateWindow(null, 7, now)).toBeNull();
  });
});

describe("parseKeyDates", () => {
  it("keeps labelled entries and drops malformed ones", () => {
    expect(parseKeyDates([{ label: "Mains", text: "March 2027 (tentative)" }, { nope: 1 }, "x"])).toEqual([
      { label: "Mains", date: null, text: "March 2027 (tentative)" },
    ]);
  });
});
