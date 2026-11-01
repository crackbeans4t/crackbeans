import Image from "./Image";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShoppingCart } from "lucide-react";
import { type Product, useCart, money } from "./store";
export function ProductCard({
  product,
  onQuick,
}: {
  product: Product;
  onQuick: (p: Product) => void;
}) {
  const cart = useCart();
  return (
    <article className="product-card">
      <div className="product-photo">
        <Link to={`/san-pham/${product.id}`} aria-label={`Xem ${product.name}`}>
          <Image
            src={product.images[0].src}
            sizes="(min-width: 1200px) 400px, (min-width: 701px) 33vw, 50vw"
            alt={product.images[0].alt}
            width="700"
            height="700"
            loading="lazy"
          />
          <Image className="product-hover-image" src={product.images[1]?.src ?? product.images[0].src} alt="" aria-hidden="true" width="700" height="700" loading="lazy" />
        </Link>
        <button className="quick-button quick-add" aria-label={`Thêm nhanh ${product.name}, Hạt 250 g`} title="Thêm nhanh 1 gói Hạt 250 g" onClick={() => cart.add(product.id, "Hạt", 1)}>
          <ShoppingCart size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="product-meta">
        <div className="product-badges"><span className={`brand-badge ${product.category.toLowerCase()}`}>{product.category}</span><span className="pack-badge">250 g · 500 g</span></div>
        <h3>
          <Link to={`/san-pham/${product.id}`}>{product.name}</Link>
        </h3>
        <p>{money(product.price)}</p>
        <Link className="text-link" to={`/san-pham/${product.id}`}>
          Xem sản phẩm <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
export function Quantity({
  value,
  onChange,
  label = "Số lượng",
}: {
  value: number;
  onChange: (n: number) => void;
  label?: string;
}) {
  return (
    <div className="quantity" role="group" aria-label={label}>
      <button
        aria-label={`Giảm ${label.toLowerCase()}`}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={16} />
      </button>
      <input
        aria-label={label}
        type="number"
        min="1"
        max="99"
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          onChange(
            Number.isFinite(v) ? Math.max(1, Math.min(99, Math.round(v))) : 1,
          );
        }}
      />
      <button
        aria-label={`Tăng ${label.toLowerCase()}`}
        disabled={value >= 99}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
export function ProductDetail({
  product,
  onAdded,
  compact = false,
}: {
  product: Product;
  onAdded: () => void;
  compact?: boolean;
}) {
  const [image, setImage] = useState(0),
    [grind, setGrind] = useState<"Hạt" | "Bột">("Hạt"),
    [size, setSize] = useState<"250g" | "500g">("250g"),
    [quantity, setQuantity] = useState(1);
  const cart = useCart();
  return (
    <div className={`product-detail ${compact ? "compact" : ""}`}>
      <div className="gallery">
        <Image
          className="main-product-image"
          src={product.images[image].src}
          alt={product.images[image].alt}
          width="700"
          height="700"
        />
        <div className="thumbnails">
          {product.images.map((img, i) => (
            <button
              key={img.src}
              aria-label={i === 0 ? "Xem bao bì" : "Xem hướng dẫn pha"}
              aria-pressed={image === i}
              onClick={() => setImage(i)}
            >
              <Image src={img.src} alt="" width="64" height="64" />
            </button>
          ))}
        </div>
        <a
          className="text-link"
          href={product.images[image].src}
          target="_blank"
          rel="noreferrer"
        >
          Mở ảnh đầy đủ <ArrowRight size={16} />
        </a>
      </div>
      <div className="product-info">
        <p className="eyebrow">{product.category} / Archive Hybrid Coffee</p>
        {compact ? <h3>{product.name}</h3> : <h1>{product.name}</h1>}
        <p className="price">
          {money(product.price * (size === "500g" ? 2 : 1))} <span>/ {size === "500g" ? "500 g" : "250 g"}</span>
        </p>
        <p>{product.description}</p>
        <fieldset>
          <legend>Định lượng</legend>
          <div className="choice-row">
            {(["250g", "500g"] as const).map((s) => <button type="button" key={s} aria-pressed={size === s} className={`choice ${size === s ? "selected" : ""}`} onClick={() => setSize(s)}>{s === "500g" ? "500 g" : "250 g"}</button>)}
          </div>
          <small>
            Gói 500 g có giá gấp đôi gói 250 g.
          </small>
        </fieldset>
        <fieldset>
          <legend>Phân loại</legend>
          <div className="choice-row">
            {(["Hạt", "Bột"] as const).map((g) => (
              <label
                className={`choice ${grind === g ? "selected" : ""}`}
                key={g}
              >
                <input
                  type="radio"
                  name={`grind-${compact ? "quick" : "page"}`}
                  value={g}
                  checked={grind === g}
                  onChange={() => setGrind(g)}
                />
                {g}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="purchase-row">
          <Quantity value={quantity} onChange={setQuantity} />
          <button
            className="button"
            onClick={() => {
              cart.add(product.id, grind, quantity, size);
              onAdded();
            }}
          >
            Thêm vào giỏ hàng <Plus size={18} />
          </button>
        </div>
        <p className="product-note">
          Thông tin giao hàng và phí vận chuyển được xác nhận trước khi đặt
          hàng.
        </p>
      </div>
    </div>
  );
}
