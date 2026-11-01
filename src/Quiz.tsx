import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import Overlay from "./Overlay";
import Image from "./Image";
import { useContent } from "./content";
import { money } from "./store";
import { minPrice, variantsOf } from "./catalog";
import { grindFor, matchProduct, profiles, type QuizAnswers } from "./quizLogic";

export const OPEN_QUIZ = "cb:open-quiz";

type Option = { value: string; label: string; hint: string; tag?: string; img?: string };
const questions: { key: keyof QuizAnswers; title: string; sub: string; options: Option[] }[] = [
  {
    key: "brew",
    title: "Dụng cụ pha chế chính của bạn là gì?",
    sub: "Độ mịn bột xay sẽ được CRACK BEANS điều chỉnh chính xác theo dụng cụ pha của bạn.",
    options: [
      { value: "phin", img: "/assets/quiz-brew-phin.webp", label: "Phin truyền thống", tag: "Medium Fine", hint: "Giúp thẩm thấu đều, không nghẹt phin" },
      { value: "may", img: "/assets/quiz-brew-may.webp", label: "Pha máy / Staresso", tag: "Fine", hint: "Chiết xuất dưới áp suất, tạo crema dày" },
    ],
  },
  {
    key: "taste",
    title: "Hương vị đặc trưng bạn ưa chuộng nhất?",
    sub: "Lựa chọn tầng hương vị khiến bạn hào hứng và thấy dễ chịu nhất.",
    options: [
      { value: "dam", img: "/assets/quiz-taste-dam.webp", label: "Đắng đậm & Đằm thắm", hint: "Thân vị dày, vị đắng di sản, tỉnh táo mạnh mẽ" },
      { value: "beo", img: "/assets/quiz-taste-beo.webp", label: "Béo ngậy & Đượm vị", hint: "Vị đằm béo ký ức, hòa quyện khi uống cùng sữa" },
      { value: "ngot", img: "/assets/quiz-taste-ngot.webp", label: "Ngọt hậu tự nhiên", hint: "Vị đắng dịu nhẹ, ngọt sâu nhờ hạt chín mộc" },
      { value: "thom", img: "/assets/quiz-taste-thom.webp", label: "Thơm thanh & Dịu nhẹ", hint: "Nồng nàn hương hoa quả, chua thanh dịu, hậu vị ngọt" },
    ],
  },
  {
    key: "freq",
    title: "Tần suất thưởng thức hằng ngày của bạn?",
    sub: "Gợi ý dòng hạt có hàm lượng caffeine vừa vặn nhất với cơ thể bạn.",
    options: [
      { value: "sang", label: "1 – 2 ly mỗi sáng", tag: "Bứt phá năng lượng", hint: "Cần cú hích tỉnh táo mạnh để giải quyết công việc" },
      { value: "ca-ngay", label: "Nhâm nhi cả ngày", tag: "Êm dịu, không sợ say", hint: "Cần dòng hạt mộc êm dịu, nhâm nhi thoải mái, không lo nôn nao" },
      { value: "thinh-thoang", label: "Thi thoảng / Cuối tuần", tag: "Trải nghiệm", hint: "Uống để chill, khám phá dải hương phong phú" },
    ],
  },
];
const letters = "ABCD";

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="gm-meter">
      <span>{label}</span>
      <span className="gm-dots" role="img" aria-label={`${value} trên 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <i key={n} className={n <= value ? "on" : ""} />
        ))}
      </span>
    </div>
  );
}

export default function Quiz() {
  const { data } = useContent();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<"welcome" | "steps" | "result">("welcome");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [name, setName] = useState("");

  function reset() {
    setScreen("welcome");
    setStep(0);
    setAnswers({});
  }
  useEffect(() => {
    const show = () => {
      reset();
      setOpen(true);
    };
    // Quiz chỉ mở khi khách bấm nút; không tự hiện khi vào web.
    window.addEventListener(OPEN_QUIZ, show);
    return () => window.removeEventListener(OPEN_QUIZ, show);
  }, []);
  // Link "/?grind-match" (ví dụ trong bài blog) mở quiz khi khách bấm vào.
  useEffect(() => {
    if (new URLSearchParams(location.search).has("grind-match")) {
      reset();
      setOpen(true);
      navigate(location.pathname, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  function close() {
    setOpen(false);
  }
  function choose(value: string) {
    const q = questions[step];
    setAnswers((old) => ({ ...old, [q.key]: value }));
    // Câu 1, 2 tự sang câu sau; câu 3 chờ khách bấm "Nhận kết quả".
    if (step < questions.length - 1) setTimeout(() => setStep((s) => s + 1), 220);
  }
  function submit() {
    const full = answers as QuizAnswers;
    const result = matchProduct(full);
    // Chỉ gửi câu trả lời và kết quả; tên khách không rời khỏi trình duyệt.
    void fetch("/api/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: full, result }),
    }).catch(() => undefined);
    setScreen("result");
  }

  const q = questions[step];
  const ready = !!(answers.brew && answers.taste && answers.freq);
  const resultId = ready ? matchProduct(answers as QuizAnswers) : "";
  const product = data.products.find((p) => p.id === resultId);
  const profile = profiles[resultId];
  const grind = answers.brew ? grindFor(answers.brew) : undefined;

  return (
    <Overlay open={open} onClose={close} title="Grind Match — Bạn thuộc gu cà phê nào?" wide className="quiz-dialog">
      {screen === "welcome" && (
        <div className="gm-welcome">
          <div className="gm-split">
            <Image className="gm-bean" src="/assets/quiz-cover.webp" alt="Hạt cà phê chia đôi: nửa Robusta rang đậm, nửa Arabica" sizes="(min-width: 768px) 520px, 100vw" width="820" height="560" fetchPriority="high" />
            <p className="gm-side left">
              <strong>Robusta</strong>
              <span>Đắng đậm</span>
            </p>
            <p className="gm-side right">
              <strong>Arabica</strong>
              <span>Thơm thanh</span>
            </p>
          </div>
          <div className="gm-welcome-text">
            <p className="eyebrow">Grind Match</p>
            <h3>Bạn thuộc gu cà phê nào?</h3>
            <p>Chỉ 30 giây để CRACK BEANS dán tem Custom Grind cá nhân hóa đúng gu cho bạn.</p>
            <button className="button" onClick={() => setScreen("steps")}>
              Bắt đầu khám phá (Get started) <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button className="quiz-skip" onClick={close}>
              Để sau
            </button>
          </div>
        </div>
      )}

      {screen === "steps" && (
        <section className="gm-steps" aria-live="polite">
          <div className="quiz-top">
            <button className="quiz-back" onClick={() => (step ? setStep(step - 1) : setScreen("welcome"))} aria-label="Quay lại">
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
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
            <div>
              <h3>
                Câu {step + 1}: {q.title}
              </h3>
              <p className="gm-sub">{q.sub}</p>
            </div>
            <div className={`gm-options n${q.options.length}`}>
              {q.options.map((o, i) => (
                <button key={o.value} className={o.img ? "has-img" : ""} aria-pressed={answers[q.key] === o.value} onClick={() => choose(o.value)}>
                  {o.img && (
                    <span className={`gm-option-img ${q.key}`}>
                      <Image src={o.img} alt="" sizes="(min-width: 768px) 220px, 45vw" width="440" height="330" />
                    </span>
                  )}
                  <span className="gm-letter" aria-hidden="true">
                    {letters[i]}
                  </span>
                  <span className="gm-option-text">
                    <strong>{o.label}</strong>
                    {o.tag && <em>{o.tag}</em>}
                    <small>{o.hint}</small>
                  </span>
                </button>
              ))}
            </div>
            {step === questions.length - 1 && (
              <div className="gm-final">
                <label className="gm-name">
                  <span>Tên in trên tem (không bắt buộc)</span>
                  <input value={name} maxLength={24} placeholder="Ví dụ: Minh Anh" autoComplete="given-name" onChange={(e) => setName(e.target.value)} />
                </label>
                <button className="button" disabled={!ready} onClick={submit}>
                  Nhận kết quả gợi ý <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {screen === "result" && product && profile && grind && (
        <section className="gm-result" aria-live="polite">
          <div className="gm-pack">
            <Image src={product.images[0].src} alt={product.images[0].alt} sizes="(min-width: 768px) 400px, 100vw" width="700" height="700" />
            <div className="gm-label">
              <span>Custom Grind</span>
              <strong>{grind.name}</strong>
              <small>{grind.use}</small>
              <hr />
              <small>Packed for:</small>
              <b>{name.trim() || "Bạn"}</b>
            </div>
          </div>
          <div className="gm-result-info">
            <p className="eyebrow">Gu của bạn là</p>
            <h3>{product.name}</h3>
            <p className="gm-tagline">{profile.tagline}</p>
            <p className="gm-price">
              {variantsOf(product).length > 1 && "Từ "}
              {money(minPrice(product))}
            </p>
            <div className="gm-profile">
              <p>Flavor Profile</p>
              <Meter label="Độ đắng" value={profile.bitterness} />
              <Meter label="Độ hương" value={profile.aroma} />
              <Meter label="Thân vị" value={profile.body} />
              <small>Chỉ số tham khảo theo mô tả hương vị.</small>
            </div>
            <button
              className="button full"
              onClick={() => {
                close();
                navigate(`/san-pham/${product.id}?goi-y=1`);
              }}
            >
              Xem chi tiết sản phẩm &amp; mua ngay <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button className="quiz-skip gm-redo" onClick={reset}>
              <RotateCcw size={15} aria-hidden="true" /> Làm lại quiz
            </button>
          </div>
        </section>
      )}
    </Overlay>
  );
}
