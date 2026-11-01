import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Overlay from "./Overlay";
import { useContent } from "./content";

type Answers = { brew: string; taste: string; milk: string };
const SEEN = "cb-quiz-seen-v1";
export const OPEN_QUIZ = "cb:open-quiz";

const questions: { key: keyof Answers; title: string; options: [string, string, string][] }[] = [
  {
    key: "brew",
    title: "Bạn thường pha cà phê bằng gì?",
    options: [
      ["phin", "Phin", "Pha phin truyền thống"],
      ["may", "Máy espresso", "Espresso, latte, cappuccino"],
      ["pour", "Pour over", "Rót tay, V60, Chemex"],
      ["tien", "Chưa rõ", "Mình muốn được gợi ý"],
    ],
  },
  {
    key: "taste",
    title: "Gu vị bạn thích nhất?",
    options: [
      ["dam", "Đậm, đắng mạnh", "Cacao, chocolate đen"],
      ["beo", "Béo thơm", "Thơm bơ, hậu caramel"],
      ["can-bang", "Cân bằng, ngọt hậu", "Mượt, dễ uống"],
      ["chua-thanh", "Chua thanh, hương hoa", "Hoa trắng, cam chanh"],
    ],
  },
  {
    key: "milk",
    title: "Bạn uống cà phê thế nào?",
    options: [
      ["den", "Đen", "Nóng hoặc đá"],
      ["sua", "Với sữa", "Sữa đá, latte"],
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

  useEffect(() => {
    const show = () => {
      setStep(0);
      setAnswers({});
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

  function choose(key: keyof Answers, value: string) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (step < questions.length - 1) return setStep(step + 1);
    const picked = Object.values(next);
    const ranked = data.products
      .map((p, i) => ({ id: p.id, score: picked.reduce((n, a) => n + (weights[p.id]?.[a] ?? 0), 0), i }))
      .sort((a, b) => b.score - a.score || a.i - b.i);
    const result = ranked[0]?.id;
    if (!result) return close();
    void fetch("/api/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: next, result }),
    }).catch(() => undefined);
    close();
    navigate(`/san-pham/${result}?goi-y=1`);
  }

  const q = questions[step];
  return (
    <Overlay open={open} onClose={close} title="Tìm cà phê hợp gu" wide>
      <div className="drawer-body quiz">
        <div className="quiz-progress" aria-label={`Câu ${step + 1} trên ${questions.length}`}>
          {questions.map((_, i) => (
            <span key={i} className={i <= step ? "on" : ""} />
          ))}
        </div>
        <p className="eyebrow">
          Câu {step + 1}/{questions.length}
        </p>
        <h3>{q.title}</h3>
        <div className="quiz-options">
          {q.options.map(([value, label, hint]) => (
            <button key={value} className={answers[q.key] === value ? "selected" : ""} onClick={() => choose(q.key, value)}>
              <strong>{label}</strong>
              <span>{hint}</span>
            </button>
          ))}
        </div>
        <div className="quiz-foot">
          {step > 0 ? (
            <button className="text-button" onClick={() => setStep(step - 1)}>
              ← Quay lại
            </button>
          ) : (
            <span />
          )}
          <button className="text-button" onClick={close}>
            Bỏ qua
          </button>
        </div>
      </div>
    </Overlay>
  );
}
