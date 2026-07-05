/*
 * 第2段精读页：五彩缤纷的颜料
 * - 逐句高亮跟读（Web Speech API 朗读 + 自动逐句推进）
 * - 背诵模式：句子挖空渐隐，辅助背诵
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { BookOpenText, Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { AmbientLeaves, AmbientRain, Eyebrow, SlideShell } from "@/components/SlideKit";
import { ART } from "@/lib/assets";
import { PARA2_SENTENCES } from "@/lib/lessonData";

export default function Para2Slide() {
  const [active, setActive] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [reciteMode, setReciteMode] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const speakRef = useRef<SpeechSynthesisUtterance | null>(null);
  const playingRef = useRef(false);

  const stop = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
  }, []);

  const speakSentence = useCallback(
    (i: number) => {
      if (i >= PARA2_SENTENCES.length) {
        stop();
        setActive(-1);
        return;
      }
      setActive(i);
      if (typeof speechSynthesis === "undefined") return;
      const u = new SpeechSynthesisUtterance(PARA2_SENTENCES[i]);
      u.lang = "zh-CN";
      u.rate = 0.82;
      u.pitch = 1.05;
      u.onend = () => {
        if (playingRef.current) {
          window.setTimeout(() => {
            if (playingRef.current) speakSentence(i + 1);
          }, 650);
        }
      };
      speakRef.current = u;
      speechSynthesis.speak(u);
    },
    [stop],
  );

  const start = useCallback(
    (from: number) => {
      if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
      playingRef.current = true;
      setPlaying(true);
      speakSentence(from);
    },
    [speakSentence],
  );

  useEffect(() => () => stop(), [stop]);

  const toggleRecite = () => {
    stop();
    setActive(-1);
    setRevealed(new Set());
    setReciteMode(v => !v);
  };

  return (
    <SlideShell chapterNo="02" chapterLabel="第二自然段 · 跟读与背诵">
      <AmbientLeaves count={7} />
      <AmbientRain count={6} />
      <div className="grid h-full grid-cols-1 items-center gap-8 md:grid-cols-[8fr_4fr]">
        <div className="max-w-3xl" data-scrollable>
          <Eyebrow delay={60}>PARAGRAPH 02 · 颜料 · 课后要求背诵</Eyebrow>
          <h2
            className="reveal font-serif-title mt-3 text-[clamp(1.4rem,2.5vw,2rem)] leading-[1.4] text-foreground"
            style={{ "--d": 140 } as CSSProperties}>
            秋雨有一盒五彩缤纷的颜料——跟着雨滴，一句一句读。
          </h2>

          {/* 逐句文本 */}
          <div
            className="reveal mt-6 max-h-[46vh] space-y-2.5 overflow-y-auto pr-2"
            style={{ "--d": 260 } as CSSProperties}
            data-scrollable>
            {PARA2_SENTENCES.map((s, i) => {
              const hidden = reciteMode && !revealed.has(i);
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (reciteMode) {
                      setRevealed(prev => {
                        const next = new Set(prev);
                        if (next.has(i)) next.delete(i);
                        else next.add(i);
                        return next;
                      });
                    } else {
                      start(i);
                    }
                  }}
                  className={`block w-full text-left transition-all duration-300 ${
                    active === i ? "translate-x-1" : ""
                  }`}>
                  <span
                    className={`font-lesson text-[clamp(0.95rem,1.35vw,1.12rem)] ${
                      active === i ? "sentence-active text-foreground" : "text-foreground/78"
                    } ${hidden ? "select-none rounded bg-stone text-transparent transition-colors hover:bg-stone/70" : ""}`}>
                    {s}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 控制条 */}
          <div className="reveal mt-6 flex flex-wrap items-center gap-3" style={{ "--d": 380 } as CSSProperties}>
            {!reciteMode && (
              <>
                <button
                  onClick={() => (playing ? stop() : start(active >= 0 ? active : 0))}
                  className="inline-flex items-center gap-2 border border-foreground/20 bg-background px-5 py-2.5 transition-all duration-200 hover:border-[oklch(0.68_0.16_45)] active:scale-[0.97]">
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span className="font-serif-title text-[13.5px] tracking-[0.12em]">
                    {playing ? "暂停跟读" : "开始跟读"}
                  </span>
                </button>
                <button
                  onClick={() => {
                    if (playing) {
                      stop();
                      window.setTimeout(() => start(Math.min(active + 1, PARA2_SENTENCES.length - 1)), 80);
                    } else {
                      setActive(a => Math.min(a + 1, PARA2_SENTENCES.length - 1));
                    }
                  }}
                  className="inline-flex items-center gap-2 border border-foreground/15 px-4 py-2.5 text-foreground/70 transition-all duration-200 hover:bg-foreground/5 active:scale-[0.97]">
                  <SkipForward className="h-4 w-4" />
                  <span className="text-[13px]">下一句</span>
                </button>
              </>
            )}
            {reciteMode && (
              <button
                onClick={() => setRevealed(new Set())}
                className="inline-flex items-center gap-2 border border-foreground/15 px-4 py-2.5 text-foreground/70 transition-all duration-200 hover:bg-foreground/5 active:scale-[0.97]">
                <RotateCcw className="h-4 w-4" />
                <span className="text-[13px]">重新遮住</span>
              </button>
            )}
            <button
              onClick={toggleRecite}
              className={`inline-flex items-center gap-2 border px-5 py-2.5 transition-all duration-200 active:scale-[0.97] ${
                reciteMode
                  ? "border-[oklch(0.68_0.16_45)] bg-[oklch(0.68_0.16_45)] text-white"
                  : "border-foreground/20 text-foreground hover:border-[oklch(0.68_0.16_45)]"
              }`}>
              <BookOpenText className="h-4 w-4" />
              <span className="font-serif-title text-[13.5px] tracking-[0.12em]">
                {reciteMode ? "退出背诵挑战" : "背诵挑战"}
              </span>
            </button>
          </div>
          <p className="reveal mt-3 text-[12px] font-light text-muted-foreground" style={{ "--d": 460 } as CSSProperties}>
            {reciteMode
              ? "句子被雨雾遮住了：先试着背出来，再点一下句子核对。"
              : "点击任意句子从该句开始朗读；跟着高亮，读出秋雨的温柔。"}
          </p>
        </div>

        {/* 右侧插画 */}
        <div className="reveal relative hidden md:block" style={{ "--d": 320 } as CSSProperties}>
          <img
            src={ART.palette}
            alt="五彩缤纷的颜料插画"
            className="float-soft mx-auto max-h-[50vh] w-full max-w-sm object-contain drop-shadow-[0_18px_36px_oklch(0.26_0.03_168_/_0.12)]"
          />
        </div>
      </div>
    </SlideShell>
  );
}
