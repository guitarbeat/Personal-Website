import {
  DEFAULT_BASE_COLORS,
  generateItemColors,
  generateTagColors,
} from "../colorUtils";

const getDefaultHslOrder = () =>
  Object.values(DEFAULT_BASE_COLORS).map(
    ({ h, s, l }) => `hsl(${h}, ${s}%, ${l}%)`,
  );

describe("colorUtils", () => {
  describe("generateTagColors", () => {
    it("cycles through the default palette when keywords exceed available colors", () => {
      const keywords = [
        "alpha",
        "beta",
        "gamma",
        "delta",
        "epsilon",
        "zeta",
        "eta",
        "theta",
      ];

      const result = generateTagColors(keywords);
      const defaultHsl = getDefaultHslOrder();

      keywords.forEach((keyword, index) => {
        const expectedColor = defaultHsl[index % defaultHsl.length];
        expect(result[keyword]).toBe(expectedColor);
      });
    });

    it("uses custom base colors when provided", () => {
      const customBaseColors = {
        first: { h: 10, s: 20, l: 30 },
        second: { h: 40, s: 50, l: 60 },
      };

      const keywords = ["one", "two"];

      const result = generateTagColors(keywords, customBaseColors);

      expect(result).toEqual({
        one: "hsl(10, 20%, 30%)",
        two: "hsl(40, 50%, 60%)",
      });
    });

    it("overwrites duplicate keywords with the latest assigned color", () => {
      const keywords = ["alpha", "beta", "alpha", "gamma", "beta"];

      const result = generateTagColors(keywords);
      const defaultHsl = getDefaultHslOrder();

      expect(result).toEqual({
        alpha: defaultHsl[2],
        beta: defaultHsl[4],
        gamma: defaultHsl[3],
      });
    });
  });

  describe("generateItemColors", () => {
    it("uses a custom key property to derive unique item keys", () => {
      const items = [
        { slug: "first", label: "Item One" },
        { slug: "second", label: "Item Two" },
        { slug: "first", label: "Item One Duplicate" },
      ];

      const result = generateItemColors(items, "slug");
      const defaultHsl = getDefaultHslOrder();

      expect(result).toEqual({
        first: defaultHsl[0],
        second: defaultHsl[1],
      });
    });

    it("defaults to the keyword property and cycles colors like generateTagColors", () => {
      const items = [
        { keyword: "alpha" },
        { keyword: "beta" },
        { keyword: "gamma" },
        { keyword: "alpha" },
        { keyword: "delta" },
        { keyword: "epsilon" },
        { keyword: "zeta" },
        { keyword: "eta" },
        { keyword: "theta" },
        { keyword: "iota" },
      ];

      const result = generateItemColors(items);
      const uniqueKeywords = Array.from(
        new Set(items.map((item) => item.keyword)),
      );
      const expectedColors = generateTagColors(uniqueKeywords);

      expect(result).toEqual(expectedColors);
    });
  });
});
