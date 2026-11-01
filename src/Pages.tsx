import Image from "./Image";
import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowUpDown, Check, ChevronDown, Mail, Phone, MapPin } from "lucide-react";
import data from "./data.json";
import { useContent } from './content';
import { type Product } from "./store";
import { ProductCard } from "./Products";
type QuickProps = { onQuick: (p: Product) => void };
export function Home({ onQuick }: QuickProps) {
  const {data}=useContent();
  return (
    <>
      <section className="hero">
        <Image
          className="hero-bg"
          sizes="100vw"
          src={data.assets.hero}
          alt="Bột cà phê rang mộc Crack Beans"
          fetchPriority="high"
          width="1440"
          height="640"
        />
        <div className="hero-content container">
          <p className="eyebrow">Archive Hybrid Coffee</p>
          <h1>Lưu trữ hương vị cà phê rang mộc nguyên bản</h1>
          <p className="hero-description">
            Vượt trên một thức uống thông thường, đây là sự giao thoa hoàn hảo
            giữa tinh hoa nông sản Việt, nghệ thuật rang mộc thủ công tỉ mỉ và
            tư duy thiết kế tối giản, hiện đại trong từng mẻ hạt.
          </p>
          <Link className="button button-cream" to="/san-pham">
            Khám phá sản phẩm
          </Link>
        </div>
      </section>
      <section className="philosophy container section-space">
        <p className="eyebrow">Triết lý thương hiệu</p>
        <h2>Mỗi mẻ rang là một câu chuyện</h2>
        <p>
          Tại CRACK BEANS, mỗi mẻ rang bắt đầu từ sự trân trọng hạt cà phê Việt.
          Chúng tôi kể câu chuyện về vùng nguyên liệu và hương vị từng dòng cà
          phê, giúp bạn chọn sản phẩm phù hợp với gu thưởng thức.
        </p>
        <Link className="text-link" to="/ve-chung-toi">
          Câu chuyện Crack Beans
        </Link>
      </section>
      <section className="container section-space featured">
        <div className="section-head">
          <div>
            <p className="eyebrow">Sản phẩm nổi bật</p>
            <h2>Chọn gu cà phê của bạn</h2>
          </div>
          <Link className="text-link" to="/san-pham">
            Tất cả sản phẩm
          </Link>
        </div>
        <div className="featured-rail" tabIndex={0} aria-label="Sản phẩm nổi bật, cuộn ngang để xem thêm">
          {[...data.products].sort((a, b) => Number(b.category === "Arabica") - Number(a.category === "Arabica")).map((p) => (
            <ProductCard key={p.id} product={p} onQuick={onQuick} />
          ))}
        </div>
      </section>
      <section className="origin-quote">
        <Image
          src={data.assets.seed}
          alt="Mầm cây non mọc từ đất"
          width="1440"
          height="450"
          loading="lazy"
        />
        <blockquote>
          “Mỗi hạt cà phê chắt chiu mạch sống của đất trời và linh hồn núi biếc,
          nơi những người tâm huyết nguyện giữ trọn bản sắc thuần khiết bằng sự
          chăm chút tỉ mỉ từ khâu thu hái với lòng biết ơn thiên nhiên sâu sắc
          nhất.”
        </blockquote>
      </section>
      <section className="container section-space origins">
        <div className="section-head">
          <div>
            <p className="eyebrow">Từ vùng đất đến hạt cà phê</p>
            <h2>Dấu ấn cao nguyên</h2>
          </div>
        </div>
        {data.regions.map((r) => (
          <article className="origin-row" key={r.name}>
            <Image
              src={r.image}
              alt={`Phong cảnh vùng nguyên liệu ${r.name}`}
              loading="lazy"
              width="600"
              height="400"
            />
            <div>
              <h3>{r.name}</h3>
              <p>{r.text}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
export function About() {
  const {data}=useContent();
  const values = [
    [
      "Tối giản công nghiệp",
      "Tiết chế những gì rườm rà để tôn vinh nét đẹp thuần khiết của nông sản, đồng thời bảo tồn trọn vẹn những tầng hương nồng nàn và bản sắc riêng của hạt cà phê.",
    ],
    [
      "Minh bạch nguồn gốc",
      "Công khai tỉ mỉ tọa độ vườn, thổ nhưỡng và sơ chế. Tận tâm giúp bạn thấu cảm trọn vẹn mọi bước đi từ vùng nguyên liệu trù phú đến tận ly cà phê bạn cầm.",
    ],
    [
      "Văn hóa cà phê",
      "Gìn giữ bản sắc cà phê Việt lâu đời và chuyển mình thành một phong cách thưởng thức đương đại, bắt trọn hơi thở năng động của cuộc sống ngày nay.",
    ],
  ];
  return (
    <>
      <section className="about-hero container page-space">
        <div>
          <p className="eyebrow">Câu chuyện thương hiệu</p>
          <h1>
            Từ thổ nhưỡng
            <br />
            đến nguyên bản
          </h1>
          <p>
            CRACK BEANS ra đời từ sự tôn trọng đối với hạt cà phê đặc sản Việt
            Nam. Chúng tôi tuyển chọn kỹ lưỡng những mẻ hạt chất lượng cao, mang
            đến sự minh bạch tuyệt đối về nguồn gốc. Mỗi sản phẩm đều mang đậm
            dấu ấn tối giản — chân thật, mạnh mẽ và rõ ràng.
          </p>
          <Link className="button" to="/san-pham">
            Khám phá sản phẩm
          </Link>
        </div>
        <Image
          src={data.assets.about}
          alt="Câu chuyện cà phê Crack Beans"
          width="700"
          height="600"
        />
      </section>
      <section className="container section-space">
        <p className="eyebrow">Điều chúng tôi theo đuổi</p>
        <h2>3 giá trị cốt lõi</h2>
        <div className="values-grid">
          {values.map(([title, text], i) => (
            <article key={title}>
              <Image
                src={data.assets.values[i]}
                alt={title}
                loading="lazy"
                width="450"
                height="450"
              />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="commitment">
        <p className="eyebrow">Cam kết</p>
        <blockquote>
          “Gìn giữ giá trị khởi nguyên bằng quy trình vận hành nghiêm cẩn, chúng
          tôi trao gửi trọn vẹn hương vị đặc trưng từ nông hộ tới khách hàng,
          tạo dựng niềm tin vững bền.”
        </blockquote>
      </section>
    </>
  );
}
const sortOptions = [
  ["featured", "Đề xuất"],
  ["asc", "Giá tăng dần"],
  ["desc", "Giá giảm dần"],
] as const;
function SortMenu({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  const current = sortOptions.find(([v]) => v === value)?.[1];
  return (
    <div
      className="sort-menu"
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        className="sort-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Sắp xếp: ${current}`}
        onClick={() => setOpen(!open)}
      >
        <ArrowUpDown size={16} aria-hidden="true" />
        {current}
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {open && (
        <ul role="listbox" aria-label="Sắp xếp sản phẩm">
          {sortOptions.map(([v, label]) => (
            <li key={v}>
              <button
                role="option"
                aria-selected={v === value}
                onClick={() => {
                  onChange(v);
                  setOpen(false);
                }}
              >
                {label}
                {v === value && <Check size={16} aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export function Shop({ onQuick }: QuickProps) {
  const {data}=useContent();
  const [params, setParams] = useSearchParams();
  const filter = params.get("loai") || "Tất cả";
  const [sort, setSort] = useState("featured");
  let products = data.products.filter(
    (p) => filter === "Tất cả" || p.category === filter,
  );
  products = [...products].sort((a, b) =>
    sort === "asc"
      ? a.price - b.price
      : sort === "desc"
        ? b.price - a.price
        : data.products.indexOf(b) - data.products.indexOf(a),
  );
  return (
    <>
      <section className="shop-banner">
        <Image
          src={data.assets.shop}
          alt="Bộ sưu tập cà phê Crack Beans"
          width="1440"
          height="280"
        />
        <div className="container">
          <p className="eyebrow">Archive Hybrid Coffee</p>
          <h1>Cà phê nguyên bản</h1>
        </div>
      </section>
      <section className="container page-space">
        <nav className="breadcrumbs">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <span>Sản phẩm</span>
        </nav>
        <div className="shop-toolbar">
          <div
            className="filter-tabs"
            role="group"
            aria-label="Lọc loại cà phê"
          >
            {["Tất cả", "Robusta", "Arabica"].map((c) => (
              <button
                key={c}
                aria-pressed={filter === c}
                onClick={() => setParams(c === "Tất cả" ? {} : { loai: c })}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="result-row">
          <p className="muted">{products.length} sản phẩm</p>
          <SortMenu value={sort} onChange={setSort} />
        </div>
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onQuick={onQuick} />
          ))}
        </div>
        {!products.length && (
          <p>
            Chưa có sản phẩm trong danh mục này.{" "}
            <Link to="/san-pham">Xem tất cả</Link>
          </p>
        )}
      </section>
    </>
  );
}
export function Blog() {
  const {data}=useContent();
  return (
    <section className="container page-space blog-head">
      <p className="eyebrow">Chuyện cà phê</p>
      <h1>Góc cà phê Crack Beans</h1>
      <div className="blog-grid">
        {data.articles.map((p, i) => (
          <article className="blog-card" key={p.id}>
            <Link to={`/blog/${p.id}`}>
              <Image
                src={p.image}
                alt={p.title}
                width="700"
                height="400"
                loading="lazy"
              />
            </Link>
            <p className="eyebrow">
              {i === 0 ? "Pha chế · 2 phút đọc" : "Hạt cà phê · 3 phút đọc"}
            </p>
            <h2>
              <Link to={`/blog/${p.id}`}>{p.title}</Link>
            </h2>
            <Link className="text-link" to={`/blog/${p.id}`}>
              Đọc bài viết
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
type Block =
  | { type: "p" | "h2"; text: string }
  | { type: "h3"; text: string; body: string[] };
// Article text: blank line separates blocks, "## " = heading, "### " = sub-section.
function parseArticle(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.split(/\n\s*\n/)) {
    const t = raw.trim();
    if (!t) continue;
    const last = blocks.at(-1);
    if (t.startsWith("### ")) blocks.push({ type: "h3", text: t.slice(4), body: [] });
    else if (t.startsWith("## ")) blocks.push({ type: "h2", text: t.slice(3) });
    else if (last?.type === "h3") last.body.push(t);
    else blocks.push({ type: "p", text: t });
  }
  return blocks;
}
function Paragraph({ text, lead = false }: { text: string; lead?: boolean }) {
  const m = /^([^:]{2,24}):\s*(.+)$/s.exec(text);
  return (
    <p className={lead ? "article-lead" : undefined}>
      {m ? (
        <>
          <strong>{m[1]}:</strong> {m[2]}
        </>
      ) : (
        text
      )}
    </p>
  );
}
export function Post() {
  const {data}=useContent();
  const { id } = useParams(),
    post = data.articles.find((p) => p.id === id);
  if (!post)
    return (
      <section className="container page-space">
        <h1>Không tìm thấy bài viết</h1>
        <Link to="/blog">Về blog</Link>
      </section>
    );
  const blocks = parseArticle(post.text);
  return (
    <article className="article container page-space">
      <Link className="text-link" to="/blog">
        ← Tất cả bài viết
      </Link>
      <h1>{post.title}</h1>
      <Image
        className="article-cover"
        src={post.image}
        alt={post.title}
        width="1000"
        height="560"
      />
      {blocks.map((b, i) => {
        if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
        if (b.type === "h3") {
          const step = /^Bước (\d+)/.exec(b.text);
          const src = step && post.steps?.[Number(step[1]) - 1];
          if (src)
            return (
              <section className="brew-step" key={i}>
                <Image
                  src={src}
                  alt={`Minh họa ${b.text.toLowerCase()} pha phin`}
                  width="900"
                  height="1125"
                  loading="lazy"
                  sizes="220px"
                />
                <div>
                  <h3>{b.text}</h3>
                  {b.body.map((t, j) => (
                    <Paragraph key={j} text={t} />
                  ))}
                </div>
              </section>
            );
          return (
            <section key={i}>
              <h3>{b.text}</h3>
              {b.body.map((t, j) => (
                <Paragraph key={j} text={t} />
              ))}
            </section>
          );
        }
        return <Paragraph key={i} text={b.text} lead={i === 0} />;
      })}
      <Link className="button" to="/san-pham">
        Khám phá sản phẩm
      </Link>
    </article>
  );
}
export function Contact() {
  return (
    <section className="container page-space contact-page">
      <p className="eyebrow">Kết nối với Crack Beans</p>
      <h1>
        Một cuộc trò chuyện,
        <br />
        một gu cà phê.
      </h1>
      <div className="contact-grid">
        <p>
          Bạn cần chọn hạt, tư vấn cách pha hay hỗ trợ đơn hàng? Liên hệ với
          chúng tôi qua các kênh bên dưới.
        </p>
        <div>
          <a href="tel:0767509715">
            <Phone />
            <span>
              <small>Hotline</small>076 750 9715
            </span>
          </a>
          <a href="mailto:crackbeans.4t@gmail.com">
            <Mail />
            <span>
              <small>Email</small>crackbeans.4t@gmail.com
            </span>
          </a>
          <div className="contact-address">
            <MapPin />
            <span>
              <small>Địa chỉ</small>109/3 Nguyễn Ảnh Thủ, Hóc Môn, TP. Hồ Chí
              Minh
            </span>
          </div>
          <p>Giờ mở cửa: 7:00 – 22:00 mỗi ngày</p>
        </div>
      </div>
    </section>
  );
}
export function Policy() {
  const { id } = useParams();
  const titles: Record<string, string> = {
    "giao-hang": "Chính sách giao hàng",
    "doi-tra": "Đổi trả & hoàn tiền",
    "bao-mat": "Chính sách bảo mật",
    "dieu-khoan": "Điều khoản sử dụng",
  };
  return (
    <section className="container article page-space">
      <p className="eyebrow">Hỗ trợ khách hàng</p>
      <h1>{titles[id || ""] || "Chính sách"}</h1>
      <p>Cập nhật ngày 01/11/2026. Liên hệ hỗ trợ: 076 750 9715 hoặc crackbeans.4t@gmail.com.</p>
      {id==='giao-hang'&&<><h2>Xác nhận trước khi giao</h2><p>Gửi biểu mẫu COD là gửi yêu cầu đặt hàng. Cửa hàng sẽ gọi lại để xác nhận sản phẩm, địa chỉ, phí vận chuyển và thời gian dự kiến trước khi gửi hàng. Phí giao chưa nằm trong tiền sản phẩm hiển thị trên website.</p><h2>Thanh toán tiền mặt</h2><p>Bạn thanh toán tiền mặt khi nhận hàng theo số tiền đã được cửa hàng xác nhận. Nếu cần đổi địa chỉ, đổi sản phẩm hoặc hủy yêu cầu, vui lòng liên hệ sớm trước khi cửa hàng bàn giao cho đơn vị vận chuyển.</p></>}
      {id==='doi-tra'&&<><h2>Khi sản phẩm có vấn đề</h2><p>Nếu nhận sai sản phẩm, bao bì hư hỏng hoặc sản phẩm có dấu hiệu bất thường, hãy giữ lại bao bì và liên hệ cửa hàng kèm mã yêu cầu, ảnh sản phẩm và mô tả vấn đề. Cửa hàng sẽ đối chiếu trước khi thống nhất phương án đổi, nhận lại hoặc hoàn tiền phù hợp.</p><h2>Trao đổi rõ trước khi gửi lại</h2><p>Không tự gửi trả khi chưa có hướng dẫn từ cửa hàng. Điều kiện, chi phí gửi lại và hình thức hoàn tiền sẽ được thông báo sau khi kiểm tra từng trường hợp; website chưa áp dụng mức phí hoặc thời hạn đổi trả cố định.</p></>}
      {id==='dieu-khoan'&&<><h2>Thông tin sản phẩm và giá</h2><p>Giá niêm yết hiện áp dụng cho gói 250 g. Gói 500 g có giá gấp đôi gói 250 g. Hình ảnh thể hiện bao bì và hướng dẫn sản phẩm; màu sắc có thể khác giữa các màn hình.</p><h2>Yêu cầu đặt hàng</h2><p>Biểu mẫu COD không thu tiền trực tuyến và không tự xác nhận lịch giao. Cửa hàng liên hệ để thống nhất sản phẩm, tổng tiền và việc giao hàng. Vui lòng cung cấp thông tin chính xác, không gửi nội dung giả mạo hoặc gây cản trở hoạt động của website.</p></>}
      {id === "bao-mat" && (
        <><h2>Thông tin được xử lý</h2><p>Khi bạn gửi yêu cầu COD, website nhận họ tên, số điện thoại, địa chỉ giao hàng, ghi chú và sản phẩm đã chọn để liên hệ, xác nhận và xử lý yêu cầu. Không cung cấp dữ liệu nhạy cảm trong phần ghi chú. Website không thu thập thông tin thẻ ngân hàng.</p><h2>Lưu trữ và quyền truy cập</h2><p>Yêu cầu được lưu trong database Neon kết nối qua hạ tầng Vercel. Chỉ tài khoản quản trị được đăng nhập mới xem và xử lý dữ liệu đơn. Thông tin cần cho việc giao hàng có thể được chuyển cho đơn vị vận chuyển khi cửa hàng và khách đã xác nhận giao.</p><h2>Giỏ hàng và cookie</h2><p>Giỏ hàng được lưu bằng localStorage trên trình duyệt. Cookie phiên HttpOnly được dùng cho đăng nhập quản trị. Bản hiện tại không gắn công cụ quảng cáo hoặc theo dõi hành vi của bên thứ ba; nhà cung cấp hạ tầng có thể xử lý nhật ký kỹ thuật để vận hành dịch vụ.</p><h2>Yêu cầu xem, sửa hoặc xóa</h2><p>Bạn có thể liên hệ crackbeans.4t@gmail.com hoặc 076 750 9715 để yêu cầu xem, sửa hoặc xóa thông tin yêu cầu của mình. Cửa hàng xác minh người yêu cầu trước khi xử lý và chỉ giữ dữ liệu cần thiết cho việc hỗ trợ, giải quyết giao dịch hoặc nghĩa vụ áp dụng. Xóa từng sản phẩm trong giỏ để thay đổi dữ liệu lưu trên trình duyệt.</p></>
      )}
      <a className="button" href="mailto:crackbeans.4t@gmail.com">
        Liên hệ cửa hàng <Mail size={18} />
      </a>
    </section>
  );
}

