/*
 * 《秋天的雨》· 翻页课件框架
 * 切换如雾散开：opacity + 轻位移 + blur 消退
 * 左下角页码索引 + 底部进度线 + 右下章节导航
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DeckContextValue {
  index: number;
  total: number;
  go: (i: number) => void;
}
const DeckContext = createContext<DeckContextValue>({ index: 0, total: 0, go: () => {} });
export const useDeck = () => useContext(DeckContext);

interface DeckProps {
  slides: { id: string; node: ReactNode; dark?: boolean; interactive?: boolean }[];
  chapters: { label: string; slideIndex: number }[];
}

function initialIndex(total: number) {
  if (typeof window === "undefined") return 0;
  const m = window.location.hash.match(/#(\d+)/);
  if (!m) return 0;
  const n = parseInt(m[1], 10) - 1;
  return Number.isFinite(n) ? Math.max(0, Math.min(total - 1, n)) : 0;
}

export default function Deck({ slides, chapters }: DeckProps) {
  const [index, setIndex] = useState(() => initialIndex(slides.length));
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const animating = useRef(false);
  const wheelLock = useRef(0);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  const go = useCallback(
    (next: number) => {
      if (animating.current) return;
      const clamped = Math.max(0, Math.min(slides.length - 1, next));
      if (clamped === index) return;
      setDirection(clamped > index ? 1 : -1);
      setPrevIndex(index);
      setIndex(clamped);
      animating.current = true;
      window.history.replaceState(null, "", `#${clamped + 1}`);
      window.setTimeout(() => {
        animating.current = false;
        setPrevIndex(null);
      }, 680);
    },
    [index, slides.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      // 输入框聚焦时不拦截键盘
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (["ArrowRight", "PageDown"].includes(e.key)) {
        e.preventDefault();
        go(index + 1);
      } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === "Home") {
        go(0);
      } else if (e.key === "End") {
        go(slides.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, slides.length]);

  // 监听 hashchange / popstate：外部导航（如直接改 URL）时同步页码
  useEffect(() => {
    const onHash = () => {
      const m = window.location.hash.match(/#(\d+)/);
      if (!m) return;
      const n = parseInt(m[1], 10) - 1;
      if (Number.isFinite(n)) go(n);
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
    };
  }, [go]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // 互动页允许内部滚动，不做整页滚轮翻页
      const target = e.target as HTMLElement | null;
      if (target && target.closest("[data-scrollable]")) return;
      const now = Date.now();
      if (now - wheelLock.current < 900) return;
      if (Math.abs(e.deltaY) < 24) return;
      wheelLock.current = now;
      go(index + (e.deltaY > 0 ? 1 : -1));
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [go, index]);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest("[data-scrollable],button,input,textarea,[role='button']")) return;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      const dx = touchStartX.current - e.changedTouches[0].clientX;
      const main = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      if (Math.abs(main) > 56) go(index + (main > 0 ? 1 : -1));
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [go, index]);

  const current = slides[index];
  const prev = prevIndex !== null ? slides[prevIndex] : null;
  const isDark = current.dark;

  let activeChapter = 0;
  chapters.forEach((c, i) => {
    if (index >= c.slideIndex) activeChapter = i;
  });

  return (
    <DeckContext.Provider value={{ index, total: slides.length, go }}>
      <div className="slide-viewport select-none">
        {prev && (
          <div
            key={`exit-${prev.id}`}
            className={`slide-page ${direction === 1 ? "slide-exit" : "slide-exit-back"}`}>
            {prev.node}
          </div>
        )}
        <div
          key={`enter-${current.id}`}
          className={`slide-page ${
            prevIndex !== null ? (direction === 1 ? "slide-enter" : "slide-enter-back") : ""
          }`}>
          {current.node}
        </div>

        {/* 左下页码 */}
        <div
          className={`fixed bottom-7 left-8 z-50 font-num text-[11px] tracking-[0.28em] transition-colors duration-500 ${
            isDark ? "text-white/60" : "text-foreground/45"
          }`}>
          {String(index + 1).padStart(2, "0")}
          <span className="mx-1.5 opacity-40">/</span>
          {String(slides.length).padStart(2, "0")}
        </div>

        {/* 底部进度线（秋雨流动隐喻） */}
        <div className="fixed bottom-0 left-0 right-0 z-50 h-[3px]">
          <div
            className="h-full transition-all duration-700"
            style={{
              width: `${((index + 1) / slides.length) * 100}%`,
              background:
                "linear-gradient(to right, oklch(0.68 0.16 45 / 0), oklch(0.68 0.16 45 / 0.85))",
              transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)",
            }}
          />
        </div>

        {/* 右下章节索引 */}
        <div className="fixed bottom-7 right-8 z-50 hidden items-center gap-4 md:flex">
          {chapters.map((c, i) => (
            <button
              key={c.label}
              onClick={() => go(c.slideIndex)}
              className={`group flex items-center gap-1.5 transition-opacity duration-300 ${
                i === activeChapter ? "opacity-100" : "opacity-35 hover:opacity-70"
              }`}>
              <span
                className={`block h-[5px] w-[5px] transition-colors duration-500 ${
                  i === activeChapter
                    ? "bg-[oklch(0.68_0.16_45)]"
                    : isDark
                      ? "bg-white/70"
                      : "bg-foreground/50"
                }`}
              />
              <span
                className={`font-label text-[10px] transition-colors duration-500 ${
                  isDark ? "text-white/70" : "text-foreground/55"
                }`}>
                {c.label}
              </span>
            </button>
          ))}
        </div>

        {/* 翻页按钮 */}
        <div className="fixed right-8 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-2">
          <button
            aria-label="上一页"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className={`flex h-9 w-9 items-center justify-center border transition-all duration-200 active:scale-[0.94] disabled:opacity-20 ${
              isDark
                ? "border-white/25 text-white/70 hover:bg-white/10"
                : "border-foreground/15 text-foreground/60 hover:bg-foreground/5"
            }`}>
            <ChevronLeft className="h-4 w-4 rotate-90" />
          </button>
          <button
            aria-label="下一页"
            onClick={() => go(index + 1)}
            disabled={index === slides.length - 1}
            className={`flex h-9 w-9 items-center justify-center border transition-all duration-200 active:scale-[0.94] disabled:opacity-20 ${
              isDark
                ? "border-white/25 text-white/70 hover:bg-white/10"
                : "border-foreground/15 text-foreground/60 hover:bg-foreground/5"
            }`}>
            <ChevronRight className="h-4 w-4 rotate-90" />
          </button>
        </div>
      </div>
    </DeckContext.Provider>
  );
}
