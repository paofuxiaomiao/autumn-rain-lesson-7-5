/*
 * 课后习题页：完整呈现三道课后习题
 * 习题1：朗读背诵提示（链接回第2段跟读页）
 * 习题2：课文结构梳理（五个方面选择填空）
 * 习题3：仿写练习 + AI 点评
 */
import { useState, type CSSProperties } from "react";
import { BookOpenText, CheckCircle2, Loader2, PenLine, Send } from "lucide-react";
import { Streamdown } from "streamdown";
import { useDeck } from "@/components/Deck";
import { Eyebrow, SlideShell } from "@/components/SlideKit";
import { IMITATION_EXAMPLE, STRUCTURE_ITEMS } from "@/lib/lessonData";
import { trpc } from "@/lib/trpc";

function StructureQuiz() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const allDone = STRUCTURE_ITEMS.every(it => answers[it.no] === it.answer);
  return (
    <div className="space-y-2.5">
      {STRUCTURE_ITEMS.map(it => {
        const chosen = answers[it.no];
        return (
          <div key={it.no} className="flex flex-wrap items-center gap-2.5">
            <span className="font-num w-5 text-[11px] text-foreground/40">{it.no}</span>
            <span className="text-[13.5px] text-foreground/80">
              {it.sentence.split("＿＿")[0]}
              <span
                className={`mx-1 inline-block min-w-[56px] border-b text-center font-serif-title ${
                  chosen === it.answer
                    ? "border-transparent text-[oklch(0.68_0.16_45)]"
                    : "border-foreground/30 text-foreground/40"
                }`}>
                {chosen === it.answer ? it.answer : "？"}
              </span>
              {it.sentence.split("＿＿")[1]}
            </span>
            <span className="flex gap-1.5">
              {it.options.map(op => {
                const isRight = chosen === it.answer && op === it.answer;
                const isWrong = chosen === op && op !== it.answer;
                return (
                  <button
                    key={op}
                    onClick={() => setAnswers(a => ({ ...a, [it.no]: op }))}
                    className={`border px-2.5 py-1 text-[12px] transition-all duration-200 active:scale-[0.95] ${
                      isRight
                        ? "match-pop border-[oklch(0.68_0.16_45)] bg-[oklch(0.68_0.16_45)] text-white"
                        : isWrong
                          ? "match-shake border-destructive/50 text-destructive"
                          : "border-foreground/15 text-foreground/70 hover:border-foreground/35"
                    }`}>
                    {op}
                  </button>
                );
              })}
            </span>
          </div>
        );
      })}
      {allDone && (
        <p className="match-pop inline-flex items-center gap-2 pt-1 text-[13px] text-[oklch(0.68_0.16_45)]">
          <CheckCircle2 className="h-4 w-4" />
          五个方面都找对了：钥匙 → 颜料 → 气味 → 小喇叭 → 歌。和同学说说你最喜欢哪部分吧！
        </p>
      )}
    </div>
  );
}

function ImitationPractice() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");
  const review = trpc.ai.reviewImitation.useMutation({ onSuccess: d => setFeedback(d.feedback) });
  return (
    <div>
      <blockquote className="border-l-2 border-[oklch(0.68_0.16_45_/_0.5)] pl-3 text-[12.5px] font-light leading-relaxed text-muted-foreground">
        例：{IMITATION_EXAMPLE}
      </blockquote>
      <div className="mt-3 flex flex-col gap-2.5">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="它把___色给了___，___像___，___……"
          rows={3}
          className="w-full resize-none border border-foreground/15 bg-card p-3 text-[13.5px] leading-relaxed text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-[oklch(0.68_0.16_45)]"
        />
        <div>
          <button
            onClick={() => text.trim().length >= 4 && review.mutate({ sentence: text.trim() })}
            disabled={review.isPending || text.trim().length < 4}
            className="inline-flex items-center gap-2 border border-foreground/20 bg-foreground px-5 py-2 text-[13px] text-background transition-all duration-200 hover:opacity-90 active:scale-[0.97] disabled:opacity-30">
            {review.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            请雨滴老师点评
          </button>
        </div>
        {(feedback || review.isError) && (
          <div className="border border-[oklch(0.68_0.16_45_/_0.35)] bg-[oklch(0.68_0.16_45_/_0.05)] p-3.5 text-[13px] font-light leading-relaxed text-foreground/85">
            {review.isError ? (
              "雨滴老师没接住你的句子，再发一次好吗？"
            ) : (
              <Streamdown>{feedback}</Streamdown>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExerciseSlide() {
  const { go } = useDeck();
  const [tab, setTab] = useState<1 | 2 | 3>(1);
  return (
    <SlideShell chapterNo="习题" chapterLabel="课后练习 · 三题">
      <div className="flex h-full flex-col justify-center" data-scrollable>
        <Eyebrow delay={60}>EXERCISES · 课后习题（教材原题）</Eyebrow>
        <h2
          className="reveal font-serif-title mt-3 text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.4] text-foreground"
          style={{ "--d": 140 } as CSSProperties}>
          学完了课文，来完成三道课后习题。
        </h2>

        {/* 题目切换 */}
        <div className="reveal mt-6 flex gap-2" style={{ "--d": 240 } as CSSProperties}>
          {([
            [1, "一 · 朗读背诵"],
            [2, "二 · 结构梳理"],
            [3, "三 · 照样子写一写"],
          ] as const).map(([n, label]) => (
            <button
              key={n}
              onClick={() => setTab(n)}
              className={`border px-4 py-2 font-serif-title text-[13px] tracking-[0.08em] transition-all duration-200 active:scale-[0.97] ${
                tab === n
                  ? "border-[oklch(0.68_0.16_45)] bg-[oklch(0.68_0.16_45)] text-white"
                  : "border-foreground/15 text-foreground/65 hover:border-foreground/35"
              }`}>
              {label}
            </button>
          ))}
        </div>

        <div className="reveal mt-6 max-h-[46vh] overflow-y-auto pr-1" style={{ "--d": 320 } as CSSProperties} data-scrollable>
          {tab === 1 && (
            <div className="max-w-2xl">
              <p className="font-lesson text-[15px] text-foreground/85">
                有感情地朗读课文。背诵第2自然段。
              </p>
              <p className="mt-3 text-[13px] font-light leading-relaxed text-muted-foreground">
                朗读小贴士：读第1段时声音轻轻的、柔柔的，像秋雨落下来；读第2段时想象颜色在眼前铺开；
                读「扇哪扇哪」「飘哇飘哇」时可以放慢，读出叶子飞舞的样子。
              </p>
              <button
                onClick={() => go(2)}
                className="mt-5 inline-flex items-center gap-2 border border-foreground/20 px-5 py-2.5 transition-all duration-200 hover:border-[oklch(0.68_0.16_45)] active:scale-[0.97]">
                <BookOpenText className="h-4 w-4 text-[oklch(0.68_0.16_45)]" />
                <span className="font-serif-title text-[13.5px]">回到第2段 · 跟读与背诵挑战</span>
              </button>
            </div>
          )}
          {tab === 2 && (
            <div className="max-w-3xl">
              <p className="font-lesson mb-4 text-[15px] text-foreground/85">
                课文从哪几个方面写了秋天？和同学交流你感兴趣的内容。
              </p>
              <StructureQuiz />
            </div>
          )}
          {tab === 3 && (
            <div className="max-w-3xl">
              <p className="font-lesson mb-1 flex items-center gap-2 text-[15px] text-foreground/85">
                <PenLine className="h-4 w-4 text-[oklch(0.68_0.16_45)]" />
                想象一下：秋天的雨还会把颜色分给谁呢？照样子写一写。
              </p>
              <div className="mt-3">
                <ImitationPractice />
              </div>
            </div>
          )}
        </div>
      </div>
    </SlideShell>
  );
}
