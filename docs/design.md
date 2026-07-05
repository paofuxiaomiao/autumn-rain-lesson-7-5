# 《秋天的雨》交互课件 · 设计规范（Design Spec）

本文档是课件的完整设计规范，与 `docs/ideas.md`（设计理念）、`docs/image-prompts.md`（插画提示词）配套。任何新增页面或改版都应遵循本规范。

## 一、色彩系统（Color Tokens）

遵循「自然 90% + 强调 10%」比例：大面积为暖雾白与深松墨绿的自然基调，柿橙作为唯一高显色强调色。所有令牌定义于 `client/src/index.css` 的 `:root`。

| 令牌 | HEX 近似 | OKLCH（代码实际值） | 用途 |
|---|---|---|---|
| 暖雾白 `--background` | #FAFAF7 | `oklch(0.983 0.003 106)` | 全局底色，纸感呼吸 |
| 深松墨绿 `--ink` / `--foreground` | #1A2E28 | `oklch(0.26 0.03 168)` | 主文字色，替代纯黑 |
| 柿橙 `--persimmon` / `--primary` | ≈#E8894A | `oklch(0.68 0.16 45)` | 唯一强调色：关键词、交互反馈、进度线、brand-dot |
| 银杏黄 `--ginkgo` | — | `oklch(0.83 0.14 90)` | 跟读句子高亮、落叶动效 |
| 枫叶红 `--maple` | — | `oklch(0.58 0.19 30)` | 配对游戏色块、落叶动效 |
| 雾青 `--mist` | #8FA8A0 | `oklch(0.72 0.03 178)` | 次要点缀、雨滴 |
| 浅石灰 `--stone` | #E8E6DF | `oklch(0.92 0.006 96)` | 背诵挖空遮罩、分区底色 |
| 弱化文字 `--muted-foreground` | — | `oklch(0.52 0.02 168)` | 注释、提示、次要信息 |

**禁则**：柿橙不做大面积背景；不使用高饱和红绿撞色；Tailwind 4 的 `@theme inline` 中颜色一律使用 OKLCH 格式。

## 二、字体系统（Typography）

三族字体经 Google Fonts CDN 引入（`client/index.html`）：`Noto Serif SC:600,700,900`、`Noto Sans SC:300,400,500,700`、`Inter:400,500,600`。

| 角色 | 字体 / 字重 | CSS 类 | 规格 |
|---|---|---|---|
| 课题 Display | Noto Serif SC 900 | `.font-display` | clamp(3rem, 7.5vw, 5.8rem)，字距 0.02em |
| 页面结论标题 | Noto Serif SC 700 | `.font-serif-title` | clamp(1.4rem, 2.8vw, 2.3rem)，标题即论点 |
| 课文正文 | Noto Serif SC 600 | `.font-lesson` | 行高 2.1、字距 0.04em，接近教材排版 |
| 界面正文 | Noto Sans SC 300/400 | 默认 / `.font-body-light` | 13–15px，行高 1.6+ |
| 标签 Eyebrow | Inter + Noto Sans SC 500 | `.font-label` | 10–11px，全大写，字距 0.22em |
| 数字/页码 | Inter tabular-nums | `.font-num` | 等宽数字对齐 |

**关键规范**：每页主标题为「结论句」而非名词短语（如「秋雨是一把钥匙，轻轻打开秋天的大门。」）；禁止书法体、卡通体。

## 三、版式系统（Layout）

全屏翻页舞台（`.slide-viewport` fixed inset-0），内容区 `.stage-pad` 统一内边距 `clamp(2rem,5vw,5.5rem) clamp(2rem,6vw,7rem)`。骨架为**非中心化左轴布局**：

- 页眉（SlideShell）：左侧「秋天的雨 | 统编版三年级上册 · 第6课」，右侧章节编号 + 章节名
- 精读页网格：`grid-cols-[7fr_5fr]`，左文右图，插画带 `float-soft` 缓浮动效
- 页脚全局 UI（Deck）：左下页码、底部柿橙进度线、右下章节导航、右侧翻页按钮
- 签名元素：等高线纹理 `.contour-bg`（透明度 <6%）、细线 `.hairline`、柿橙方点 `.brand-dot`（7px）
- 间距遵循 8/16/32/64px 体系；每页 ≥40% 负空间

页型分四种：**张力页**（封面：全幅插画+顶部提亮遮罩+超大衬线字）、**精读页**（左文右图）、**游戏页**（标题+双栏交互区+反馈条）、**工具页**（生字/习题/问答：居中或分栏 + `data-scrollable` 内滚区）。

## 四、动效系统（Motion）

两条缓动曲线：`--ease-out-quint: cubic-bezier(0.23,1,0.32,1)`（入场）、`--ease-in-out-soft: cubic-bezier(0.77,0,0.175,1)`（位移）。全部包裹在 `prefers-reduced-motion: no-preference` 内。

| 动效 | 类名 | 参数 |
|---|---|---|
| 翻页「雾散开」 | `.slide-enter/.slide-exit`（含 `-back` 方向变体） | 650ms 入 / 500ms 出，opacity + translateY(±28px) + blur(6px) |
| 元素错层入场 | `.reveal` + `style={{"--d": 120}}` | 900ms，translateY(18px)→0，每元素延迟递增 30–120ms |
| 封面 Ken Burns | `.kenburns` | 18s 极缓 scale(1.06→1) |
| 落叶 | `.leaf-fall`（SVG 银杏叶/枫叶） | 11–21s 线性循环，水平漂移 + 旋转，seeded 随机 |
| 细雨 | `.rain-drop` | 2.2–4.4s 线性循环，透明度 0.16–0.38 |
| 插画缓浮 | `.float-soft` | 6s 交替上下 10px |
| 配对成功 | `.match-pop` | 550ms scale 1→1.07→1 |
| 配对错误 | `.match-shake` | 400ms 水平抖动 ±5px |
| 跟读高亮 | `.sentence-active` | 银杏黄下划线渐变高亮，400ms 过渡 |

**禁则**：禁止弹跳、旋转、彩色闪烁；禁止 `scale(0)` 起始；键盘翻页即时响应。

## 五、组件规范

| 组件 | 文件 | 职责 |
|---|---|---|
| `Deck` | `client/src/components/Deck.tsx` | 翻页容器：方向键/滚轮/触摸/hash 导航、hashchange 同步、页码、进度线、章节导航；输入框聚焦时不拦截键盘；`data-scrollable` 区域内不触发滚轮翻页 |
| `SlideShell` | `client/src/components/SlideKit.tsx` | 信息页外壳（等高线纹理 + 页眉 + stage-pad） |
| `Eyebrow` / `ActionTitle` | 同上 | brand-dot 标签 / 衬线结论标题 |
| `AmbientLeaves` / `AmbientRain` | 同上 | 纯 SVG 落叶与细雨氛围层（seeded 随机，pointer-events-none） |

## 六、AI 接口规范

全部走 tRPC（`server/routers.ts` 的 `ai` 路由），server 端调用 `invokeLLM`：

| 接口 | 输入 | Prompt 结构 |
|---|---|---|
| `ai.ask` | question + history(≤12) | 雨滴老师人格 + 课文全文上下文 + 对话历史 |
| `ai.explainChar` | char/pinyin/word | 要求：一句话意思 + 课文用法 + 组2词各造短句，≤120字 |
| `ai.reviewImitation` | sentence | 三步点评：具体表扬 → 句式检查 → 温柔建议，≤130字 |

人格规则：适龄语言（8-9岁）、回答简短、不直接灌输答案、只围绕课文、表扬要具体。测试见 `server/ai.test.ts`（mock invokeLLM）。

## 七、关键实现决定（历轮沉淀）

1. **hash 同步**：Deck 除初始化读取 hash 外，必须监听 `hashchange/popstate`（修复外部导航不翻页的 bug）。
2. **互动页滚轮豁免**：可滚动区域加 `data-scrollable`，Deck 的 wheel/touch 处理器跳过这些区域。
3. **背诵挖空**：用 `text-transparent + bg-stone` 遮住句子，点击逐句显形核对，比整段隐藏更符合背诵心理。
4. **生字 AI 卡片**：右下角固定小卡片（不遮挡全屏），先播 Web Speech 读音再请求 AI 讲解。
5. **插画与页面同底色**：所有插画的背景色都指定 #FAFAF7，与网页底色融为一体，消除「贴图感」。
6. **图片托管**：插画托管于 GitHub 仓库 `assets/illustrations/`（webp, ≤700KB/张），通过 raw.githubusercontent.com 引用，见 `client/src/lib/assets.ts`。

