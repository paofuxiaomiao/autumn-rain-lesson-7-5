/*
 * 互动游戏一：颜色配对（第2段）
 * 点击颜色 → 点击植物完成配对；答对 match-pop，答错 match-shake
 */
import { useMemo, useState, type CSSProperties } from "react";
import { PartyPopper, RotateCcw } from "lucide-react";
import { AmbientLeaves, Eyebrow, SlideShell } from "@/components/SlideKit";
import { COLOR_PAIRS } from "@/lib/lessonData";

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

export default function ColorGameSlide() {
  const [round, setRound] = useState(0);
  const [selColor, setSelColor] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [justMatched, setJustMatched] = useState<string | null>(null);

  const plants = useMemo(() => shuffle(COLOR_PAIRS, 7 + round), [round]);
  const done = matched.size === COLOR_PAIRS.length;

  const pickPlant = (plant: string) => {
    if (!selColor || matched.has(plant)) return;
    const pair = COLOR_PAIRS.find(p => p.color === selColor);
    if (pair && pair.plant === plant) {
      const next = new Set(matched);
      next.add(plant);
      setMatched(next);
      setJustMatched(plant);
      setSelColor(null);
      window.setTimeout(() => setJustMatched(null), 600);
    } else {
      setWrong(plant);
      window.setTimeout(() => setWrong(null), 450);
    }
  };

  const reset = () => {
    setMatched(new Set());
    setSelColor(null);
    setRound(r => r + 1);
  };

  return (
    <SlideShell chapterNo="游戏 ①" chapterLabel="颜色配对 · 第二自然段">
      <AmbientLeaves count={6} />
      <div className="flex h-full flex-col justify-center">
        <Eyebrow delay={60}>INTERACTIVE GAME 01 · 五彩缤纷</Eyebrow>
        <h2
          className="reveal font-serif-title mt-3 text-[clamp(1.4rem,2.6vw,2.1rem)] leading-[1.4] text-foreground"
          style={{ "--d": 140 } as CSSProperties}>
          秋雨把颜色分给了谁？先点颜色，再点它的主人。
        </h2>

        <div className="mt-9 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* 颜色列 */}
          <div className="reveal space-y-3" style={{ "--d": 260 } as CSSProperties}>
            <p className="font-label text-[10px] text-foreground/45">COLORS · 颜料盒</p>
            <div className="flex flex-wrap gap-3">
              {COLOR_PAIRS.map(p => {
                const used = matched.has(p.plant);
                return (
                  <button
                    key={p.color}
                    disabled={used}
                    onClick={() => setSelColor(selColor === p.color ? null : p.color)}
                    className={`inline-flex items-center gap-2.5 border px-4 py-2.5 transition-all duration-200 active:scale-[0.96] ${
                      used
                        ? "border-foreground/8 opacity-30"
                        : selColor === p.color
                          ? "border-[oklch(0.68_0.16_45)] bg-[oklch(0.68_0.16_45_/_0.08)] shadow-sm"
                          : "border-foreground/15 hover:border-foreground/35"
                    }`}>
                    <span
                      className="h-4 w-4 rounded-full"
                      style={{ background: p.colorCss, boxShadow: `0 0 0 3px ${p.colorCss.replace(")", " / 0.25)")}` }}
                    />
                    <span className="font-serif-title text-[14px]">{p.color}</span>
                  </button>
                );
              })}
            </div>
            <p className="pt-2 text-[12.5px] font-light text-muted-foreground">
              {selColor ? `「${selColor}」要送给谁呢？点右边找找看。` : "从颜料盒里挑一种颜色吧。"}
            </p>
          </div>

          {/* 植物列 */}
          <div className="reveal space-y-3" style={{ "--d": 340 } as CSSProperties}>
            <p className="font-label text-[10px] text-foreground/45">FRIENDS · 秋天的朋友</p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {plants.map(p => {
                const ok = matched.has(p.plant);
                return (
                  <button
                    key={p.plant}
                    onClick={() => pickPlant(p.plant)}
                    className={`border px-4 py-3 text-left transition-all duration-200 active:scale-[0.97] ${
                      ok
                        ? "match-pop border-transparent text-white"
                        : wrong === p.plant
                          ? "match-shake border-destructive/60 bg-destructive/5"
                          : "border-foreground/15 bg-card hover:border-foreground/35"
                    }`}
                    style={ok ? { background: p.colorCss } : undefined}>
                    <span className={`font-serif-title text-[15px] ${ok ? "" : "text-foreground"}`}>{p.plant}</span>
                    <span className={`mt-0.5 block text-[11.5px] font-light leading-snug ${ok ? "text-white/85" : "text-muted-foreground"}`}>
                      {ok ? p.hint : justMatched === p.plant ? p.hint : "…"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 完成反馈 */}
        <div className="mt-8 flex min-h-[52px] items-center gap-4">
          {done ? (
            <div className="match-pop flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 border border-[oklch(0.68_0.16_45)] bg-[oklch(0.68_0.16_45_/_0.08)] px-5 py-2.5">
                <PartyPopper className="h-4 w-4 text-[oklch(0.68_0.16_45)]" />
                <span className="font-serif-title text-[14px] text-foreground">
                  太棒了！五种颜色都送到啦——这就是「五彩缤纷」。
                </span>
              </span>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 border border-foreground/15 px-4 py-2.5 text-[13px] text-foreground/70 transition-all duration-200 hover:bg-foreground/5 active:scale-[0.97]">
                <RotateCcw className="h-3.5 w-3.5" /> 再玩一次
              </button>
            </div>
          ) : (
            <p className="font-num text-[12px] tracking-[0.2em] text-foreground/40">
              {matched.size} / {COLOR_PAIRS.length} 已配对
            </p>
          )}
        </div>
      </div>
    </SlideShell>
  );
}
