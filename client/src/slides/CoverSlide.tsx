/* 封面页：张力页 · 全幅插画 + 超大衬线课题 */
import type { CSSProperties } from "react";
import { AmbientLeaves, AmbientRain } from "@/components/SlideKit";
import { ART } from "@/lib/assets";
import { useDeck } from "@/components/Deck";

export default function CoverSlide() {
  const { go } = useDeck();
  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
      {/* 全幅插画背景 */}
      <div className="absolute inset-0">
        <img src={ART.cover} alt="秋天的雨插画" className="kenburns h-full w-full object-cover" />
        {/* 顶部提亮遮罩，保证文字可读 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.983 0.003 106 / 0.88) 0%, oklch(0.983 0.003 106 / 0.45) 38%, transparent 68%)",
          }}
        />
      </div>
      <AmbientRain count={16} />
      <AmbientLeaves count={9} />

      <div className="stage-pad relative z-20 flex h-full flex-col">
        {/* 页眉 */}
        <div className="reveal flex items-center gap-3" style={{ "--d": 0 } as CSSProperties}>
          <span className="brand-dot" />
          <span className="font-label text-[11px] text-foreground/60">统编版语文 · 三年级上册 · 第六课</span>
        </div>

        {/* 课题 */}
        <div className="mt-[9vh]">
          <div
            className="reveal font-num text-[clamp(3.6rem,8vw,6.5rem)] font-light leading-none text-foreground/15"
            style={{ "--d": 80 } as CSSProperties}>
            06
          </div>
          <h1
            className="reveal font-display mt-2 text-[clamp(3rem,7.5vw,5.8rem)] leading-[1.12] tracking-[0.06em] text-foreground"
            style={{ "--d": 200 } as CSSProperties}>
            秋天的雨
          </h1>
          <p
            className="reveal font-body-light mt-5 max-w-md text-[clamp(0.95rem,1.4vw,1.15rem)] leading-relaxed text-foreground/65"
            style={{ "--d": 320 } as CSSProperties}>
            作者 陶金鸿 · 选作课文时有改动
          </p>
          <p
            className="reveal font-serif-title mt-8 max-w-lg text-[clamp(1rem,1.6vw,1.3rem)] leading-[2] text-foreground/80"
            style={{ "--d": 440 } as CSSProperties}>
            它带着清凉和温柔，轻轻地，轻轻地，
            <br />
            趁你没留意，把秋天的大门打开了。
          </p>
        </div>

        {/* 开始按钮 */}
        <div className="reveal mt-auto pb-10" style={{ "--d": 560 } as CSSProperties}>
          <button
            onClick={() => go(1)}
            className="group inline-flex items-center gap-3 border border-foreground/25 bg-background/70 px-7 py-3 backdrop-blur-sm transition-all duration-200 hover:border-[oklch(0.68_0.16_45)] hover:bg-background/90 active:scale-[0.97]">
            <span className="font-serif-title text-[15px] tracking-[0.2em] text-foreground">推开秋天的大门</span>
            <span className="text-[oklch(0.68_0.16_45)] transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
          <p className="mt-4 font-label text-[10px] text-foreground/40">
            方向键 · 滚轮 · 点按均可翻页
          </p>
        </div>
      </div>
    </div>
  );
}
