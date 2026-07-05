/*
 * 《秋天的雨》· 幻灯片通用组件库
 * SlideShell：信息页外壳（等高线纹理 + 页眉）
 * Eyebrow / ActionTitle：标签与衬线结论标题
 * AmbientLeaves / AmbientRain：秋雨氛围层
 */
import type { CSSProperties, ReactNode } from "react";
import { useMemo } from "react";

/** 信息页外壳 */
export function SlideShell({
  children,
  chapterNo,
  chapterLabel,
  className = "",
}: {
  children: ReactNode;
  chapterNo?: string;
  chapterLabel?: string;
  className?: string;
}) {
  return (
    <div className={`contour-bg relative h-full w-full overflow-hidden bg-background ${className}`}>
      <header
        className="reveal absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-8 pt-7 md:px-14"
        style={{ "--d": 0 } as CSSProperties}>
        <div className="flex items-center gap-3">
          <span className="font-serif-title text-[15px] tracking-[0.3em] text-foreground/80">秋天的雨</span>
          <span className="hairline hidden w-10 md:block" />
          <span className="font-label hidden text-[10px] text-foreground/45 md:block">
            统编版三年级上册 · 第6课
          </span>
        </div>
        {chapterNo && (
          <div className="flex items-center gap-2.5">
            <span className="font-num text-[11px] tracking-[0.2em] text-[oklch(0.68_0.16_45)]">
              {chapterNo}
            </span>
            <span className="font-label text-[10px] text-foreground/50">{chapterLabel}</span>
          </div>
        )}
      </header>
      <div className="stage-pad flex h-full w-full flex-col justify-center pt-16">{children}</div>
    </div>
  );
}

/** 小节标签（柿橙粒子 + 大写字距标签） */
export function Eyebrow({
  children,
  delay = 60,
  light = false,
}: {
  children: ReactNode;
  delay?: number;
  light?: boolean;
}) {
  return (
    <div className="reveal flex items-center gap-2.5" style={{ "--d": delay } as CSSProperties}>
      <span className="brand-dot" />
      <span className={`font-label text-[11px] ${light ? "text-white/70" : "text-foreground/55"}`}>
        {children}
      </span>
    </div>
  );
}

/** 衬线结论标题 */
export function ActionTitle({
  children,
  delay = 140,
  light = false,
  size = "lg",
}: {
  children: ReactNode;
  delay?: number;
  light?: boolean;
  size?: "lg" | "md";
}) {
  return (
    <h2
      className={`reveal font-serif-title mt-4 leading-[1.3] tracking-[0.01em] ${
        size === "lg" ? "text-[clamp(1.7rem,3.4vw,2.7rem)]" : "text-[clamp(1.4rem,2.6vw,2.1rem)]"
      } ${light ? "text-white" : "text-foreground"}`}
      style={{ "--d": delay } as CSSProperties}>
      {children}
    </h2>
  );
}

/* ---------- 秋雨氛围层 ---------- */

const LEAF_COLORS = [
  "oklch(0.83 0.14 90)", // 银杏黄
  "oklch(0.62 0.17 35)", // 枫红
  "oklch(0.72 0.15 60)", // 橙
  "oklch(0.78 0.12 100)", // 淡黄绿
];

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** 飘落的银杏/枫叶（纯 SVG，插画平面风） */
export function AmbientLeaves({ count = 8, opacity = 0.85 }: { count?: number; opacity?: number }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: seeded(i, 1) * 96,
        dur: 11 + seeded(i, 2) * 10,
        delay: -seeded(i, 3) * 20,
        size: 14 + seeded(i, 4) * 16,
        drift: 2 + seeded(i, 5) * 5,
        color: LEAF_COLORS[i % LEAF_COLORS.length],
        kind: i % 2,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden>
      {leaves.map((l, i) => (
        <span
          key={i}
          className="leaf-fall absolute top-0"
          style={
            {
              left: `${l.left}%`,
              "--leaf-dur": `${l.dur}s`,
              "--leaf-delay": `${l.delay}s`,
              "--leaf-drift": `${l.drift}vw`,
              "--leaf-opacity": opacity,
            } as CSSProperties
          }>
          {l.kind === 0 ? (
            /* 银杏叶 */
            <svg width={l.size} height={l.size} viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21c-.4-3.2-.7-5.2-2-7C7 10 4 9.6 3 10.4c2.8-6 7.4-7.6 9-7.4 1.6-.2 6.2 1.4 9 7.4-1-.8-4 -.4-7 3.6-1.3 1.8-1.6 3.8-2 7z"
                fill={l.color}
              />
              <path d="M12 21c-.2-3.4-.4-5.6 0-8.5" stroke="oklch(0.55 0.1 70)" strokeWidth="1" strokeLinecap="round" />
            </svg>
          ) : (
            /* 枫叶（简化五角） */
            <svg width={l.size} height={l.size} viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l1.8 4.5L18 4.6l-1.2 4.3 4.7 1.2-3.6 3 2.4 4-4.6-.7-.6 5.6h-2.2l-.6-5.6-4.6.7 2.4-4-3.6-3 4.7-1.2L6 4.6l4.2 1.9L12 2z"
                fill={l.color}
              />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}

/** 细雨氛围 */
export function AmbientRain({ count = 14, dark = false }: { count?: number; dark?: boolean }) {
  const drops = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: seeded(i, 7) * 100,
        dur: 2.2 + seeded(i, 8) * 2.2,
        delay: -seeded(i, 9) * 5,
        h: 26 + seeded(i, 10) * 30,
        op: 0.16 + seeded(i, 11) * 0.22,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden>
      {drops.map((d, i) => (
        <span
          key={i}
          className="rain-drop absolute top-0 w-[1.5px] rounded-full"
          style={
            {
              left: `${d.left}%`,
              height: `${d.h}px`,
              background: dark
                ? `linear-gradient(to bottom, transparent, oklch(0.9 0.02 220 / ${d.op}))`
                : `linear-gradient(to bottom, transparent, oklch(0.6 0.05 220 / ${d.op}))`,
              "--rain-dur": `${d.dur}s`,
              "--rain-delay": `${d.delay}s`,
              "--rain-opacity": d.op,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
