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
export type CartLine = { id: string; grind: "Hạt" | "Bột"; size: "250g" | "500g"; quantity: number };
const KEY = "crack-beans-react-cart-v1";
export const money = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value,
  );
export function parseCart(raw: string | null, products: Product[] = data.products): CartLine[] {
  try {
    const input: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(input)) return [];
    return input
      .map((x) => x && typeof x === "object" ? ({ size: "250g", ...(x as object) }) : x)
      .filter(
        (x): x is CartLine =>
          !!x &&
          typeof x === "object" &&
          products.some((p) => p.id === x.id) &&
          (x.grind === "Hạt" || x.grind === "Bột") &&
          (x.size === "250g" || x.size === "500g") &&
          Number.isInteger(x.quantity) &&
          x.quantity > 0 &&
          x.quantity <= 99,
      )
      .filter(
        (x, i, all) =>
          all.findIndex((y) => y.id === x.id && y.grind === x.grind && y.size === x.size) === i,
      );
  } catch {
    return [];
  }
}
function loadCart(products: Product[] = data.products) {
  try {
    return parseCart(localStorage.getItem(KEY), products);
  } catch {
    return [];
  }
}
const CartContext = createContext<{
  lines: CartLine[];
  add: (id: string, grind: CartLine["grind"], quantity: number, size?: CartLine["size"]) => void;
  update: (id: string, grind: CartLine["grind"], quantity: number, size?: CartLine["size"]) => void;
  count: number;
  total: number;
} | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const {data:catalogue, ready}=useContent();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated,setHydrated] = useState(false);
  const [notice,setNotice]=useState('');
  useEffect(()=>{if(notice){const timer=setTimeout(()=>setNotice(''),3000);return()=>clearTimeout(timer);}},[notice]);
  useEffect(() => { if(ready) {setLines(loadCart(catalogue.products)); setHydrated(true);} }, [ready,catalogue.products]);
  useEffect(() => {
    if(!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* Cart remains usable when browser storage is unavailable. */
    }
  }, [lines,hydrated]);
  function add(id: string, grind: CartLine["grind"], quantity: number, size: CartLine["size"] = "250g") {
    setNotice(`Đã thêm ${quantity} gói ${grind} ${size === "500g" ? "500 g" : "250 g"} · ${catalogue.products.find(p=>p.id===id)?.name || 'cà phê'}`);
    setLines((old) => {
      const exists = old.find((l) => l.id === id && l.grind === grind && l.size === size);
      return exists
        ? old.map((l) =>
            l === exists
              ? { ...l, quantity: Math.min(99, l.quantity + quantity) }
              : l,
          )
        : [
            ...old,
            { id, grind, size, quantity: Math.min(99, Math.max(1, quantity)) },
          ];
    });
  }
  function update(id: string, grind: CartLine["grind"], quantity: number, size: CartLine["size"] = "250g") {
    setLines((old) =>
      old
        .map((l) =>
          l.id === id && l.grind === grind && l.size === size
            ? { ...l, quantity: Math.min(99, Math.max(0, quantity)) }
            : l,
        )
        .filter((l) => l.quantity > 0),
    );
  }
  const total = lines.reduce(
    (sum, l) =>
      sum + (catalogue.products.find((p) => p.id === l.id)?.price || 0) * (l.size === "500g" ? 2 : 1) * l.quantity,
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
      <div className="cart-toast" role="status" aria-live="polite">{notice}</div>
    </CartContext.Provider>
  );
}
export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("CartProvider required");
  return cart;
}
