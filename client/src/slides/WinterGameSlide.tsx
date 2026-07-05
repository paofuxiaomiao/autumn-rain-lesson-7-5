/*
 * 互动游戏二：动植物过冬连线（第4段）
 * 点击左侧动植物 → 点击右侧过冬方式，SVG 画连线
 */
import { useMemo, useRef, useState, type CSSProperties } from "react";
import { PartyPopper, RotateCcw } from "lucide-react";
import { AmbientRain, Eyebrow, SlideShell } from "@/components/SlideKit";
import { WINTER_PAIRS } from "@/lib/lessonData";

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function WinterGameSlide() {
  const [round, setRound] = useState(0);
  const [selAnimal, setSelAnimal] = useState<string | null>(null);
  const [links, setLinks] = useState<Record<string, string>>({}); // animal -> wayShort
  const [wrong, setWrong] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [, forceRender] = useState(0);

  const ways = useMemo(() => shuffle(WINTER_PAIRS, 3 + round), [round]);
  const done = Object.keys(links).length === WINTER_PAIRS.length;

  const pickWay = (wayShort: string) => {
    if (!selAnimal || Object.values(links).includes(wayShort)) return;
    const pair = WINTER_PAIRS.find(p => p.animal === selAnimal);
    if (pair && pair.wayShort === wayShort) {
      setLinks(prev => ({ ...prev, [selAnimal]: wayShort }));
      setSelAnimal(null);
      window.setTimeout(() => forceRender(n => n + 1), 30);
    } else {
      setWrong(wayShort);
      window.setTimeout(() => setWrong(null), 450);
    }
  };

  const reset = () => {
    setLinks({});
    setSelAnimal(null);
    setRound(r => r + 1);
  };

  /** 计算连线坐标 */
  const lines = Object.entries(links)
    .map(([animal, way]) => {
      const c = containerRef.current;
      const l = leftRefs.current[animal];
      const r = rightRefs.current[way];
      if (!c || !l || !r) return null;
      const cb = c.getBoundingClientRect();
      const lb = l.getBoundingClientRect();
      const rb = r.getBoundingClientRect();
      return {
        key: animal,
        x1: lb.right - cb.left,
        y1: lb.top + lb.height / 2 - cb.top,
        x2: rb.left - cb.left,
        y2: rb.top + rb.height / 2 - cb.top,
      };
    })
    .filter(Boolean) as { key: string; x1: number; y1: number; x2: number; y2: number }[];

  return (
    <SlideShell chapterNo="游戏 ②" chapterLabel="过冬连线 · 第四自然段">
      <AmbientRain count={8} />
      <div className="flex h-full flex-col justify-center">
        <Eyebrow delay={60}>INTERACTIVE GAME 02 · 金色的小喇叭</Eyebrow>
        <h2
          className="reveal font-serif-title mt-3 text-[clamp(1.4rem,2.6vw,2.1rem)] leading-[1.4] text-foreground"
          style={{ "--d": 140 } as CSSProperties}>
          小喇叭吹响了——它们是怎么准备过冬的？连一连。
        </h2>

        <div ref={containerRef} className="reveal relative mt-10" style={{ "--d": 260 } as CSSProperties}>
          {/* SVG 连线层 */}
          <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full">
            {lines.map(l => (
              <path
                key={l.key}
                d={`M ${l.x1} ${l.y1} C ${(l.x1 + l.x2) / 2} ${l.y1}, ${(l.x1 + l.x2) / 2} ${l.y2}, ${l.x2} ${l.y2}`}
                fill="none"
                stroke="oklch(0.68 0.16 45 / 0.65)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="1 0"
              />
            ))}
          </svg>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-16">
            {/* 左：动植物 */}
            <div className="space-y-3">
              {WINTER_PAIRS.map(p => {
                const ok = !!links[p.animal];
                return (
                  <button
                    key={p.animal}
                    ref={el => {
                      leftRefs.current[p.animal] = el;
                    }}
                    onClick={() => !ok && setSelAnimal(selAnimal === p.animal ? null : p.animal)}
                    className={`flex w-full items-center gap-3 border px-4 py-3 transition-all duration-200 active:scale-[0.97] ${
                      ok
                        ? "match-pop border-[oklch(0.68_0.16_45_/_0.5)] bg-[oklch(0.68_0.16_45_/_0.07)]"
                        : selAnimal === p.animal
                          ? "border-[oklch(0.68_0.16_45)] bg-[oklch(0.68_0.16_45_/_0.08)] shadow-sm"
                          : "border-foreground/15 bg-card hover:border-foreground/35"
                    }`}>
                    <span className="text-xl">{p.emoji}</span>
                    <span className="font-serif-title text-[15px] text-foreground">{p.animal}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden w-6 md:block" />

            {/* 右：过冬方式 */}
            <div className="space-y-3">
              {ways.map(p => {
                const ok = Object.values(links).includes(p.wayShort);
                return (
                  <button
                    key={p.wayShort}
                    ref={el => {
                      rightRefs.current[p.wayShort] = el;
                    }}
                    onClick={() => pickWay(p.wayShort)}
                    className={`w-full border px-4 py-3 text-left transition-all duration-200 active:scale-[0.97] ${
                      ok
                        ? "match-pop border-[oklch(0.68_0.16_45_/_0.5)] bg-[oklch(0.68_0.16_45_/_0.07)]"
                        : wrong === p.wayShort
                          ? "match-shake border-destructive/60 bg-destructive/5"
                          : "border-foreground/15 bg-card hover:border-foreground/35"
                    }`}>
                    <span className="font-serif-title text-[14px] text-foreground">{p.wayShort}</span>
                    <span className="mt-0.5 block text-[11.5px] font-light text-muted-foreground">{p.way}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 flex min-h-[52px] items-center gap-4">
          {done ? (
            <div className="match-pop flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 border border-[oklch(0.68_0.16_45)] bg-[oklch(0.68_0.16_45_/_0.08)] px-5 py-2.5">
                <PartyPopper className="h-4 w-4 text-[oklch(0.68_0.16_45)]" />
                <span className="font-serif-title text-[14px] text-foreground">
                  全部连对啦！它们都听到小喇叭的话，做好过冬准备了。
                </span>
              </span>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 border border-foreground/15 px-4 py-2.5 text-[13px] text-foreground/70 transition-all duration-200 hover:bg-foreground/5 active:scale-[0.97]">
                <RotateCcw className="h-3.5 w-3.5" /> 再玩一次
              </button>
            </div>
          ) : (
            <p className="text-[12.5px] font-light text-muted-foreground">
              {selAnimal ? `「${selAnimal}」是怎么过冬的？点右边连线。` : "先点左边的动植物朋友。"}
            </p>
          )}
        </div>
      </div>
    </SlideShell>
  );
}

