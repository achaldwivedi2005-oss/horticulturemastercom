import { describe, expect, it } from "vitest";
import { fruitGroups } from "./fruits";

describe("supplied fruit crop list", () => {
  const fruits = fruitGroups.flatMap((group) => group.fruits);
  it("preserves all 56 crop entries from the supplied list", () => {
    expect(fruits).toHaveLength(56);
    expect(new Set(fruits.map((fruit) => fruit.name)).size).toBe(56);
  });
  it("includes English names and photographs for every entry", () => {
    expect(fruits.every((fruit) => fruit.englishName.length > 0 && fruit.otherNames.length > 0 && fruit.image?.startsWith("/__l5e/assets-v1/"))).toBe(true);
  });
  it("includes common English names for Aonla, Sapota and Carambola", () => {
    expect(fruits.find((fruit) => fruit.name === "Aonla")?.englishName).toBe("Indian gooseberry");
    expect(fruits.find((fruit) => fruit.name === "Sapota")?.englishName).toBe("Sapodilla");
    expect(fruits.find((fruit) => fruit.name === "Carambola")?.englishName).toBe("Star fruit");
  });
});