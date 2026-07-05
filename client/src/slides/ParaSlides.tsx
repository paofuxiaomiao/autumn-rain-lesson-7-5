/* 五个自然段精读页（第2段单独在 Para2Slide.tsx 实现跟读） */
import type { CSSProperties, ReactNode } from "react";
import { AmbientLeaves, AmbientRain, Eyebrow, SlideShell } from "@/components/SlideKit";
import { ART } from "@/lib/assets";
import { PARAGRAPHS } from "@/lib/lessonData";

/** 通用精读页：左文右图，非对称布局 */
function ParaLayout({
  para,
  image,
  imageAlt,
  accent,
  children,
}: {
  para: (typeof PARAGRAPHS)[number];
  image: string;
  imageAlt: string;
  accent?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <SlideShell chapterNo={`0${para.no}`} chapterLabel={`第${"一二三四五"[para.no - 1]}自然段`}>
      <AmbientRain count={8} />
      <div className="grid h-full grid-cols-1 items-center gap-10 md:grid-cols-[7fr_5fr]">
        {/* 左：课文与解读 */}
        <div className="max-w-2xl">
          <Eyebrow delay={60}>PARAGRAPH 0{para.no} · {para.keyword}</Eyebrow>
          <h2
            className="reveal font-serif-title mt-4 text-[clamp(1.5rem,2.8vw,2.3rem)] leading-[1.4] text-foreground"
            style={{ "--d": 140 } as CSSProperties}>
            {para.theme}
          </h2>
          <p
            className="reveal font-lesson mt-7 text-[clamp(1rem,1.55vw,1.25rem)] text-foreground/85"
            style={{ "--d": 260 } as CSSProperties}>
            {para.text}
          </p>
          <div className="reveal mt-8 flex items-start gap-3" style={{ "--d": 380 } as CSSProperties}>
            <span className="brand-dot mt-2" />
            <p className="max-w-lg text-[13.5px] font-light leading-relaxed text-muted-foreground">
              {para.device}
            </p>
          </div>
          {children}
        </div>
        {/* 右：插画 */}
        <div className="reveal relative hidden md:block" style={{ "--d": 300 } as CSSProperties}>
          <div className="float-soft">
            <img
              src={image}
              alt={imageAlt}
              className="mx-auto max-h-[52vh] w-full max-w-md object-contain drop-shadow-[0_18px_36px_oklch(0.26_0.03_168_/_0.12)]"
            />
          </div>
          {accent}
        </div>
      </div>
    </SlideShell>
  );
}

export function Para1Slide() {
  return (
    <>
      <ParaLayout para={PARAGRAPHS[0]} image={ART.keyDoor} imageAlt="钥匙与秋天的大门插画" />
    </>
  );
}

export function Para3Slide() {
  return <ParaLayout para={PARAGRAPHS[2]} image={ART.fruits} imageAlt="藏在雨滴里的水果香气插画" />;
}

export function Para4Slide() {
  return <ParaLayout para={PARAGRAPHS[3]} image={ART.winterPrep} imageAlt="动植物准备过冬插画" />;
}

export function Para5Slide() {
  const para = PARAGRAPHS[4];
  return (
    <SlideShell chapterNo="05" chapterLabel="第五自然段 · 总结">
      <AmbientLeaves count={10} />
      <AmbientRain count={8} />
      <div className="flex h-full flex-col items-center justify-center text-center">
        <Eyebrow delay={60}>PARAGRAPH 05 · {para.keyword}</Eyebrow>
        <div className="reveal mt-8" style={{ "--d": 180 } as CSSProperties}>
          <img
            src={ART.harvestSong}
            alt="丰收与欢乐之歌插画"
            className="float-soft mx-auto h-[30vh] w-auto object-contain drop-shadow-[0_18px_36px_oklch(0.26_0.03_168_/_0.12)]"
          />
        </div>
        <p
          className="reveal font-display mt-9 max-w-3xl text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.7] text-foreground"
          style={{ "--d": 320 } as CSSProperties}>
          秋天的雨，带给大地的是一曲<span className="text-[oklch(0.68_0.16_45)]">丰收</span>的歌，
          <br />
          带给小朋友的是一首<span className="text-[oklch(0.68_0.16_45)]">欢乐</span>的歌。
        </p>
        <p
          className="reveal mt-8 max-w-xl text-[14px] font-light leading-relaxed text-muted-foreground"
          style={{ "--d": 460 } as CSSProperties}>
          五个自然段，五个角度——钥匙、颜料、气味、小喇叭、歌。
          秋天的雨串起了整个秋天：它是丰收的季节，也是欢乐的季节。
        </p>
      </div>
    </SlideShell>
  );
}

