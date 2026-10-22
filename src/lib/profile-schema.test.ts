import { describe, expect, it } from "vitest";
import { profileSchema } from "./profile-schema";

const base = {
  full_name: "Asha Patel",
  target_exam: "ICAR JRF" as const,
  university: "Anand Agricultural University, Anand",
  state: "Gujarat",
};

describe("student profile rules", () => {
  it("phone number is optional", () => {
    expect(profileSchema.safeParse({ ...base, phone: "" }).success).toBe(true);
  });

  it("rejects a phone number with letters", () => {
    expect(profileSchema.safeParse({ ...base, phone: "98abc12345" }).success).toBe(false);
  });

  it("only accepts the supported target exams", () => {
    expect(profileSchema.safeParse({ ...base, target_exam: "GATE" }).success).toBe(false);
    expect(profileSchema.safeParse({ ...base, target_exam: "ASRB NET" }).success).toBe(true);
  });

  it("requires a university", () => {
    expect(profileSchema.safeParse({ ...base, university: "" }).success).toBe(false);
  });
});
