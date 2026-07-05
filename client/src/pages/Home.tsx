/*
 * 《秋天的雨》交互课件 · 主页面
 * 翻页结构：封面 → 5个自然段精读（第2段含跟读）→ 两个互动游戏 → 生字 → 课后习题 → AI 问答
 */
import Deck from "@/components/Deck";
import AiChatSlide from "@/slides/AiChatSlide";
import CharsSlide from "@/slides/CharsSlide";
import ColorGameSlide from "@/slides/ColorGameSlide";
import CoverSlide from "@/slides/CoverSlide";
import ExerciseSlide from "@/slides/ExerciseSlide";
import Para2Slide from "@/slides/Para2Slide";
import { Para1Slide, Para3Slide, Para4Slide, Para5Slide } from "@/slides/ParaSlides";
import WinterGameSlide from "@/slides/WinterGameSlide";

const slides = [
  { id: "cover", node: <CoverSlide /> },
  { id: "para1", node: <Para1Slide /> },
  { id: "para2", node: <Para2Slide /> },
  { id: "game-color", node: <ColorGameSlide /> },
  { id: "para3", node: <Para3Slide /> },
  { id: "para4", node: <Para4Slide /> },
  { id: "game-winter", node: <WinterGameSlide /> },
  { id: "para5", node: <Para5Slide /> },
  { id: "chars", node: <CharsSlide /> },
  { id: "exercise", node: <ExerciseSlide /> },
  { id: "ai", node: <AiChatSlide /> },
];

const chapters = [
  { label: "封面", slideIndex: 0 },
  { label: "精读", slideIndex: 1 },
  { label: "游戏", slideIndex: 3 },
  { label: "生字", slideIndex: 8 },
  { label: "习题", slideIndex: 9 },
  { label: "问答", slideIndex: 10 },
];

export default function Home() {
  return <Deck slides={slides} chapters={chapters} />;
}
