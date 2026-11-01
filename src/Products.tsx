import Image from "./Image";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { type Product, useCart, money } from "./store";
import { formatWeight, grindsOf, priceOf, variantsOf } from "./catalog";
export function ProductCard({
  product,
  onQuick,
}: {
  product: Product;
  onQuick: (p: Product) => void;
}) {
  const cart = useCart();
  const first = variantsOf(product)[0];
  const many = variantsOf(product).length > 1;
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
        <button className="icon-button product-image-cart" aria-label={`Thêm ${product.name} (${grindsOf(product)[0]} ${formatWeight(first.weight)}) vào giỏ`} title="Thêm vào giỏ" onClick={() => cart.add(product.id, undefined, 1)}><ShoppingCart size={20} aria-hidden="true" /></button>
      </div>
      <div className="product-meta">
        <h3>
          <Link to={`/san-pham/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="card-price">{many && <span>Từ </span>}{money(first.price)} <span>/ {formatWeight(first.weight)}</span></p>

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
  const navigate = useNavigate();
  const [image, setImage] = useState(0),
    [grind, setGrind] = useState(grindsOf(product)[0]),
    [size, setSize] = useState(variantsOf(product)[0].weight),
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
      </div>
      <div className="product-info">
        <p className="eyebrow">{product.category}</p>
        {compact ? <h3>{product.name}</h3> : <h1>{product.name}</h1>}
        <p className="price">
          {money(priceOf(product, size) ?? 0)} <span>/ {formatWeight(size)}</span>
        </p>
        <p>{product.description}</p>
        <fieldset>
          <legend>Định lượng</legend>
          <div className="choice-row">
            {variantsOf(product).map(({ weight }) => (
              <button type="button" key={weight} aria-pressed={size === weight} className={`choice ${size === weight ? "selected" : ""}`} onClick={() => setSize(weight)}>
                {formatWeight(weight)}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Phân loại</legend>
          <div className="choice-row">
            {grindsOf(product).map((g) => (
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
            <ShoppingCart size={18} aria-hidden="true" /> Thêm vào giỏ
          </button>
        </div>
        <button
          className="button button-outline full buy-now"
          onClick={() => {
            cart.add(product.id, grind, quantity, size);
            navigate("/thanh-toan");
          }}
        >
          Mua ngay
        </button>
      </div>
    </div>
  );
}
