import { describe, expect, it } from "vitest";
function normalizeItems<T>(response: { items: T[] | null | undefined }): { items: T[] } {
  return { ...response, items: response.items ?? [] };
}

describe("api list response normalization", () => {
  it("treats null items as an empty list", () => {
    const response = normalizeItems<string>({ items: null });

    expect(response.items).toEqual([]);
    expect(response.items.length).toBe(0);
  });
});
