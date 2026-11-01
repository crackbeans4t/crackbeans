import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Coffee,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  Tags,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Overlay from "./Overlay";
import { useContent, type Content } from "./content";
import { money } from "./store";
import { categoriesOf, formatWeight, grindsOf, minPrice, slugify, variantsOf, WEIGHT_PATTERN, type Variant } from "./catalog";
import "./admin.css";

type Product = Content["products"][number];
type Article = Content["articles"][number];
type Order = {
  key: string;
  name: string;
  phone: string;
  address: string;
  note: string;
  subtotal: number;
  status: string;
  createdAt: string;
  lines: { name: string; grind: string; size?: string; quantity: number; price?: number }[];
};
type Survey = { answers: Record<string, string>; result: string; createdAt: string };
type Tab = "overview" | "products" | "categories" | "articles" | "orders" | "customers";

const statuses: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};
const answerLabels: Record<string, string> = {
  phin: "Phin (Medium Fine)",
  may: "Máy / Staresso (Fine)",
  dam: "Đắng đậm",
  beo: "Béo ngậy",
  ngot: "Ngọt hậu",
  thom: "Thơm thanh",
  sang: "1–2 ly mỗi sáng",
  "ca-ngay": "Nhâm nhi cả ngày",
  "thinh-thoang": "Thi thoảng / cuối tuần",
};
const tabs: { id: Tab; label: string; hint: string; icon: ReactNode }[] = [
  { id: "overview", label: "Tổng quan", hint: "Tình hình cửa hàng", icon: <LayoutDashboard size={18} /> },
  { id: "orders", label: "Đơn COD", hint: "Gọi xác nhận phí giao trước khi gửi hàng", icon: <ShoppingBag size={18} /> },
  { id: "customers", label: "Khách hàng", hint: "Tổng hợp từ đơn đặt hàng và kết quả khảo sát", icon: <Users size={18} /> },
  { id: "products", label: "Sản phẩm", hint: "Giá theo từng khối lượng, ảnh và mô tả", icon: <Coffee size={18} /> },
  { id: "categories", label: "Dòng cà phê", hint: "Nhóm sản phẩm dùng cho bộ lọc và menu", icon: <Tags size={18} /> },
  { id: "articles", label: "Bài viết", hint: "Nội dung blog và thông tin SEO", icon: <FileText size={18} /> },
];

async function api(path: string, method = "GET", body?: unknown) {
  const res = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const value = await res.json();
  if (!res.ok) throw new Error(value.error || "Không thể thực hiện");
  return value;
}
const date = (iso: string) => new Date(iso).toLocaleDateString("vi-VN");

function Field({ label, hint, children, wide = false }: { label: string; hint?: string; children: ReactNode; wide?: boolean }) {
  return (
    <label className={`admin-field${wide ? " wide" : ""}`}>
      <span>
        {label}
        {hint && <small>{hint}</small>}
      </span>
      {children}
    </label>
  );
}
function Status({ value }: { value: string }) {
  return <span className={`status status-${value}`}>{statuses[value] ?? value}</span>;
}
function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="admin-search">
      <Search size={16} aria-hidden="true" />
      <input type="search" value={value} placeholder={placeholder} aria-label={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

// ---------- Forms in popups ----------
function ProductForm({ initial, isNew, categories, taken, onSubmit, onCancel, busy }: { initial: Product; isNew: boolean; categories: string[]; taken: string[]; onSubmit: (p: Product) => void; onCancel: () => void; busy: boolean }) {
  const [p, setP] = useState<Product>({ ...initial, variants: variantsOf(initial), grinds: grindsOf(initial) });
  const [newGrind, setNewGrind] = useState("");
  const [slugEdited, setSlugEdited] = useState(!isNew);
  const [error, setError] = useState("");
  const variants = p.variants as Variant[];
  const grinds = p.grinds as string[];
  const addGrind = () => {
    const g = newGrind.trim();
    if (g && !grinds.some((x) => x.toLowerCase() === g.toLowerCase())) set({ grinds: [...grinds, g] });
    setNewGrind("");
  };
  const set = (patch: Partial<Product>) => setP((old) => ({ ...old, ...patch }));
  const setVariant = (i: number, patch: Partial<Variant>) => set({ variants: variants.map((v, j) => (j === i ? { ...v, ...patch } : v)) });
  const setImage = (i: number, patch: Partial<Product["images"][number]>) => set({ images: p.images.map((img, j) => (j === i ? { ...img, ...patch } : img)) });
  function submit(e: FormEvent) {
    e.preventDefault();
    const clean = variants.map((v) => ({ weight: v.weight.trim().replace(/\s+/g, "").toLowerCase(), price: Number(v.price) }));
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.id)) return setError("Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang.");
    if (isNew && taken.includes(p.id)) return setError("Slug đã tồn tại, hãy đổi tên hoặc slug.");
    if (!clean.length) return setError("Cần ít nhất một khối lượng.");
    if (clean.some((v) => !WEIGHT_PATTERN.test(v.weight))) return setError("Khối lượng ghi dạng 250g, 500g hoặc 1kg.");
    if (clean.some((v) => !Number.isInteger(v.price) || v.price < 1000)) return setError("Giá phải là số nguyên từ 1.000 ₫.");
    if (new Set(clean.map((v) => v.weight)).size !== clean.length) return setError("Có khối lượng bị trùng.");
    if (p.images.length < 2) return setError("Cần ít nhất 2 ảnh (bao bì và hướng dẫn pha).");
    onSubmit({ ...p, variants: clean, price: Math.min(...clean.map((v) => v.price)) });
  }
  return (
    <form className="admin-modal-form" onSubmit={submit}>
      <div className="admin-form">
        <Field label="Tên sản phẩm" wide>
          <input required minLength={3} value={p.name} onChange={(e) => set({ name: e.target.value, ...(slugEdited ? {} : { id: slugify(e.target.value) }) })} />
        </Field>
        <Field label="Đường dẫn (slug)" hint={isNew ? "Tự tạo theo tên" : "Không đổi sau khi tạo"}>
          <input required value={p.id} readOnly={!isNew} onChange={(e) => { setSlugEdited(true); set({ id: e.target.value }); }} />
        </Field>
        <Field label="Dòng cà phê">
          <select value={p.category} onChange={(e) => set({ category: e.target.value })}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Mô tả" wide>
          <textarea required minLength={20} rows={3} value={p.description} onChange={(e) => set({ description: e.target.value })} />
        </Field>
      </div>

      <fieldset className="admin-group">
        <legend>Phân loại</legend>
        <div className="admin-tags-edit">
          {grinds.map((g) => (
            <span key={g} className="admin-tag">
              {g}
              <button type="button" aria-label={`Bỏ phân loại ${g}`} disabled={grinds.length === 1} onClick={() => set({ grinds: grinds.filter((x) => x !== g) })}>
                <X size={13} />
              </button>
            </span>
          ))}
          <input
            aria-label="Thêm phân loại"
            placeholder="Thêm, ví dụ: Xay pha máy"
            value={newGrind}
            maxLength={30}
            onChange={(e) => setNewGrind(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addGrind();
              }
            }}
          />
          <button type="button" className="admin-add-row" disabled={!newGrind.trim() || grinds.length >= 8} onClick={addGrind}>
            <Plus size={15} aria-hidden="true" /> Thêm
          </button>
        </div>
        <p className="admin-help">Khách chọn một phân loại khi đặt hàng. Giá không đổi theo phân loại.</p>
      </fieldset>

      <fieldset className="admin-group">
        <legend>Khối lượng và giá</legend>
        <table className="admin-mini-table">
          <thead>
            <tr>
              <th>Khối lượng</th>
              <th>Giá (₫)</th>
              <th aria-label="Xóa" />
            </tr>
          </thead>
          <tbody>
            {variants.map((v, i) => (
              <tr key={i}>
                <td>
                  <input aria-label={`Khối lượng ${i + 1}`} placeholder="250g" value={v.weight} onChange={(e) => setVariant(i, { weight: e.target.value })} />
                </td>
                <td>
                  <input aria-label={`Giá ${i + 1}`} type="number" min={1000} step={1000} value={v.price} onChange={(e) => setVariant(i, { price: Number(e.target.value) })} />
                </td>
                <td>
                  <button type="button" className="admin-icon danger" aria-label={`Xóa khối lượng ${v.weight}`} disabled={variants.length === 1} onClick={() => set({ variants: variants.filter((_, j) => j !== i) })}>
                    <X size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="admin-add-row" onClick={() => set({ variants: [...variants, { weight: "", price: variants.at(-1)?.price ?? 100000 }] })}>
          <Plus size={15} aria-hidden="true" /> Thêm khối lượng
        </button>
      </fieldset>

      <fieldset className="admin-group">
        <legend>Ảnh</legend>
        {p.images.map((img, i) => (
          <div className="admin-image-row" key={i}>
            <img src={img.src} alt="" width="56" height="56" />
            <Field label={i === 0 ? "Ảnh chính (bao bì)" : `Ảnh ${i + 1}`}>
              <input required value={img.src} placeholder="/assets/ten-anh.webp" onChange={(e) => setImage(i, { src: e.target.value })} />
            </Field>
            <Field label="Mô tả ảnh (alt)">
              <input required minLength={3} value={img.alt} onChange={(e) => setImage(i, { alt: e.target.value })} />
            </Field>
            <button type="button" className="admin-icon danger" aria-label={`Xóa ảnh ${i + 1}`} disabled={p.images.length <= 2} onClick={() => set({ images: p.images.filter((_, j) => j !== i) })}>
              <X size={16} />
            </button>
          </div>
        ))}
        <button type="button" className="admin-add-row" disabled={p.images.length >= 8} onClick={() => set({ images: [...p.images, { src: "/assets/", alt: "" }] })}>
          <Plus size={15} aria-hidden="true" /> Thêm ảnh
        </button>
      </fieldset>

      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <div className="admin-modal-actions">
        <button type="button" className="button button-outline" onClick={onCancel}>
          Hủy
        </button>
        <button className="button" disabled={busy}>
          {busy ? "Đang lưu…" : isNew ? "Thêm sản phẩm" : "Lưu sản phẩm"}
        </button>
      </div>
    </form>
  );
}

function ArticleForm({ initial, isNew, taken, onSubmit, onCancel, busy }: { initial: Article; isNew: boolean; taken: string[]; onSubmit: (a: Article) => void; onCancel: () => void; busy: boolean }) {
  const [a, setA] = useState<Article>(initial);
  const [slugEdited, setSlugEdited] = useState(!isNew);
  const [error, setError] = useState("");
  const set = (patch: Partial<Article>) => setA((old) => ({ ...old, ...patch }));
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.id)) return setError("Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang.");
    if (isNew && taken.includes(a.id)) return setError("Slug đã tồn tại.");
    onSubmit({ ...a, updated: new Date().toISOString().slice(0, 10) });
  }
  return (
    <form className="admin-modal-form" onSubmit={submit}>
      <div className="admin-form">
        <Field label="Tiêu đề" hint={`${a.title.length}/60`} wide>
          <input required minLength={10} value={a.title} onChange={(e) => set({ title: e.target.value, ...(slugEdited ? {} : { id: slugify(e.target.value) }) })} />
        </Field>
        <Field label="Đường dẫn (slug)" hint={isNew ? "Tự tạo theo tiêu đề" : "Đổi slug sẽ làm hỏng link cũ"}>
          <input required value={a.id} readOnly={!isNew} onChange={(e) => { setSlugEdited(true); set({ id: e.target.value }); }} />
        </Field>
        <Field label="Từ khóa chính">
          <input value={a.keyword ?? ""} onChange={(e) => set({ keyword: e.target.value })} />
        </Field>
        <Field label="Meta description" hint={`${(a.description ?? "").length}/155`} wide>
          <textarea rows={2} maxLength={200} value={a.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
        </Field>
        <Field label="Ảnh bìa" wide>
          <div className="admin-cover">
            <img src={a.image} alt="" width="96" height="60" />
            <input required value={a.image} onChange={(e) => set({ image: e.target.value })} />
          </div>
        </Field>
        <Field label="Nội dung" hint="## mục · ### mục con · [chữ](/đường-dẫn)" wide>
          <textarea className="admin-body" required minLength={50} rows={14} value={a.text} onChange={(e) => set({ text: e.target.value })} />
        </Field>
      </div>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <div className="admin-modal-actions">
        <button type="button" className="button button-outline" onClick={onCancel}>
          Hủy
        </button>
        <button className="button" disabled={busy}>
          {busy ? "Đang lưu…" : isNew ? "Đăng bài" : "Lưu bài viết"}
        </button>
      </div>
    </form>
  );
}

function CategoryForm({ initial, taken, onSubmit, onCancel, busy }: { initial: string; taken: string[]; onSubmit: (name: string) => void; onCancel: () => void; busy: boolean }) {
  const [name, setName] = useState(initial);
  const [error, setError] = useState("");
  return (
    <form
      className="admin-modal-form"
      onSubmit={(e) => {
        e.preventDefault();
        const clean = name.trim();
        if (clean.length < 2) return setError("Tên dòng cà phê tối thiểu 2 ký tự.");
        if (clean !== initial && taken.some((t) => t.toLowerCase() === clean.toLowerCase())) return setError("Dòng cà phê này đã có.");
        onSubmit(clean);
      }}
    >
      <Field label="Tên dòng cà phê" hint="Ví dụ: Blend, Culi, Decaf">
        <input autoFocus required maxLength={40} value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      {initial && <p className="admin-help">Đổi tên sẽ cập nhật luôn các sản phẩm thuộc dòng này.</p>}
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <div className="admin-modal-actions">
        <button type="button" className="button button-outline" onClick={onCancel}>
          Hủy
        </button>
        <button className="button" disabled={busy}>
          {busy ? "Đang lưu…" : initial ? "Đổi tên" : "Thêm dòng cà phê"}
        </button>
      </div>
    </form>
  );
}

// ---------- Page ----------
type Modal =
  | { kind: "product"; index: number }
  | { kind: "article"; index: number }
  | { kind: "category"; name: string }
  | { kind: "order"; order: Order }
  | null;

export default function Admin() {
  const { data, revision, refresh } = useContent();
  const [tab, setTab] = useState<Tab>("overview"),
    [authenticated, setAuthenticated] = useState(false),
    [checking, setChecking] = useState(true),
    [storage, setStorage] = useState(""),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [orders, setOrders] = useState<Order[]>([]),
    [surveys, setSurveys] = useState<Survey[]>([]),
    [modal, setModal] = useState<Modal>(null),
    [query, setQuery] = useState(""),
    [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    api("/api/session")
      .then((s) => {
        setAuthenticated(s.authenticated);
        setStorage(s.storage);
      })
      .catch(() => setError("CMS API chưa kết nối. Chạy npm run cms:dev hoặc cấu hình DATABASE_URL trên Vercel."))
      .finally(() => setChecking(false));
  }, []);
  useEffect(() => {
    if (authenticated) void reload();
  }, [authenticated]);
  useEffect(() => {
    setQuery("");
    setMessage("");
  }, [tab]);

  async function reload() {
    try {
      const [o, s] = await Promise.all([api("/api/admin/orders"), api("/api/admin/surveys").catch(() => [])]);
      setOrders(o);
      setSurveys(s);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  // Mỗi thao tác thêm/sửa/xóa lưu ngay vào database, kèm revision để không ghi đè phiên khác.
  async function commit(next: Content, done: string) {
    setBusy(true);
    setError("");
    try {
      await api("/api/admin/content", "PUT", { content: next, revision });
      await refresh();
      setModal(null);
      setMessage(done);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      await api("/api/login", "POST", { password: f.get("password") });
      setAuthenticated(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function setStatus(key: string, status: string) {
    try {
      await api(`/api/admin/orders/${key}`, "PATCH", { status });
      await reload();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const categories = categoriesOf(data);
  const content: Content = { ...data, categories };
  const pending = orders.filter((o) => o.status === "pending").length;
  const q = query.trim().toLowerCase();
  const customers = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; address: string; orders: number; spent: number; last: string }>();
    for (const o of [...orders].sort((a, b) => a.createdAt.localeCompare(b.createdAt))) {
      const c = map.get(o.phone) ?? { name: o.name, phone: o.phone, address: o.address, orders: 0, spent: 0, last: o.createdAt };
      c.orders += 1;
      if (o.status !== "cancelled") c.spent += o.subtotal;
      Object.assign(c, { name: o.name, address: o.address, last: o.createdAt });
      map.set(o.phone, c);
    }
    return [...map.values()].sort((a, b) => b.last.localeCompare(a.last));
  }, [orders]);
  const surveyStats = useMemo(() => {
    const count = (key: string) => {
      const m = new Map<string, number>();
      for (const s of surveys) {
        const v = key === "result" ? s.result : s.answers[key];
        if (v) m.set(v, (m.get(v) ?? 0) + 1);
      }
      return [...m.entries()].sort((a, b) => b[1] - a[1]);
    };
    return { brew: count("brew"), taste: count("taste"), freq: count("freq"), result: count("result") };
  }, [surveys]);
  const productName = (id: string) => data.products.find((p) => p.id === id)?.name ?? id;
  const current = tabs.find((t) => t.id === tab)!;

  if (checking)
    return (
      <div className="admin-loading">
        <RefreshCw size={20} className="spin" aria-hidden="true" /> Đang kết nối CMS…
      </div>
    );

  if (!authenticated)
    return (
      <main className="admin-login">
        <div className="admin-login-card">
          <Link className="admin-login-brand" to="/" aria-label="Crack Beans — Trang chủ">
            <img src={data.assets.logo} alt="Crack Beans" width="144" height="72" />
          </Link>
          <h1>Đăng nhập quản trị</h1>
          <p>Quản lý sản phẩm, bài viết và đơn COD.</p>
          <form onSubmit={login}>
            <Field label="Mật khẩu">
              <input name="password" type="password" autoComplete="current-password" minLength={6} required />
            </Field>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <button className="button" disabled={busy}>
              {busy ? "Đang đăng nhập…" : "Đăng nhập"}
            </button>
          </form>
          <Link className="admin-back" to="/">
            ← Về cửa hàng
          </Link>
        </div>
      </main>
    );

  const blankProduct: Product = { ...data.products[0], id: "", name: "", description: "", category: categories[0], price: 100000, grinds: ["Hạt", "Bột"], variants: [{ weight: "250g", price: 100000 }], images: [{ src: "/assets/", alt: "" }, { src: "/assets/", alt: "" }], source: "" };
  const blankArticle: Article = { ...data.articles[0], id: "", title: "", keyword: "", description: "", image: data.assets.hero, text: "", steps: [], updated: new Date().toISOString().slice(0, 10) };

  const filteredOrders = orders.filter((o) => (statusFilter === "all" || o.status === statusFilter) && (!q || `${o.name} ${o.phone} ${o.key}`.toLowerCase().includes(q)));

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" to="/" aria-label="Về cửa hàng">
          <img src={data.assets.logo} alt="Crack Beans" width="112" height="56" />
          <span>Quản trị</span>
        </Link>
        <nav aria-label="Quản trị">
          {tabs.map((t) => (
            <button key={t.id} aria-label={t.label} title={t.label} aria-current={tab === t.id ? "page" : undefined} onClick={() => setTab(t.id)}>
              {t.icon}
              <span>{t.label}</span>
              {t.id === "orders" && pending > 0 && <em aria-label={`${pending} đơn chờ`}>{pending}</em>}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <a href="/" target="_blank" rel="noreferrer">
            <ExternalLink size={16} aria-hidden="true" /> Xem cửa hàng
          </a>
          <button
            onClick={async () => {
              await api("/api/logout", "POST", {});
              setAuthenticated(false);
            }}
          >
            <LogOut size={16} aria-hidden="true" /> Đăng xuất
          </button>
          <small>Lưu trữ: {storage}</small>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>{current.label}</h1>
            <p>{current.hint}</p>
          </div>
          {tab === "products" && (
            <button className="button button-sm" onClick={() => setModal({ kind: "product", index: -1 })}>
              <Plus size={16} aria-hidden="true" /> Thêm sản phẩm
            </button>
          )}
          {tab === "categories" && (
            <button className="button button-sm" onClick={() => setModal({ kind: "category", name: "" })}>
              <Plus size={16} aria-hidden="true" /> Thêm dòng cà phê
            </button>
          )}
          {tab === "articles" && (
            <button className="button button-sm" onClick={() => setModal({ kind: "article", index: -1 })}>
              <Plus size={16} aria-hidden="true" /> Viết bài mới
            </button>
          )}
          {(tab === "orders" || tab === "customers") && (
            <button className="button button-outline button-sm" onClick={reload}>
              <RefreshCw size={16} aria-hidden="true" /> Tải lại
            </button>
          )}
        </header>

        <div className="admin-content">
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          {message && (
            <p role="status" className="admin-success">
              {message}
            </p>
          )}

          {tab === "overview" && (
            <>
              <div className="admin-stats">
                <button onClick={() => setTab("orders")} className={pending ? "attention" : ""}>
                  <ShoppingBag size={20} aria-hidden="true" />
                  <span>Đơn chờ xác nhận</span>
                  <strong>{pending}</strong>
                </button>
                <button onClick={() => setTab("customers")}>
                  <Users size={20} aria-hidden="true" />
                  <span>Khách hàng</span>
                  <strong>{customers.length}</strong>
                </button>
                <button onClick={() => setTab("products")}>
                  <Coffee size={20} aria-hidden="true" />
                  <span>Sản phẩm</span>
                  <strong>{data.products.length}</strong>
                </button>
                <button onClick={() => setTab("customers")}>
                  <FileText size={20} aria-hidden="true" />
                  <span>Lượt khảo sát</span>
                  <strong>{surveys.length}</strong>
                </button>
              </div>
              <section className="admin-panel">
                <div className="admin-panel-head">
                  <h2>Đơn gần đây</h2>
                  <button className="admin-link" onClick={() => setTab("orders")}>
                    Xem tất cả
                  </button>
                </div>
                {orders.length ? (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <tbody>
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o.key} className="clickable" onClick={() => setModal({ kind: "order", order: o })}>
                            <td>
                              <strong>{o.name}</strong>
                              <small>#{o.key.slice(0, 8).toUpperCase()}</small>
                            </td>
                            <td>{date(o.createdAt)}</td>
                            <td className="num">{money(o.subtotal)}</td>
                            <td>
                              <Status value={o.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="admin-empty">Chưa có đơn nào.</p>
                )}
              </section>
            </>
          )}

          {tab === "orders" && (
            <section className="admin-panel admin-panel-table">
              <div className="admin-filters">
                <SearchBox value={query} onChange={setQuery} placeholder="Tìm tên, số điện thoại, mã đơn" />
                <div className="admin-chips" role="group" aria-label="Lọc trạng thái">
                  {[["all", "Tất cả"], ...Object.entries(statuses)].map(([id, label]) => (
                    <button key={id} aria-pressed={statusFilter === id} onClick={() => setStatusFilter(id)}>
                      {label}
                      <span>{id === "all" ? orders.length : orders.filter((o) => o.status === id).length}</span>
                    </button>
                  ))}
                </div>
              </div>
              {filteredOrders.length ? (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Ngày</th>
                        <th>Khách hàng</th>
                        <th>Sản phẩm</th>
                        <th className="num">Tiền hàng</th>
                        <th>Trạng thái</th>
                        <th aria-label="Thao tác" />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o) => (
                        <tr key={o.key}>
                          <td>
                            <code>#{o.key.slice(0, 8).toUpperCase()}</code>
                          </td>
                          <td>{date(o.createdAt)}</td>
                          <td>
                            <strong>{o.name}</strong>
                            <a href={`tel:${o.phone}`}>{o.phone}</a>
                          </td>
                          <td>{o.lines.reduce((n, l) => n + l.quantity, 0)} gói</td>
                          <td className="num">{money(o.subtotal)}</td>
                          <td>
                            <select className={`status-select status-${o.status}`} aria-label={`Trạng thái đơn ${o.key.slice(0, 8)}`} value={o.status} onChange={(e) => setStatus(o.key, e.target.value)}>
                              {Object.entries(statuses).map(([id, label]) => (
                                <option key={id} value={id}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="actions">
                            <button className="admin-link" onClick={() => setModal({ kind: "order", order: o })}>
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="admin-empty-state">
                  <ShoppingBag size={32} strokeWidth={1.4} aria-hidden="true" />
                  <h2>{orders.length ? "Không có đơn phù hợp" : "Chưa có đơn COD"}</h2>
                  <p>{orders.length ? "Thử bỏ bộ lọc hoặc đổi từ khóa." : "Đơn khách gửi từ trang thanh toán sẽ xuất hiện tại đây."}</p>
                </div>
              )}
            </section>
          )}

          {tab === "customers" && (
            <>
              <section className="admin-panel admin-panel-table">
                <div className="admin-filters">
                  <SearchBox value={query} onChange={setQuery} placeholder="Tìm tên hoặc số điện thoại" />
                </div>
                {customers.length ? (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Khách hàng</th>
                          <th>Địa chỉ gần nhất</th>
                          <th className="num">Số đơn</th>
                          <th className="num">Đã mua</th>
                          <th>Đơn gần nhất</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers
                          .filter((c) => !q || `${c.name} ${c.phone}`.toLowerCase().includes(q))
                          .map((c) => (
                            <tr key={c.phone}>
                              <td>
                                <strong>{c.name}</strong>
                                <a href={`tel:${c.phone}`}>{c.phone}</a>
                              </td>
                              <td className="wrap">{c.address}</td>
                              <td className="num">{c.orders}</td>
                              <td className="num">{money(c.spent)}</td>
                              <td>{date(c.last)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="admin-empty-state">
                    <Users size={32} strokeWidth={1.4} aria-hidden="true" />
                    <h2>Chưa có khách hàng</h2>
                    <p>Khách được ghi nhận theo số điện thoại khi gửi đơn COD.</p>
                  </div>
                )}
              </section>
              <section className="admin-panel">
                <div className="admin-panel-head">
                  <h2>Grind Match — khảo sát nhu cầu</h2>
                  <span className="admin-muted">{surveys.length} lượt trả lời</span>
                </div>
                {surveys.length ? (
                  <div className="admin-survey">
                    {(
                      [
                        ["Dụng cụ pha", surveyStats.brew],
                        ["Hương vị", surveyStats.taste],
                        ["Tần suất", surveyStats.freq],
                        ["Sản phẩm được gợi ý", surveyStats.result],
                      ] as [string, [string, number][]][]
                    ).map(([title, rows]) => (
                      <div key={title}>
                        <h3>{title}</h3>
                        {rows.map(([key, n]) => (
                          <div className="admin-bar" key={key}>
                            <span>{answerLabels[key] ?? productName(key)}</span>
                            <i style={{ width: `${(n / surveys.length) * 100}%` }} />
                            <b>{n}</b>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="admin-empty">Chưa có lượt khảo sát. Quiz hiện cho khách lần đầu vào website.</p>
                )}
              </section>
            </>
          )}

          {tab === "products" && (
            <section className="admin-panel admin-panel-table">
              <div className="admin-filters">
                <SearchBox value={query} onChange={setQuery} placeholder="Tìm sản phẩm" />
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Dòng</th>
                      <th>Phân loại</th>
                      <th>Khối lượng</th>
                      <th className="num">Giá từ</th>
                      <th aria-label="Thao tác" />
                    </tr>
                  </thead>
                  <tbody>
                    {data.products.map((p, index) =>
                      q && !`${p.name} ${p.category}`.toLowerCase().includes(q) ? null : (
                        <tr key={p.id}>
                          <td>
                            <div className="admin-cell-product">
                              <img src={p.images[0].src} alt="" width="44" height="44" />
                              <div>
                                <strong>{p.name}</strong>
                                <small>/san-pham/{p.id}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="admin-tag">{p.category}</span>
                          </td>
                          <td>{grindsOf(p).join(", ")}</td>
                          <td>{variantsOf(p).map((v) => formatWeight(v.weight)).join(" · ")}</td>
                          <td className="num">{money(minPrice(p))}</td>
                          <td className="actions">
                            <button className="admin-icon" aria-label={`Sửa ${p.name}`} title="Sửa" onClick={() => setModal({ kind: "product", index })}>
                              <Pencil size={16} />
                            </button>
                            <button
                              className="admin-icon danger"
                              aria-label={`Xóa ${p.name}`}
                              title="Xóa"
                              disabled={busy || data.products.length === 1}
                              onClick={() => confirm(`Xóa “${p.name}” khỏi cửa hàng?`) && commit({ ...content, products: data.products.filter((_, i) => i !== index) }, `Đã xóa ${p.name}.`)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === "categories" && (
            <section className="admin-panel admin-panel-table">
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Dòng cà phê</th>
                      <th className="num">Số sản phẩm</th>
                      <th>Hiển thị ở cửa hàng</th>
                      <th aria-label="Thao tác" />
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => {
                      const used = data.products.filter((p) => p.category === c).length;
                      return (
                        <tr key={c}>
                          <td>
                            <strong>{c}</strong>
                          </td>
                          <td className="num">{used}</td>
                          <td>
                            <a href={`/san-pham?loai=${encodeURIComponent(c)}`} target="_blank" rel="noreferrer">
                              /san-pham?loai={c}
                            </a>
                          </td>
                          <td className="actions">
                            <button className="admin-icon" aria-label={`Đổi tên ${c}`} title="Đổi tên" onClick={() => setModal({ kind: "category", name: c })}>
                              <Pencil size={16} />
                            </button>
                            <button
                              className="admin-icon danger"
                              aria-label={`Xóa ${c}`}
                              title={used ? "Chuyển hết sản phẩm sang dòng khác trước khi xóa" : "Xóa"}
                              disabled={busy || used > 0}
                              onClick={() => confirm(`Xóa dòng “${c}”?`) && commit({ ...content, categories: categories.filter((x) => x !== c) }, `Đã xóa dòng ${c}.`)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="admin-help">Dòng đang có sản phẩm thì không xóa được; hãy chuyển sản phẩm sang dòng khác trước.</p>
            </section>
          )}

          {tab === "articles" && (
            <section className="admin-panel admin-panel-table">
              <div className="admin-filters">
                <SearchBox value={query} onChange={setQuery} placeholder="Tìm bài viết" />
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Bài viết</th>
                      <th>Từ khóa chính</th>
                      <th>Cập nhật</th>
                      <th aria-label="Thao tác" />
                    </tr>
                  </thead>
                  <tbody>
                    {data.articles.map((a, index) =>
                      q && !a.title.toLowerCase().includes(q) ? null : (
                        <tr key={a.id}>
                          <td>
                            <div className="admin-cell-product">
                              <img src={a.image} alt="" width="64" height="40" className="wide" />
                              <div>
                                <strong>{a.title}</strong>
                                <small>/blog/{a.id}</small>
                              </div>
                            </div>
                          </td>
                          <td>{a.keyword || <span className="admin-muted">Chưa đặt</span>}</td>
                          <td>{a.updated ? new Date(a.updated).toLocaleDateString("vi-VN") : "—"}</td>
                          <td className="actions">
                            <a className="admin-icon" href={`/blog/${a.id}`} target="_blank" rel="noreferrer" aria-label={`Xem ${a.title}`} title="Xem">
                              <ExternalLink size={16} />
                            </a>
                            <button className="admin-icon" aria-label={`Sửa ${a.title}`} title="Sửa" onClick={() => setModal({ kind: "article", index })}>
                              <Pencil size={16} />
                            </button>
                            <button
                              className="admin-icon danger"
                              aria-label={`Xóa ${a.title}`}
                              title="Xóa"
                              disabled={busy}
                              onClick={() => confirm(`Xóa bài “${a.title}”?`) && commit({ ...content, articles: data.articles.filter((_, i) => i !== index) }, "Đã xóa bài viết.")}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </main>

      <Overlay
        open={!!modal}
        onClose={() => setModal(null)}
        wide
        title={
          modal?.kind === "product"
            ? modal.index < 0
              ? "Thêm sản phẩm"
              : "Sửa sản phẩm"
            : modal?.kind === "article"
              ? modal.index < 0
                ? "Viết bài mới"
                : "Sửa bài viết"
              : modal?.kind === "category"
                ? modal.name
                  ? "Đổi tên dòng cà phê"
                  : "Thêm dòng cà phê"
                : modal?.kind === "order"
                  ? `Đơn #${modal.order.key.slice(0, 8).toUpperCase()}`
                  : ""
        }
      >
        <div className="drawer-body admin-modal">
          {error && modal && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          {modal?.kind === "product" && (
            <ProductForm
              key={modal.index}
              initial={modal.index < 0 ? blankProduct : data.products[modal.index]}
              isNew={modal.index < 0}
              categories={categories}
              taken={data.products.map((p) => p.id)}
              busy={busy}
              onCancel={() => setModal(null)}
              onSubmit={(p) =>
                commit(
                  { ...content, products: modal.index < 0 ? [...data.products, p] : data.products.map((x, i) => (i === modal.index ? p : x)) },
                  modal.index < 0 ? `Đã thêm ${p.name}.` : `Đã lưu ${p.name}.`,
                )
              }
            />
          )}
          {modal?.kind === "article" && (
            <ArticleForm
              key={modal.index}
              initial={modal.index < 0 ? blankArticle : data.articles[modal.index]}
              isNew={modal.index < 0}
              taken={data.articles.map((a) => a.id)}
              busy={busy}
              onCancel={() => setModal(null)}
              onSubmit={(a) =>
                commit({ ...content, articles: modal.index < 0 ? [...data.articles, a] : data.articles.map((x, i) => (i === modal.index ? a : x)) }, modal.index < 0 ? "Đã đăng bài viết." : "Đã lưu bài viết.")
              }
            />
          )}
          {modal?.kind === "category" && (
            <CategoryForm
              key={modal.name}
              initial={modal.name}
              taken={categories}
              busy={busy}
              onCancel={() => setModal(null)}
              onSubmit={(name) =>
                commit(
                  modal.name
                    ? {
                        ...content,
                        categories: categories.map((c) => (c === modal.name ? name : c)),
                        products: data.products.map((p) => (p.category === modal.name ? { ...p, category: name } : p)),
                      }
                    : { ...content, categories: [...categories, name] },
                  modal.name ? `Đã đổi tên thành ${name}.` : `Đã thêm dòng ${name}.`,
                )
              }
            />
          )}
          {modal?.kind === "order" && (
            <div className="admin-order-detail">
              <dl>
                <div>
                  <dt>Khách hàng</dt>
                  <dd>
                    <strong>{modal.order.name}</strong> · <a href={`tel:${modal.order.phone}`}>{modal.order.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt>Địa chỉ</dt>
                  <dd>{modal.order.address}</dd>
                </div>
                <div>
                  <dt>Thời gian đặt</dt>
                  <dd>{new Date(modal.order.createdAt).toLocaleString("vi-VN")}</dd>
                </div>
                {modal.order.note && (
                  <div>
                    <dt>Ghi chú</dt>
                    <dd>{modal.order.note}</dd>
                  </div>
                )}
              </dl>
              <table className="admin-mini-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Loại</th>
                    <th className="num">SL</th>
                    <th className="num">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {modal.order.lines.map((l, i) => (
                    <tr key={i}>
                      <td>{l.name}</td>
                      <td>
                        {l.grind} · {formatWeight(l.size || "250g")}
                      </td>
                      <td className="num">{l.quantity}</td>
                      <td className="num">{l.price ? money(l.price * l.quantity) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3}>Tiền hàng (chưa gồm phí giao)</td>
                    <td className="num">
                      <strong>{money(modal.order.subtotal)}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
              <div className="admin-modal-actions">
                <Field label="Trạng thái">
                  <select
                    value={orders.find((o) => o.key === modal.order.key)?.status ?? modal.order.status}
                    onChange={async (e) => {
                      await setStatus(modal.order.key, e.target.value);
                      setModal({ kind: "order", order: { ...modal.order, status: e.target.value } });
                    }}
                  >
                    {Object.entries(statuses).map(([id, label]) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
                <a className="button" href={`tel:${modal.order.phone}`}>
                  Gọi khách
                </a>
              </div>
            </div>
          )}
        </div>
      </Overlay>
    </div>
  );
}
