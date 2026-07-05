# 秋天的雨 · 交互课件（Autumn Rain Interactive Lesson）

面向小学三年级语文课文《秋天的雨》（统编版三年级上册第 6 课，作者陶金鸿）的交互式网页课件。采用「山水咨询主义 × 秋日绘本」设计风格：暖雾白底、深松墨绿主墨、衬线标题、大量留白与呼吸感，包含翻页式课文精读、插画动效、两个互动游戏、生字学习、课后习题与 AI「雨滴老师」互动问答。

在线预览：https://autumnlessons-ttxztagp.manus.space

## 功能总览

| 模块 | 页面 | 说明 |
|---|---|---|
| 封面张力页 | #1 | 全幅插画 + 课文首句 + 「推开秋天的大门」入口 |
| 逐段精读 | #2 #3 #5 #6 #8 | 5 个自然段，左文右图，标注修辞手法 |
| 跟读与背诵 | #3 | 第 2 段逐句高亮朗读（Web Speech API）+ 背诵挖空挑战 |
| 颜色配对游戏 | #4 | 颜色词 ↔ 植物点击配对，答对弹跳反馈 |
| 过冬连线游戏 | #7 | 动植物 ↔ 过冬方式，SVG 曲线连线 |
| 生字学习 | #9 | 会认 12 字 + 会写 12 字（田字格），点击听读音 + AI 讲解组词 |
| 课后习题 | #10 | 教材三道原题：朗读背诵 / 结构梳理 / 仿写练习 + AI 点评 |
| AI 问答 | #11 | 「雨滴老师」自由问答（词语理解、修辞手法等） |

## 技术栈

React 19 + TypeScript + Tailwind CSS 4 + Express 4 + tRPC 11 + Drizzle ORM（MySQL）+ Vite 7 + Vitest。AI 能力通过服务端 `invokeLLM` 调用平台内置 LLM 网关。

## 环境配置（Getting Started）

### 前置要求

- Node.js ≥ 22，pnpm ≥ 10（`npm i -g pnpm`）
- 可选：MySQL 数据库（本课件核心功能不依赖业务表，无数据库也能运行页面；登录/用户功能需要）

### 本地启动

```bash
git clone https://github.com/paofuxiaomiao/autumn-rain-lesson-7-5.git
cd autumn-rain-lesson-7-5
pnpm install
pnpm dev          # 开发模式（tsx watch server/_core/index.ts），默认 http://localhost:3000
```

### 环境变量

服务端从环境变量读取配置（部署平台自动注入，本地可建 `.env`）。与本课件直接相关的是：

| 变量 | 用途 | 缺失时的表现 |
|---|---|---|
| `BUILT_IN_FORGE_API_URL` / `BUILT_IN_FORGE_API_KEY` | LLM 网关（AI 问答/生字讲解/仿写点评） | AI 相关接口报错，其余页面正常 |
| `DATABASE_URL` | MySQL 连接串（用户表） | 跳过数据库，页面功能不受影响 |
| `JWT_SECRET` 等 OAuth 变量 | 登录会话 | 匿名访问，课件无需登录 |

### 常用脚本

```bash
pnpm dev      # 本地开发（前后端一体，Vite 中间件模式）
pnpm check    # TypeScript 类型检查
pnpm test     # Vitest 单元测试（server/*.test.ts）
pnpm build    # 生产构建（vite build + esbuild 打包 server）
pnpm start    # 生产启动（node dist/index.js）
```

## 项目结构

```
├── assets/illustrations/     # 6 张插画（webp，raw.githubusercontent 直链引用）
├── docs/
│   ├── ideas.md              # 设计理念（为什么这样设计）
│   ├── design.md             # 设计规范（色彩/字体/版式/动效/组件/AI 接口）
│   └── image-prompts.md      # 插画原始生图提示词（可复现）
├── client/
│   ├── index.html            # 入口 HTML（Google Fonts 引入处）
│   └── src/
│       ├── index.css         # ★ 设计令牌 + 全部动效 CSS（改风格先看这里）
│       ├── components/
│       │   ├── Deck.tsx      # ★ 翻页容器（键盘/滚轮/触摸/hash 导航 + 雾散开动效）
│       │   └── SlideKit.tsx  # ★ 页面骨架组件 + 落叶/细雨氛围层
│       ├── slides/           # ★ 每页一个组件
│       │   ├── CoverSlide.tsx        # 封面
│       │   ├── ParaSlides.tsx        # 第1/3/4/5段精读页
│       │   ├── Para2Slide.tsx        # 第2段跟读+背诵
│       │   ├── ColorGameSlide.tsx    # 游戏①颜色配对
│       │   ├── WinterGameSlide.tsx   # 游戏②过冬连线
│       │   ├── CharsSlide.tsx        # 生字学习
│       │   ├── ExerciseSlide.tsx     # 课后习题三题
│       │   └── AiChatSlide.tsx       # AI 问答
│       ├── lib/
│       │   ├── lessonData.ts # ★ 课文全文/生字表/游戏配对数据/习题数据（改内容先看这里）
│       │   ├── assets.ts     # 插画 URL 常量（GitHub raw 链接）
│       │   └── trpc.ts       # tRPC 客户端绑定
│       └── pages/Home.tsx    # slides 数组与章节导航配置
├── server/
│   ├── routers.ts            # ★ tRPC 路由：ai.ask / ai.explainChar / ai.reviewImitation
│   ├── ai.test.ts            # AI 路由单元测试（mock LLM）
│   └── _core/                # 框架层（OAuth/LLM 网关/Vite 桥接），一般不要改
├── drizzle/schema.ts         # 数据库表定义（当前仅用户表）
└── todo.md                   # 功能清单与开发历史
```

带 ★ 的是新贡献者最常改动的关键文件。

## 关键文件speed-run

1. **改课文内容/生字/习题** → `client/src/lib/lessonData.ts`（纯数据文件，所有页面自动更新）
2. **改颜色/字体/动效** → `client/src/index.css`（OKLCH 设计令牌 + keyframes），规范见 `docs/design.md`
3. **加新页面** → 在 `client/src/slides/` 建组件，然后在 `client/src/pages/Home.tsx` 的 `slides` 数组注册
4. **改 AI 人格或提示词** → `server/routers.ts` 顶部 `TEACHER_PERSONA` 与 `LESSON_CONTEXT` 常量
5. **换插画** → 生成新图放入 `assets/illustrations/`，更新 `client/src/lib/assets.ts`；提示词模式参考 `docs/image-prompts.md`

## 贡献约定

- 提交前运行 `pnpm check && pnpm test`，两者必须通过
- 遵循 `docs/design.md` 的设计禁则（衬线标题、OKLCH 颜色、动效缓动曲线、留白比例）
- 新增交互务必考虑 `prefers-reduced-motion` 与键盘可达性
- 涉及 AI 接口的改动需在 `server/ai.test.ts` 补充对应测试（mock `invokeLLM`，不真实调用）
- 可滚动内容区域记得加 `data-scrollable`，否则会被翻页滚轮拦截

## License

MIT。课文《秋天的雨》版权归原作者陶金鸿及教材出版方所有，本项目仅用于教学演示。
