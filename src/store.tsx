import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import data from "./data.json";
import { useContent } from './content';
export type Product = (typeof data.products)[number];
export type CartLine = { id: string; grind: "Hạt" | "Bột"; quantity: number };
const KEY = "crack-beans-react-cart-v1";
export const money = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value,
  );
export function parseCart(raw: string | null): CartLine[] {
  try {
    const input: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(input)) return [];
    return input
      .filter(
        (x): x is CartLine =>
          !!x &&
          typeof x === "object" &&
          data.products.some((p) => p.id === x.id) &&
          (x.grind === "Hạt" || x.grind === "Bột") &&
          Number.isInteger(x.quantity) &&
          x.quantity > 0 &&
          x.quantity <= 99,
      )
      .filter(
        (x, i, all) =>
          all.findIndex((y) => y.id === x.id && y.grind === x.grind) === i,
      );
  } catch {
    return [];
  }
}
function loadCart() {
  try {
    return parseCart(localStorage.getItem(KEY));
  } catch {
    return [];
  }
}
const CartContext = createContext<{
  lines: CartLine[];
  add: (id: string, grind: CartLine["grind"], quantity: number) => void;
  update: (id: string, grind: CartLine["grind"], quantity: number) => void;
  count: number;
  total: number;
} | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const {data:catalogue}=useContent();
  const [lines, setLines] = useState<CartLine[]>(loadCart);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* Cart remains usable when browser storage is unavailable. */
    }
  }, [lines]);
  function add(id: string, grind: CartLine["grind"], quantity: number) {
    setLines((old) => {
      const exists = old.find((l) => l.id === id && l.grind === grind);
      return exists
        ? old.map((l) =>
            l === exists
              ? { ...l, quantity: Math.min(99, l.quantity + quantity) }
              : l,
          )
        : [
            ...old,
            { id, grind, quantity: Math.min(99, Math.max(1, quantity)) },
          ];
    });
  }
  function update(id: string, grind: CartLine["grind"], quantity: number) {
    setLines((old) =>
      old
        .map((l) =>
          l.id === id && l.grind === grind
            ? { ...l, quantity: Math.min(99, Math.max(0, quantity)) }
            : l,
        )
        .filter((l) => l.quantity > 0),
    );
  }
  const total = lines.reduce(
    (sum, l) =>
      sum + (catalogue.products.find((p) => p.id === l.id)?.price || 0) * l.quantity,
    0,
  );
  return (
    <CartContext.Provider
      value={{
        lines,
        add,
        update,
        total,
        count: lines.reduce((n, l) => n + l.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("CartProvider required");
  return cart;
}
