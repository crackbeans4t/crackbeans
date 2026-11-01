import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Coffee,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Plus,
  RefreshCw,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useContent, type Content } from "./content";
import { money } from "./store";
import "./admin.css";

type Order = {
  key: string;
  name: string;
  phone: string;
  address: string;
  note: string;
  subtotal: number;
  status: string;
  createdAt: string;
  lines: { name: string; grind: string; size?: string; quantity: number }[];
};
type Tab = "overview" | "products" | "articles" | "orders";
const statuses: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};
const tabs: { id: Tab; label: string; title: string; hint: string; icon: ReactNode }[] = [
  { id: "overview", label: "Tổng quan", title: "Tổng quan", hint: "Tình hình cửa hàng hôm nay", icon: <LayoutDashboard size={18} /> },
  { id: "products", label: "Sản phẩm", title: "Sản phẩm", hint: "Tên, giá 250 g, mô tả và ảnh hiển thị ở cửa hàng", icon: <Coffee size={18} /> },
  { id: "articles", label: "Bài viết", title: "Bài viết", hint: "Nội dung blog và thông tin SEO", icon: <FileText size={18} /> },
  { id: "orders", label: "Đơn COD", title: "Đơn COD", hint: "Gọi xác nhận phí giao trước khi gửi hàng", icon: <ShoppingBag size={18} /> },
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

export default function Admin() {
  const { data, revision, refresh } = useContent();
  const [draft, setDraft] = useState<Content>(data),
    [tab, setTab] = useState<Tab>("overview"),
    [authenticated, setAuthenticated] = useState(false),
    [checking, setChecking] = useState(true),
    [storage, setStorage] = useState(""),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [orders, setOrders] = useState<Order[]>([]),
    [dirty, setDirty] = useState(false),
    [baseRevision, setBaseRevision] = useState(revision);
  useEffect(() => {
    if (!dirty) {
      setDraft(data);
      setBaseRevision(revision);
    }
  }, [data, revision, dirty]);
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
    if (authenticated) void reloadOrders();
  }, [authenticated]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function reloadOrders() {
    try {
      setOrders(await api("/api/admin/orders"));
    } catch (e) {
      setError((e as Error).message);
    }
  }
  function edit(next: Content) {
    setDraft(next);
    setDirty(true);
    setMessage("");
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
  async function save() {
    setBusy(true);
    setError("");
    try {
      await api("/api/admin/content", "PUT", { content: draft, revision: baseRevision });
      await refresh();
      setDirty(false);
      setMessage("Đã lưu. Cửa hàng đã cập nhật nội dung mới.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function setStatus(key: string, status: string) {
    try {
      await api(`/api/admin/orders/${key}`, "PATCH", { status });
      await reloadOrders();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  const productEdit = (index: number, patch: Partial<Content["products"][number]>) =>
    edit({ ...draft, products: draft.products.map((p, i) => (i === index ? { ...p, ...patch } : p)) });
  const articleEdit = (index: number, patch: Partial<Content["articles"][number]>) =>
    edit({ ...draft, articles: draft.articles.map((p, i) => (i === index ? { ...p, ...patch } : p)) });
  const pending = orders.filter((o) => o.status === "pending").length;
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
            <h1>{current.title}</h1>
            <p>{current.hint}</p>
          </div>
          <div className="admin-save">
            <span className={`admin-sync${dirty ? " dirty" : ""}`}>{dirty ? "Có thay đổi chưa lưu" : "Đã đồng bộ"}</span>
            <button className="button" disabled={busy || !dirty} onClick={save}>
              {busy ? "Đang lưu…" : "Lưu thay đổi"}
            </button>
          </div>
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
                <button onClick={() => setTab("products")}>
                  <Coffee size={20} aria-hidden="true" />
                  <span>Sản phẩm</span>
                  <strong>{draft.products.length}</strong>
                </button>
                <button onClick={() => setTab("articles")}>
                  <FileText size={20} aria-hidden="true" />
                  <span>Bài viết</span>
                  <strong>{draft.articles.length}</strong>
                </button>
                <button className={pending ? "attention" : ""} onClick={() => setTab("orders")}>
                  <ShoppingBag size={20} aria-hidden="true" />
                  <span>Đơn chờ xác nhận</span>
                  <strong>{pending}</strong>
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
                  <ul className="admin-recent">
                    {orders.slice(0, 5).map((o) => (
                      <li key={o.key}>
                        <div>
                          <strong>{o.name}</strong>
                          <small>
                            #{o.key.slice(0, 8).toUpperCase()} · {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                          </small>
                        </div>
                        <span>{money(o.subtotal)}</span>
                        <span className={`status status-${o.status}`}>{statuses[o.status]}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="admin-empty">Chưa có đơn nào.</p>
                )}
              </section>
              <section className="admin-panel admin-notes">
                <h2>Lưu ý khi chỉnh sửa</h2>
                <ul>
                  <li>Giá nhập là giá gói 250 g; gói 500 g tự tính gấp đôi.</li>
                  <li>Đổi trạng thái đơn chưa tự gửi thông báo cho khách.</li>
                  <li>Mọi thay đổi chỉ lên cửa hàng sau khi bấm “Lưu thay đổi”.</li>
                </ul>
              </section>
            </>
          )}

          {tab === "products" && (
            <>
              <div className="admin-toolbar">
                <p>{draft.products.length} sản phẩm</p>
                <button
                  className="button button-outline button-sm"
                  onClick={() =>
                    edit({
                      ...draft,
                      products: [
                        ...draft.products,
                        { ...draft.products[0], id: `ca-phe-${Date.now()}`, name: "Sản phẩm mới", description: "Nhập mô tả chính xác tối thiểu 20 ký tự.", price: 1000 },
                      ],
                    })
                  }
                >
                  <Plus size={16} aria-hidden="true" /> Thêm sản phẩm
                </button>
              </div>
              <div className="admin-list">
                {draft.products.map((p, index) => (
                  <article className="admin-card admin-product" key={p.id}>
                    <img src={p.images[0].src} alt="" width="160" height="160" />
                    <div className="admin-form">
                      <Field label="Tên sản phẩm" wide>
                        <input value={p.name} onChange={(e) => productEdit(index, { name: e.target.value })} />
                      </Field>
                      <Field label="Giá 250 g (₫)">
                        <input type="number" min={1000} step={1000} value={p.price} onChange={(e) => productEdit(index, { price: Number(e.target.value) })} />
                      </Field>
                      <Field label="Dòng cà phê">
                        <select value={p.category} onChange={(e) => productEdit(index, { category: e.target.value })}>
                          <option>Robusta</option>
                          <option>Arabica</option>
                        </select>
                      </Field>
                      <Field label="Mô tả" wide>
                        <textarea rows={3} value={p.description} onChange={(e) => productEdit(index, { description: e.target.value })} />
                      </Field>
                      <details className="admin-images wide">
                        <summary>Ảnh sản phẩm ({p.images.length})</summary>
                        {p.images.map((image, n) => (
                          <div className="admin-image-row" key={n}>
                            <img src={image.src} alt="" width="56" height="56" />
                            <Field label={`Đường dẫn ảnh ${n + 1}`}>
                              <input value={image.src} onChange={(e) => productEdit(index, { images: p.images.map((img, j) => (j === n ? { ...img, src: e.target.value } : img)) })} />
                            </Field>
                            <Field label="Mô tả ảnh (alt)">
                              <input value={image.alt} onChange={(e) => productEdit(index, { images: p.images.map((img, j) => (j === n ? { ...img, alt: e.target.value } : img)) })} />
                            </Field>
                          </div>
                        ))}
                      </details>
                    </div>
                    <footer>
                      <code>/san-pham/{p.id}</code>
                      <button
                        className="admin-danger"
                        disabled={draft.products.length === 1}
                        onClick={() => edit({ ...draft, products: draft.products.filter((_, i) => i !== index) })}
                      >
                        <Trash2 size={15} aria-hidden="true" /> Xóa
                      </button>
                    </footer>
                  </article>
                ))}
              </div>
            </>
          )}

          {tab === "articles" && (
            <>
              <div className="admin-toolbar">
                <p>{draft.articles.length} bài viết</p>
                <button
                  className="button button-outline button-sm"
                  onClick={() =>
                    edit({
                      ...draft,
                      articles: [
                        ...draft.articles,
                        { id: `bai-viet-${Date.now()}`, title: "Tiêu đề bài viết mới", keyword: "", description: "", updated: new Date().toISOString().slice(0, 10), image: draft.assets.hero, text: "Nhập nội dung bài viết tối thiểu 50 ký tự. Dùng dòng trống để phân tách đoạn văn.", steps: [] },
                      ],
                    })
                  }
                >
                  <Plus size={16} aria-hidden="true" /> Thêm bài viết
                </button>
              </div>
              <div className="admin-list">
                {draft.articles.map((p, index) => (
                  <article className="admin-card admin-article" key={p.id}>
                    <img src={p.image} alt="" width="240" height="150" />
                    <div className="admin-form">
                      <Field label="Tiêu đề" hint={`${p.title.length}/60`} wide>
                        <input value={p.title} onChange={(e) => articleEdit(index, { title: e.target.value })} />
                      </Field>
                      <Field label="Từ khóa chính">
                        <input value={p.keyword ?? ""} onChange={(e) => articleEdit(index, { keyword: e.target.value })} />
                      </Field>
                      <Field label="Ảnh bìa">
                        <input value={p.image} onChange={(e) => articleEdit(index, { image: e.target.value })} />
                      </Field>
                      <Field label="Meta description" hint={`${(p.description ?? "").length}/155`} wide>
                        <textarea rows={2} value={p.description ?? ""} onChange={(e) => articleEdit(index, { description: e.target.value })} />
                      </Field>
                      <Field label="Nội dung" hint="## tiêu đề mục · ### mục con · [chữ](/đường-dẫn)" wide>
                        <textarea className="admin-body" rows={14} value={p.text} onChange={(e) => articleEdit(index, { text: e.target.value })} />
                      </Field>
                    </div>
                    <footer>
                      <a href={`/blog/${p.id}`} target="_blank" rel="noreferrer">
                        <code>/blog/{p.id}</code>
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                      <button className="admin-danger" onClick={() => edit({ ...draft, articles: draft.articles.filter((_, i) => i !== index) })}>
                        <Trash2 size={15} aria-hidden="true" /> Xóa
                      </button>
                    </footer>
                  </article>
                ))}
              </div>
            </>
          )}

          {tab === "orders" && (
            <>
              <div className="admin-toolbar">
                <p>
                  {orders.length} đơn · {pending} chờ xác nhận
                </p>
                <button className="button button-outline button-sm" onClick={reloadOrders}>
                  <RefreshCw size={16} aria-hidden="true" /> Tải lại
                </button>
              </div>
              {!orders.length ? (
                <section className="admin-panel admin-empty-state">
                  <ShoppingBag size={32} strokeWidth={1.4} aria-hidden="true" />
                  <h2>Chưa có đơn COD</h2>
                  <p>Đơn khách gửi từ trang thanh toán sẽ xuất hiện tại đây.</p>
                </section>
              ) : (
                <div className="admin-list">
                  {orders.map((o) => (
                    <article className="admin-card admin-order" key={o.key}>
                      <header>
                        <div>
                          <h2>#{o.key.slice(0, 8).toUpperCase()}</h2>
                          <small>{new Date(o.createdAt).toLocaleString("vi-VN")}</small>
                        </div>
                        <span className={`status status-${o.status}`}>{statuses[o.status]}</span>
                      </header>
                      <dl>
                        <div>
                          <dt>Khách hàng</dt>
                          <dd>
                            <strong>{o.name}</strong>
                            <a href={`tel:${o.phone}`}>{o.phone}</a>
                          </dd>
                        </div>
                        <div>
                          <dt>Địa chỉ</dt>
                          <dd>{o.address}</dd>
                        </div>
                        <div>
                          <dt>Sản phẩm</dt>
                          <dd>
                            {o.lines.map((l, i) => (
                              <span key={i}>
                                {l.name} · {l.grind} · {l.size || "250g"} × {l.quantity}
                              </span>
                            ))}
                          </dd>
                        </div>
                        {o.note && (
                          <div>
                            <dt>Ghi chú</dt>
                            <dd>{o.note}</dd>
                          </div>
                        )}
                      </dl>
                      <footer>
                        <span>
                          Tiền sản phẩm <strong>{money(o.subtotal)}</strong>
                        </span>
                        <Field label="Trạng thái">
                          <select value={o.status} onChange={(e) => setStatus(o.key, e.target.value)}>
                            {Object.entries(statuses).map(([id, label]) => (
                              <option key={id} value={id}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </footer>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
