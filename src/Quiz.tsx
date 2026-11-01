import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Coffee, ShoppingCart, Cookie, Droplets, Filter, Flame, Flower2, Gauge, Milk, Scale, Sparkles } from "lucide-react";
import Overlay from "./Overlay";
import Image from "./Image";
import { useContent } from "./content";
import { money, useCart } from "./store";
import { minPrice, variantsOf } from "./catalog";

type Answers = { brew: string; taste: string; milk: string };
const SEEN = "cb-quiz-seen-v1";
export const OPEN_QUIZ = "cb:open-quiz";

const questions: { key: keyof Answers; title: string; options: [string, string, string, ReactNode][] }[] = [
  {
    key: "brew",
    title: "Bạn thường pha cà phê bằng gì?",
    options: [
      ["phin", "Phin", "Pha phin truyền thống", <Filter />],
      ["may", "Máy espresso", "Espresso, latte, cappuccino", <Gauge />],
      ["pour", "Pour over", "Rót tay, V60, Chemex", <Droplets />],
      ["tien", "Chưa rõ", "Mình muốn được gợi ý", <Sparkles />],
    ],
  },
  {
    key: "taste",
    title: "Gu vị bạn thích nhất?",
    options: [
      ["dam", "Đậm, đắng mạnh", "Cacao, chocolate đen", <Flame />],
      ["beo", "Béo thơm", "Thơm bơ, hậu caramel", <Cookie />],
      ["can-bang", "Cân bằng", "Mượt, ngọt hậu, dễ uống", <Scale />],
      ["chua-thanh", "Chua thanh", "Hương hoa, cam chanh", <Flower2 />],
    ],
  },
  {
    key: "milk",
    title: "Bạn uống cà phê thế nào?",
    options: [
      ["den", "Uống đen", "Nóng hoặc đá", <Coffee />],
      ["sua", "Với sữa", "Sữa đá, latte, bạc xỉu", <Milk />],
    ],
  },
];

// Điểm dựa trên mô tả hương vị và cách pha gợi ý của từng sản phẩm.
const weights: Record<string, Partial<Record<string, number>>> = {
  "robusta-clean-daklak": { phin: 3, may: 2, dam: 3, den: 2, tien: 1 },
  "robusta-clean-rang-bo": { phin: 3, beo: 3, sua: 3, tien: 1 },
  "robusta-honey-99": { phin: 2, "can-bang": 3, den: 1, sua: 1, tien: 1 },
  "robusta-se": { phin: 2, "can-bang": 2, den: 2 },
  "arabica-dark-roast-s18": { may: 3, dam: 1, "can-bang": 1, sua: 2 },
  "specialty-nui-min": { pour: 3, "chua-thanh": 3, den: 2 },
};

export default function Quiz() {
  const { data } = useContent();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [picked, setPicked] = useState("");
  const [picks, setPicks] = useState<string[] | null>(null);
  const cart = useCart();

  useEffect(() => {
    const show = () => {
      setStep(0);
      setAnswers({});
      setPicked("");
      setPicks(null);
      setOpen(true);
    };
    window.addEventListener(OPEN_QUIZ, show);
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      if (!localStorage.getItem(SEEN) && !/^\/(admin|thanh-toan)/.test(pathname)) timer = setTimeout(show, 1500);
    } catch {
      /* Không có localStorage thì không tự mở. */
    }
    return () => {
      window.removeEventListener(OPEN_QUIZ, show);
      clearTimeout(timer);
    };
    // Chỉ tự mở một lần khi vào trang.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function close() {
    setOpen(false);
    try {
      localStorage.setItem(SEEN, "1");
    } catch {
      /* ignore */
    }
  }

  function finish(next: Answers) {
    const values = Object.values(next);
    const ranked = data.products
      .map((p, i) => ({ id: p.id, score: values.reduce((n, a) => n + (weights[p.id]?.[a] ?? 0), 0), i }))
      .sort((a, b) => b.score - a.score || a.i - b.i);
    const result = ranked[0]?.id;
    if (!result) return close();
    void fetch("/api/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: next, result }),
    }).catch(() => undefined);
    setPicks(ranked.slice(0, 2).map((r) => r.id));
  }
  // Mở trang sản phẩm chỉ khi khách chủ động bấm xem.
  function view(id: string) {
    close();
    navigate(`/san-pham/${id}?goi-y=1`);
  }

  function choose(key: keyof Answers, value: string) {
    if (picked) return;
    const next = { ...answers, [key]: value };
    setAnswers(next);
    setPicked(value);
    // Giữ trạng thái đã chọn một nhịp ngắn để khách thấy lựa chọn của mình.
    setTimeout(() => {
      setPicked("");
      if (step < questions.length - 1) setStep(step + 1);
      else finish(next as Answers);
    }, 260);
  }

  const q = questions[step];
  const label = (key: keyof Answers) => questions.find((x) => x.key === key)?.options.find((o) => o[0] === answers[key])?.[1];
  const best = picks && data.products.find((p) => p.id === picks[0]);
  const alt = picks && data.products.find((p) => p.id === picks[1]);
  return (
    <Overlay open={open} onClose={close} title="Tìm cà phê hợp gu" wide className="quiz-dialog">
      <div className="quiz">
        <aside className="quiz-visual">
          <Image src="/assets/blog-phin.webp" alt="" sizes="(min-width: 768px) 360px, 100vw" width="720" height="900" />
          <div>
            <p className="eyebrow">Crack Beans gợi ý</p>
            <p className="quiz-visual-title">Tìm cà phê hợp gu của bạn</p>
            <p>3 câu hỏi · khoảng 20 giây</p>
          </div>
        </aside>

        {best ? (
          <section className="quiz-body quiz-result" aria-live="polite">
            <p className="eyebrow">Gợi ý dành cho bạn</p>
            <article className="quiz-pick">
              <Image src={best.images[0].src} alt={best.images[0].alt} sizes="160px" width="320" height="320" />
              <div>
                <span className="quiz-pick-tag">{best.category}</span>
                <h3>{best.name}</h3>
                <p className="quiz-pick-price">
                  {variantsOf(best).length > 1 && "Từ "}
                  {money(minPrice(best))}
                </p>
                <p className="quiz-pick-desc">{best.description}</p>
              </div>
            </article>
            <ul className="quiz-reasons" aria-label="Vì sao hợp với bạn">
              {(["brew", "taste", "milk"] as const).map((k) => label(k) && <li key={k}>{label(k)}</li>)}
            </ul>
            <div className="quiz-actions">
              <button className="button" onClick={() => view(best.id)}>
                Xem sản phẩm
              </button>
              <button
                className="button button-outline"
                onClick={() => {
                  cart.add(best.id, undefined, 1);
                  close();
                }}
              >
                <ShoppingCart size={18} aria-hidden="true" /> Thêm vào giỏ
              </button>
            </div>
            {alt && (
              <button className="quiz-alt" onClick={() => view(alt.id)}>
                <Image src={alt.images[0].src} alt="" sizes="48px" width="96" height="96" />
                <span>
                  <small>Hoặc thử</small>
                  <strong>{alt.name}</strong>
                </span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            )}
            <div className="quiz-result-foot">
              <button
                className="quiz-skip"
                onClick={() => {
                  setPicks(null);
                  setAnswers({});
                  setStep(0);
                }}
              >
                Làm lại
              </button>
              <button className="quiz-skip" onClick={close}>
                Để sau
              </button>
            </div>
          </section>
        ) : (
        <section className="quiz-body" aria-live="polite">
          <div className="quiz-top">
            {step > 0 ? (
              <button className="quiz-back" onClick={() => setStep(step - 1)} aria-label="Quay lại câu trước">
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
            ) : (
              <span />
            )}
            <ol className="quiz-steps" aria-label={`Câu ${step + 1} trên ${questions.length}`}>
              {questions.map((item, i) => (
                <li key={item.key} className={i < step ? "done" : i === step ? "current" : ""} />
              ))}
            </ol>
            <span className="quiz-count">
              {step + 1}/{questions.length}
            </span>
          </div>

          <div className="quiz-question" key={step}>
            <h3>{q.title}</h3>
            <div className={`quiz-options${q.options.length === 2 ? " two" : ""}`}>
              {q.options.map(([value, label, hint, icon]) => (
                <button
                  key={value}
                  aria-pressed={answers[q.key] === value}
                  className={picked === value ? "picked" : ""}
                  onClick={() => choose(q.key, value)}
                >
                  <span className="quiz-icon" aria-hidden="true">
                    {icon}
                  </span>
                  <strong>{label}</strong>
                  <small>{hint}</small>
                </button>
              ))}
            </div>
          </div>

          <button className="quiz-skip" onClick={close}>
            Để sau
          </button>
        </section>
        )}
      </div>
    </Overlay>
  );
}
