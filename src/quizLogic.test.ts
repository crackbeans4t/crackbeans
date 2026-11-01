import test from "node:test";
import assert from "node:assert/strict";
import { matchProduct, type Brew, type Freq, type Taste } from "./quizLogic";

// Mỗi dòng: các lựa chọn hợp lệ theo đặc tả Section 3 → sản phẩm phải trả về.
const rules: [Brew[], Taste, Freq[], string][] = [
  [["phin", "may"], "dam", ["sang"], "robusta-se"],
  [["phin"], "dam", ["ca-ngay"], "robusta-clean-daklak"],
  [["phin", "may"], "beo", ["sang", "thinh-thoang"], "robusta-clean-rang-bo"],
  [["phin", "may"], "ngot", ["sang", "ca-ngay"], "robusta-honey-99"],
  [["phin", "may"], "thom", ["ca-ngay"], "arabica-dark-roast-s18"],
  [["may"], "thom", ["thinh-thoang"], "specialty-nui-min"],
];
test("Grind Match trả đúng sản phẩm cho mọi tổ hợp trong đặc tả", () => {
  for (const [brews, taste, freqs, id] of rules)
    for (const brew of brews) for (const freq of freqs) assert.equal(matchProduct({ brew, taste, freq }), id, `${brew}+${taste}+${freq}`);
});
test("Tổ hợp ngoài đặc tả vẫn trả về một sản phẩm cùng dòng hạt", () => {
  const all: string[] = [];
  for (const brew of ["phin", "may"] as Brew[])
    for (const taste of ["dam", "beo", "ngot", "thom"] as Taste[])
      for (const freq of ["sang", "ca-ngay", "thinh-thoang"] as Freq[]) all.push(matchProduct({ brew, taste, freq }));
  assert.equal(all.length, 24);
  assert.ok(all.every(Boolean));
});
