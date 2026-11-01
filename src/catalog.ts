// Quy tắc catalogue dùng chung cho cửa hàng, giỏ hàng và server tính tiền.
export type Variant = { weight: string; price: number };
type Priced = { price: number; variants?: Variant[] };

export const WEIGHT_PATTERN = /^\d+(?:[.,]\d+)?\s?(?:g|kg)$/i;
export const DEFAULT_CATEGORIES = ["Robusta", "Arabica"];

// Dữ liệu cũ chưa có variants: giữ quy tắc trước đây (250 g, 500 g = gấp đôi).
export const variantsOf = (p: Priced): Variant[] =>
  p.variants?.length
    ? p.variants
    : [
        { weight: "250g", price: p.price },
        { weight: "500g", price: p.price * 2 },
      ];

export const DEFAULT_GRINDS = ["Hạt", "Bột"];
export const grindsOf = (p: { grinds?: string[] }) => (p.grinds?.length ? p.grinds : DEFAULT_GRINDS);

export const priceOf = (p: Priced, weight: string) =>
  variantsOf(p).find((v) => v.weight === weight)?.price;

export const minPrice = (p: Priced) => Math.min(...variantsOf(p).map((v) => v.price));

export const formatWeight = (weight: string) => weight.replace(/^(\d+(?:[.,]\d+)?)\s?(g|kg)$/i, "$1 $2");

export const categoriesOf = (content: { categories?: string[]; products: { category: string }[] }) =>
  content.categories?.length
    ? content.categories
    : [...new Set([...DEFAULT_CATEGORIES, ...content.products.map((p) => p.category)])];

export const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
