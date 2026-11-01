import test from "node:test";
import assert from "node:assert/strict";
import { parseCart } from "./store";
test("Giỏ hàng lỗi hoặc bị chặn không làm ứng dụng hỏng", () => {
  assert.deepEqual(parseCart(null), []);
  assert.deepEqual(parseCart("{broken"), []);
  assert.deepEqual(parseCart('{"quantity":2}'), []);
});
test("Chỉ nhận sản phẩm và biến thể có thật, số lượng nguyên 1–99", () => {
  const valid = { id: "specialty-nui-min", grind: "Hạt", size: "250g", quantity: 2 };
  const inputs = [
    valid,
    { ...valid, id: "missing" },
    { ...valid, grind: "unknown" },
    ...[-1, 0, 100, 1.5, "2"].map((quantity) => ({ ...valid, quantity })),
  ];
  assert.deepEqual(parseCart(JSON.stringify(inputs)), [valid]);
});
test("Hạt và bột là hai dòng riêng, loại bỏ dòng bị lưu trùng", () => {
  const line = { id: "specialty-nui-min", grind: "Hạt", size: "250g", quantity: 2 };
  const powder = { ...line, grind: "Bột" };
  assert.deepEqual(parseCart(JSON.stringify([line, line, powder])), [
    line,
    powder,
  ]);
});

test("250 g và 500 g cùng loại giữ hai dòng riêng; từ chối định lượng sai", () => { const line = {id:"specialty-nui-min", grind:"Hạt", size:"250g", quantity:1}; const large = {...line,size:"500g"}; assert.deepEqual(parseCart(JSON.stringify([line,large,{...line,size:"750g"}])),[line,large]); });
