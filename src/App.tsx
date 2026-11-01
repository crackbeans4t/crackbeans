import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  ShoppingBag,
  Trash2,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { CartProvider, useCart, money, type Product } from "./store";
import Overlay from "./Overlay";
import { ProductCard, ProductDetail, Quantity } from "./Products";
import { Home, About, Shop, Blog, Post, Contact, Policy } from "./Pages";
import Admin from "./Admin";
import CheckoutPage from './Checkout';
import Seo from './Seo';
import { ContentProvider, useContent } from './content';
import { AnimateUIProvider } from "@animate-ui/react/provider";
import { Fade } from "@animate-ui/react/primitives/effects/fade";
export const navigation = [
  ["/", "Trang chủ"],
  ["/ve-chung-toi", "Về chúng tôi"],
  ["/san-pham", "Sản phẩm"],
  ["/blog", "Blog"],
  ["/lien-he", "Liên hệ"],
];
function Header({ onCart }: { onCart: () => void }) {
  const {data}=useContent();
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname, location.search]);
  return (
    <>
      <a className="skip-link" href="#main">
        Chuyển đến nội dung chính
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="logo" to="/" aria-label="Crack Beans — Trang chủ">
            <img
              src={data.assets.logo}
              alt="CRACK BEANS"
              width="130"
              height="64"
            />
          </Link>
          <nav className="desktop-nav" aria-label="Điều hướng chính">
            {navigation.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/"}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button mobile-menu"
              aria-label="Mở menu"
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu size={24} />
            </button>
            <button
              className="icon-button cart-toggle"
              onClick={onCart}
              aria-label={`Mở giỏ hàng, ${count} sản phẩm`}
              aria-haspopup="dialog"
            >
              <ShoppingBag size={24} />
              <span className="cart-count">{count}</span>
            </button>
          </div>
        </div>
      </header>
      <Overlay open={open} onClose={() => setOpen(false)} title="Menu">
        <div className="drawer-body">
          <nav className="mobile-nav" aria-label="Điều hướng mobile">
            {navigation.map(([to, label]) =>
              to === "/san-pham" ? (
                <div className="mobile-product-nav" key={to}>
                  <NavLink to={to}>{label}</NavLink>
                  <details>
                    <summary aria-label="Mở danh mục sản phẩm">
                      <ChevronDown size={20} />
                    </summary>
                    <div>
                      <Link to="/san-pham?loai=Robusta">Robusta</Link>
                      <Link to="/san-pham?loai=Arabica">Arabica</Link>
                    </div>
                  </details>
                </div>
              ) : (
                <NavLink key={to} to={to} end={to === "/"}>
                  {label}
                </NavLink>
              ),
            )}
          </nav>
          <div className="menu-contact">
            <p className="eyebrow">Cà phê Việt. Hương vị nguyên bản.</p>
            <a href="tel:0767509715">076 750 9715</a>
            <a href="mailto:crackbeans.4t@gmail.com">crackbeans.4t@gmail.com</a>
          </div>
        </div>
      </Overlay>
    </>
  );
}
function Footer() {
  const {data}=useContent();
  return (
    <footer className="site-footer">
      <div className="footer-grid container">
        <div className="footer-brand">
          <Link to="/">
            <img
              src={data.assets.logo}
              alt="CRACK BEANS"
              width="144"
              height="72"
            />
          </Link>
          <p>
            Archive Hybrid Coffee — rang mộc, pha chậm, giữ trọn hương vị nguyên
            bản.
          </p>
          <a
            className="text-link"
            href="https://www.instagram.com/crackbeans.4t/"
            target="_blank"
            rel="noreferrer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg> Instagram
          </a>
        </div>
        <div>
          <h2>Liên kết nhanh</h2>
          <nav aria-label="Liên kết nhanh">
            {navigation.map(([to, label]) => (
              <Link key={to} to={to}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h2>Chính sách</h2>
          <nav aria-label="Chính sách">
            {[
              ["giao-hang", "Chính sách giao hàng"],
              ["doi-tra", "Đổi trả & hoàn tiền"],
              ["bao-mat", "Chính sách bảo mật"],
              ["dieu-khoan", "Điều khoản sử dụng"],
            ].map(([slug, title]) => (
              <Link key={slug} to={`/chinh-sach/${slug}`}>
                {title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="footer-contact">
          <h2>Liên hệ</h2>
          <p>109/3 Nguyễn Ảnh Thủ, Hóc Môn, TP. Hồ Chí Minh</p>
          <a href="tel:0767509715">076 750 9715</a>
          <a href="mailto:crackbeans.4t@gmail.com">crackbeans.4t@gmail.com</a>
          <p>7:00 – 22:00 mỗi ngày</p>
        </div>
      </div>
      <div className="copyright container">
        <span>© 2026 CRACK BEANS</span>
        <span>Archive Hybrid Coffee</span>
      </div>
    </footer>
  );
}
function Cart({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {data}=useContent();
  const cart = useCart();
  const navigate = useNavigate();
  return (
    <Overlay open={open} onClose={onClose} title={`Giỏ hàng (${cart.count})`}>
      <div className="drawer-body cart-body">
        {cart.lines.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={40} strokeWidth={1} />
            <h3>Giỏ hàng đang trống</h3>
            <p>Chọn một hương vị cà phê dành cho bạn.</p>
            <Link className="button" to="/san-pham" onClick={onClose}>
              Khám phá sản phẩm <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          cart.lines.map((line) => {
            const p = data.products.find((p) => p.id === line.id)!;
            return (
              <article className="cart-line" key={line.id + line.grind}>
                <img
                  src={p.images[0].src}
                  alt={p.name}
                  width="88"
                  height="88"
                />
                <div>
                  <h3>
                    <Link to={`/san-pham/${p.id}`} onClick={onClose}>
                      {p.name}
                    </Link>
                  </h3>
                  <p>250 g / {line.grind}</p>
                  <strong>{money(p.price * line.quantity)}</strong>
                  <Quantity
                    value={line.quantity}
                    onChange={(q) => cart.update(line.id, line.grind, q)}
                    label={`Số lượng ${p.name} ${line.grind}`}
                  />
                </div>
                <button
                  className="icon-button remove-line"
                  aria-label={`Xóa ${p.name} ${line.grind}`}
                  onClick={() => cart.update(line.id, line.grind, 0)}
                >
                  <Trash2 size={18} />
                </button>
              </article>
            );
          })
        )}
      </div>
      {cart.count > 0 && (
        <div className="drawer-bottom">
          <div className="total-row">
            <span>Tạm tính</span>
            <strong>{money(cart.total)}</strong>
          </div>
          <small>Chưa gồm phí vận chuyển.</small>
          <button
            className="button full"
            onClick={() => {
              onClose();
              navigate("/thanh-toan");
            }}
          >
            Tiếp tục thanh toán <ArrowRight size={18} />
          </button>
          <button className="text-button full" onClick={onClose}>
            Tiếp tục mua sắm
          </button>
        </div>
      )}
    </Overlay>
  );
}
function DetailPage({ onAdded }: { onAdded: () => void }) {
  const {data}=useContent();
  const { id } = useParams();
  const p = data.products.find((p) => p.id === id);
  return p ? (
    <div className="container page-space">
      <nav className="breadcrumbs" aria-label="Đường dẫn">
        <Link to="/">Trang chủ</Link>
        <span>/</span>
        <Link to="/san-pham">Sản phẩm</Link>
        <span>/</span>
        <span>{p.name}</span>
      </nav>
      <ProductDetail key={id} product={p} onAdded={onAdded} />
    </div>
  ) : (
    <NotFound />
  );
}
function NotFound() {
  return (
    <div className="container empty-state page-space">
      <h1>Không tìm thấy trang</h1>
      <Link className="button" to="/">
        Về trang chủ
      </Link>
    </div>
  );
}
function Site() {
  const [cartOpen, setCartOpen] = useState(false),
    [quick, setQuick] = useState<Product | null>(null);
  const location = useLocation();
  useEffect(() => {
    setQuick(null);
    setCartOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  if(location.pathname==='/admin') return <><Seo/><Admin/></>;
  return (
    <>
      <Seo />
      <Header onCart={() => setCartOpen(true)} />
      <main id="main">
        <Fade inView={false} initialOpacity={0} opacity={1} transition={{ duration: 0.3, ease: "easeOut" }}>
        <Routes>
          <Route path="/" element={<Home onQuick={setQuick} />} />
          <Route path="/san-pham" element={<Shop onQuick={setQuick} />} />
          <Route
            path="/san-pham/:id"
            element={<DetailPage onAdded={() => setCartOpen(true)} />}
          />
          <Route path="/ve-chung-toi" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Post />} />
          <Route path="/lien-he" element={<Contact />} />
          <Route path="/chinh-sach/:id" element={<Policy />} />
          <Route path="/thanh-toan" element={<CheckoutPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Fade>
      </main>
      <Footer />
      <Overlay
        open={!!quick}
        onClose={() => setQuick(null)}
        title="Xem nhanh sản phẩm"
        wide
      >
        {quick && (
          <div className="drawer-body">
            <ProductDetail
              key={quick.id}
              product={quick}
              compact
              onAdded={() => {
                setQuick(null);
                setCartOpen(true);
              }}
            />
          </div>
        )}
      </Overlay>
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
export default function App() {
  return (
    <AnimateUIProvider reducedMotion="user">
      <ContentProvider>
      <CartProvider>
        <Site />
      </CartProvider>
      </ContentProvider>
    </AnimateUIProvider>
  );
}
