/*
 * 生字学习页：会认字 + 会写字（田字格），点击生字触发 AI 解释与朗读
 */
import { useState, type CSSProperties } from "react";
import { Loader2, Volume2, X } from "lucide-react";
import { Streamdown } from "streamdown";
import { Eyebrow, SlideShell } from "@/components/SlideKit";
import { RECOGNIZE_CHARS, WRITE_CHARS } from "@/lib/lessonData";
import { trpc } from "@/lib/trpc";

type CharItem = { char: string; pinyin: string; word: string };

function speak(text: string) {
  if (typeof speechSynthesis === "undefined") return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "zh-CN";
  u.rate = 0.8;
  speechSynthesis.speak(u);
}

export default function CharsSlide() {
  const [selected, setSelected] = useState<CharItem | null>(null);
  const [explanation, setExplanation] = useState<string>("");
  const explain = trpc.ai.explainChar.useMutation({
    onSuccess: d => setExplanation(d.explanation),
  });

  const pick = (c: CharItem) => {
    setSelected(c);
    setExplanation("");
    speak(`${c.char}，${c.word}`);
    explain.mutate(c);
  };

  return (
    <SlideShell chapterNo="识字" chapterLabel="会认 · 会写">
      <div className="flex h-full flex-col justify-center" data-scrollable>
        <Eyebrow delay={60}>CHARACTERS · 点一点，雨滴老师讲给你听</Eyebrow>
        <h2
          className="reveal font-serif-title mt-3 text-[clamp(1.4rem,2.6vw,2.1rem)] leading-[1.4] text-foreground"
          style={{ "--d": 140 } as CSSProperties}>
          这一课的生字朋友，都藏在秋雨里。
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr]">
          {/* 会认字 */}
          <div className="reveal" style={{ "--d": 240 } as CSSProperties}>
            <p className="font-label mb-3 text-[10px] text-foreground/45">会认 · 12 字</p>
            <div className="flex flex-wrap gap-2">
              {RECOGNIZE_CHARS.map(c => (
                <button
                  key={c.char + c.pinyin}
                  onClick={() => pick(c)}
                  className={`flex w-[64px] flex-col items-center border py-2 transition-all duration-200 active:scale-[0.94] ${
                    selected?.char === c.char
                      ? "border-[oklch(0.68_0.16_45)] bg-[oklch(0.68_0.16_45_/_0.08)]"
                      : "border-foreground/12 bg-card hover:border-foreground/30"
                  }`}>
                  <span className="font-num text-[10px] text-muted-foreground">{c.pinyin}</span>
                  <span className="font-serif-title text-[26px] leading-tight text-foreground">{c.char}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 会写字（田字格） */}
          <div className="reveal" style={{ "--d": 320 } as CSSProperties}>
            <p className="font-label mb-3 text-[10px] text-foreground/45">会写 · 12 字（田字格）</p>
            <div className="flex flex-wrap gap-2">
              {WRITE_CHARS.map(c => (
                <button
                  key={c.char}
                  onClick={() => pick(c)}
                  className={`group relative flex h-[72px] w-[64px] flex-col items-center border pt-1.5 transition-all duration-200 active:scale-[0.94] ${
                    selected?.char === c.char
                      ? "border-[oklch(0.68_0.16_45)] bg-[oklch(0.68_0.16_45_/_0.06)]"
                      : "border-foreground/20 bg-card hover:border-foreground/40"
                  }`}>
                  <span className="font-num text-[9.5px] text-muted-foreground">{c.pinyin}</span>
                  {/* 田字格虚线 */}
                  <span className="pointer-events-none absolute bottom-0 left-0 right-0 top-[18px]">
                    <span className="absolute left-1/2 top-0 h-full border-l border-dashed border-[oklch(0.62_0.12_30_/_0.3)]" />
                    <span className="absolute left-0 top-1/2 w-full border-t border-dashed border-[oklch(0.62_0.12_30_/_0.3)]" />
                  </span>
                  <span className="font-serif-title relative z-10 mt-0.5 text-[30px] leading-none text-foreground">
                    {c.char}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI 解释面板（侧边小卡片，不遮挡全屏） */}
        {selected && (
          <div className="reveal fixed bottom-20 right-8 z-40 w-[min(360px,86vw)] border border-foreground/15 bg-card p-5 shadow-[0_18px_40px_oklch(0.26_0.03_168_/_0.14)]" style={{ "--d": 0 } as CSSProperties}>
            <div className="flex items-start justify-between">
              <div className="flex items-baseline gap-3">
                <span className="font-serif-title text-[34px] leading-none text-foreground">{selected.char}</span>
                <span className="font-num text-[13px] text-[oklch(0.68_0.16_45)]">{selected.pinyin}</span>
                <span className="text-[13px] text-muted-foreground">{selected.word}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => speak(`${selected.char}，${selected.word}`)}
                  aria-label="朗读"
                  className="flex h-7 w-7 items-center justify-center border border-foreground/12 text-foreground/60 transition-colors hover:bg-foreground/5">
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="关闭"
                  className="flex h-7 w-7 items-center justify-center border border-foreground/12 text-foreground/60 transition-colors hover:bg-foreground/5">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="mt-3 max-h-[32vh] overflow-y-auto text-[13px] font-light leading-relaxed text-foreground/85" data-scrollable>
              {explain.isPending ? (
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> 雨滴老师正在想怎么讲……
                </span>
              ) : explain.isError ? (
                <span className="text-muted-foreground">雨滴老师打了个盹，再点一次这个字试试吧。</span>
              ) : (
                <Streamdown>{explanation}</Streamdown>
              )}
            </div>
          </div>
        )}

        <p className="reveal mt-8 text-[12px] font-light text-muted-foreground" style={{ "--d": 420 } as CSSProperties}>
          点击任意生字：先听读音，再看雨滴老师的讲解和组词。
        </p>
      </div>
    </SlideShell>
  );
}
