// Logic "Grind Match": trả về 1 trong 6 sản phẩm theo đặc tả Section 3.
export type Brew = "phin" | "may";
export type Taste = "dam" | "beo" | "ngot" | "thom";
export type Freq = "sang" | "ca-ngay" | "thinh-thoang";
export type QuizAnswers = { brew: Brew; taste: Taste; freq: Freq };

// Quy tắc theo đặc tả:
// 1. Sẻ: [1A/1B]+[2A]+[3A]          2. Đắk Lắk: [1A]+[2A]+[3B]
// 3. Rang Bơ: [1A/1B]+[2B]+[3A/3C]  4. Honey: [1A/1B]+[2C]+[3A/3B]
// 5. S18: [1A/1B]+[2D]+[3B]         6. Núi Min: [1B]+[2D]+[3C]
// Tổ hợp đặc tả không nêu thì dự phòng theo dòng hạt ở câu 2 (vẫn khớp 6 quy tắc trên).
export function matchProduct({ brew, taste, freq }: QuizAnswers): string {
  if (taste === "dam") return freq === "sang" ? "robusta-se" : "robusta-clean-daklak";
  if (taste === "beo") return "robusta-clean-rang-bo";
  if (taste === "ngot") return "robusta-honey-99";
  return brew === "may" && freq === "thinh-thoang" ? "specialty-nui-min" : "arabica-dark-roast-s18";
}

export const grindFor = (brew: Brew) =>
  brew === "phin" ? { name: "Medium Fine", use: "Pha phin" } : { name: "Fine", use: "Pha máy / Staresso" };

// Chỉ số tham khảo (thang 5), ước lượng từ mô tả hương vị của từng sản phẩm; cần nhóm xác nhận.
export const profiles: Record<string, { tagline: string; bitterness: number; aroma: number; body: number }> = {
  "robusta-se": { tagline: "Đắng đậm di sản, tỉnh táo tối đa.", bitterness: 5, aroma: 3, body: 4 },
  "robusta-clean-daklak": { tagline: "Đậm đà, mộc sạch êm cổ, không say.", bitterness: 4, aroma: 3, body: 4 },
  "robusta-clean-rang-bo": { tagline: "Vị béo ngậy ký ức, uống cà phê sữa đỉnh cao.", bitterness: 4, aroma: 4, body: 5 },
  "robusta-honey-99": { tagline: "Ngọt hậu tự nhiên từ trái chín mộc.", bitterness: 2, aroma: 4, body: 3 },
  "arabica-dark-roast-s18": { tagline: "Chân ái cho team “mê thơm ghét chua”, hạt voi S18.", bitterness: 3, aroma: 4, body: 4 },
  "specialty-nui-min": { tagline: "Dải hương hoa quả ngạt ngào, bản giao hưởng núi rừng.", bitterness: 1, aroma: 5, body: 2 },
};
