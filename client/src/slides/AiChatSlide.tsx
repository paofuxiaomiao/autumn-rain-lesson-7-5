/*
 * AI 互动问答页：向「雨滴老师」提问课文内容、词语、修辞
 */
import { useRef, useState, type CSSProperties } from "react";
import { CloudRain, Loader2, Send } from "lucide-react";
import { Streamdown } from "streamdown";
import { AmbientRain, Eyebrow, SlideShell } from "@/components/SlideKit";
import { trpc } from "@/lib/trpc";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "「五彩缤纷」是什么意思？",
  "为什么说秋天的雨是一把钥匙？",
  "「频频点头」的菊花是什么样子的？",
  "课文里有哪些比喻句？",
  "为什么香味会「勾住」小朋友的脚？",
];

export default function AiChatSlide() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const ask = trpc.ai.ask.useMutation({
    onSuccess: d => {
      setMessages(prev => [...prev, { role: "assistant", content: d.answer }]);
      window.setTimeout(() => listRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 60);
    },
    onError: () =>
      setMessages(prev => [...prev, { role: "assistant", content: "哎呀，雨下得太大，老师没听清。再问一次好吗？" }]),
  });

  const send = (q?: string) => {
    const question = (q ?? input).trim();
    if (!question || ask.isPending) return;
    const history = messages.slice(-8);
    setMessages(prev => [...prev, { role: "user", content: question }]);
    setInput("");
    ask.mutate({ question, history });
    window.setTimeout(() => listRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 60);
  };

  return (
    <SlideShell chapterNo="AI" chapterLabel="问问雨滴老师">
      <AmbientRain count={10} />
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col justify-center">
        <Eyebrow delay={60}>ASK THE RAIN TEACHER · 自由提问</Eyebrow>
        <h2
          className="reveal font-serif-title mt-3 text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.4] text-foreground"
          style={{ "--d": 140 } as CSSProperties}>
          读不懂的地方，问问雨滴老师。
        </h2>

        {/* 对话区 */}
        <div
          ref={listRef}
          data-scrollable
          className="reveal mt-6 flex h-[38vh] flex-col gap-3 overflow-y-auto border border-foreground/10 bg-card/60 p-4 backdrop-blur-[2px]"
          style={{ "--d": 260 } as CSSProperties}>
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <CloudRain className="h-8 w-8 text-[oklch(0.68_0.16_45_/_0.6)]" />
              <p className="max-w-sm text-[13px] font-light leading-relaxed text-muted-foreground">
                我是雨滴老师。课文里的词语、比喻、你心里的小问号，都可以问我。
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[82%] px-4 py-2.5 text-[13.5px] leading-relaxed ${
                  m.role === "user"
                    ? "bg-foreground text-background"
                    : "border border-foreground/10 bg-background text-foreground/90"
                }`}>
                {m.role === "assistant" ? <Streamdown>{m.content}</Streamdown> : m.content}
              </div>
            </div>
          ))}
          {ask.isPending && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 border border-foreground/10 bg-background px-4 py-2.5 text-[13px] text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> 雨滴老师正在想……
              </div>
            </div>
          )}
        </div>

        {/* 快捷问题 */}
        <div className="reveal mt-3 flex flex-wrap gap-2" style={{ "--d": 340 } as CSSProperties}>
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={ask.isPending}
              className="border border-foreground/12 px-3 py-1.5 text-[12px] text-foreground/65 transition-all duration-200 hover:border-[oklch(0.68_0.16_45)] hover:text-foreground active:scale-[0.96] disabled:opacity-40">
              {s}
            </button>
          ))}
        </div>

        {/* 输入区 */}
        <div className="reveal mt-3 flex gap-2" style={{ "--d": 420 } as CSSProperties}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="把你的问题打在这里……"
            className="flex-1 border border-foreground/15 bg-card px-4 py-2.5 text-[14px] text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-[oklch(0.68_0.16_45)]"
          />
          <button
            onClick={() => send()}
            disabled={ask.isPending || !input.trim()}
            aria-label="发送"
            className="inline-flex items-center gap-2 border border-foreground/20 bg-foreground px-5 py-2.5 text-background transition-all duration-200 hover:opacity-90 active:scale-[0.97] disabled:opacity-30">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </SlideShell>
  );
}

