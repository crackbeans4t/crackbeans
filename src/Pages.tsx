import Image from "./Image";
import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
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
          <p className="eyebrow">
            Archive Hybrid — Contemporary Vietnamese Coffee
          </p>
          <h1>
            Lưu trữ hương vị cà phê
            <br />
            rang mộc nguyên bản
          </h1>
          <p className="hero-description">
            Vượt trên một thức uống thông thường, đây là sự giao thoa hoàn hảo
            giữa tinh hoa nông sản Việt, nghệ thuật rang mộc thủ công tỉ mỉ và
            tư duy thiết kế tối giản, hiện đại trong từng mẻ hạt.
          </p>
          <Link className="button button-cream" to="/san-pham">
            Khám phá sản phẩm <ArrowRight size={18} />
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
          Câu chuyện Crack Beans <ArrowRight size={18} />
        </Link>
      </section>
      <section className="container section-space featured">
        <div className="section-head">
          <div>
            <p className="eyebrow">Sản phẩm nổi bật</p>
            <h2>Arabica</h2>
          </div>
          <Link className="text-link" to="/san-pham">
            Tất cả sản phẩm <ArrowRight size={18} />
          </Link>
        </div>
        <div className="featured-grid">
          {data.products.filter(p=>p.category==='Arabica').slice(0,2).map((p) => (
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
        {data.regions.map((r, i) => (
          <article className="origin-row" key={r.name}>
            <Image
              src={r.image}
              alt={`Vùng nguyên liệu ${r.name}`}
              loading="lazy"
              width="600"
              height="400"
            />
            <div>
              <span className="origin-number">0{i + 1}</span>
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
          <p className="eyebrow">Brand story</p>
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
            Khám phá sản phẩm <ArrowRight size={18} />
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
          <label className="sort-label">
            Sắp xếp{" "}
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Đề xuất</option>
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </select>
          </label>
        </div>
        <p className="muted result-count">{products.length} sản phẩm</p>
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
    <section className="container page-space">
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
              Đọc bài viết <ArrowRight size={18} />
            </Link>
          </article>
        ))}
      </div>
    </section>
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
  const body =
    post.text.split("phút đọc")[1]?.split("Bài đăng gần đây")[0] || post.text;
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
      {body
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) =>
          p.length < 75 && !p.startsWith("Thao tác") ? (
            <h2 key={i}>{p}</h2>
          ) : (
            <p key={i}>{p}</p>
          ),
        )}
      {post.steps && (
        <section className="brewing-steps">
          <h2>5 bước pha phin bằng hình ảnh</h2>
          <div>
            {post.steps.map((src, i) => (
              <figure key={src}>
                <Image
                  src={src}
                  alt={`Hướng dẫn pha phin — bước ${i + 1}`}
                  width="900"
                  height="1125"
                  loading="lazy"
                />
                <figcaption>Bước {i + 1}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      <Link className="button" to="/san-pham">
        Khám phá sản phẩm <ArrowRight size={18} />
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
      <p>
        Chính sách chi tiết đang được cửa hàng hoàn thiện. Trước khi đặt hàng,
        vui lòng liên hệ Crack Beans để xác nhận phí giao hàng, điều kiện đổi
        trả và phương thức thanh toán áp dụng cho đơn hàng của bạn.
      </p>
      {id === "bao-mat" && (
        <p>
          Bản website này lưu giỏ hàng trên trình duyệt của bạn. Chưa có biểu
          mẫu gửi dữ liệu khách hàng, hệ thống tài khoản hay cổng thanh toán
          trực tuyến. Bạn có thể xóa giỏ hàng bằng các nút xóa sản phẩm.
        </p>
      )}
      <a className="button" href="mailto:crackbeans.4t@gmail.com">
        Liên hệ cửa hàng <Mail size={18} />
      </a>
    </section>
  );
}
