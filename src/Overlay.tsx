import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
export default function Overlay({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const previousFocus=useRef<HTMLElement|null>(null);
  const overflow=useRef('');
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      if(!el.open) {
        previousFocus.current = document.activeElement as HTMLElement | null;
        overflow.current = document.body.style.overflow;
        el.showModal();
      }
      delete el.dataset.closing;
      document.body.style.overflow = "hidden";
    } else if(el.open) {
      el.dataset.closing='true';
      const timer=setTimeout(()=>{
        el.close(); delete el.dataset.closing;
        document.body.style.overflow=overflow.current;
        previousFocus.current?.focus();
      }, window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:180);
      return()=>clearTimeout(timer);
    }
  }, [open]);
  useEffect(()=>()=>{if(ref.current?.open){ref.current.close();document.body.style.overflow=overflow.current;}},[]);
  return (
    <dialog
      ref={ref}
      className={`drawer ${wide ? "drawer-wide" : ""}`}
      aria-label={title}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
        if (e.key === "Tab") {
          const items = Array.from(
            e.currentTarget.querySelectorAll<HTMLElement>(
              'button:not(:disabled),a[href],input:not(:disabled),select,summary,[tabindex="0"]',
            ),
          ).filter((el) => el.getClientRects().length > 0);
          const first = items[0],
            last = items.at(-1);
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const box = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < box.left ||
            e.clientX > box.right ||
            e.clientY < box.top ||
            e.clientY > box.bottom
          )
            onClose();
        }
      }}
    >
      <div className="drawer-head">
        <h2>{title}</h2>
        <button
          className="icon-button"
          aria-label={`Đóng ${title.toLowerCase()}`}
          onClick={onClose}
          autoFocus
        >
          <X size={22} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
