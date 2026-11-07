import { describe, expect, it } from "vitest";
import { isHorticultureMasterNote } from "./material-groups";

describe("notes and books collections", () => {
  it("places explicitly branded notes in Horticulture Master notes", () => {
    expect(isHorticultureMasterNote({ title: "Fruit Science", folderPath: ["Horticulture Master notes"] })).toBe(true);
    expect(isHorticultureMasterNote({ title: "Horticulture Master Mango.pdf", folderPath: [] })).toBe(true);
  });
  it("keeps other books without attributing them to Horticulture Master", () => {
    expect(isHorticultureMasterNote({ title: "Handbook of Horticulture", folderPath: ["Books"] })).toBe(false);
  });
});