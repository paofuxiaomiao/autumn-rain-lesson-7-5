# 《秋天的雨》插画生图提示词（原始 Prompts）

本文档记录课件全部 6 张插画的**原始英文生图提示词**（逐字导出，未做删改），供复现或延展新插画时使用。生成模型为通用文生图模型，质量档位 default。

统一风格基调：modern flat vector illustration（现代扁平矢量插画）、matte low-saturation autumn palette（哑光低饱和秋日色板）、warm cream background `#FAFAF7`（暖雾白底，与网页底色一致）、no outlines（无描边）、grainy paper texture（纸感颗粒）、no text（画面不带文字）。

---

## 1. cover_autumn_rain（封面 · 秋雨山水场景）

- 用途：封面张力页全幅背景（16:9）
- 文件：`assets/illustrations/cover_autumn_rain.webp`

```text
Flat illustration for a children's Chinese textbook lesson cover about autumn rain. A serene autumn landscape: soft misty layered hills in the far background (muted sage green and warm grey), middle ground with golden ginkgo trees and red maple trees with simple flat geometric foliage, gentle diagonal rain lines falling softly, a small winding path with scattered fallen ginkgo leaves. Foreground bottom corner shows chrysanthemum flowers in pale purple, light yellow and white. Style: modern flat vector illustration, matte low-saturation autumn palette (warm cream background #FAFAF7, mustard yellow, persimmon orange, soft maple red, deep pine green accents), generous negative space in the upper third for title text, grainy paper texture feel, no outlines, soft organic shapes, children's picture book aesthetic, no text, no characters.
```

## 2. key_door（第1段 · 钥匙与秋天的大门）

- 用途：第一自然段精读页右侧配图（1:1）
- 文件：`assets/illustrations/key_door.webp`

```text
Flat illustration, children's picture book style: a whimsical vintage brass key floating gently, tied with a small red autumn leaf tag, in front of a slightly-open arched wooden garden door. Through the door opening we glimpse a golden autumn world (ginkgo yellow light, falling leaves spilling out). Soft rain lines in background. Style: modern flat vector, matte low-saturation autumn palette on warm cream background #FAFAF7, soft shapes, no outlines, generous whitespace around subject, gentle and poetic mood, grainy texture, no text.
```

## 3. palette_colors（第2段 · 五彩缤纷的颜料）

- 用途：第二自然段跟读页右侧配图（4:3）
- 文件：`assets/illustrations/palette_colors.webp`

```text
Flat illustration, children's picture book style: an open watercolor paint box tilted playfully, spilling ribbons of autumn colors that transform into scenery — a yellow ribbon becomes ginkgo fan-shaped leaves, a red ribbon becomes maple leaves like postage stamps, a golden ribbon flows into a wavy field of wheat like a golden ocean, an orange ribbon becomes round mandarins and persimmons bumping into each other on a branch, and purple-pink-white ribbons bloom into chrysanthemum flowers nodding. Style: modern flat vector, matte low-saturation autumn palette on warm cream background #FAFAF7, soft organic shapes, no outlines, flowing dynamic composition from top-left paintbox to bottom-right flowers, generous whitespace, grainy paper texture, no text, no human characters.
```

## 4. fruits_scent（第3段 · 藏在雨滴里的香气）

- 用途：第三自然段精读页右侧配图（1:1）
- 文件：`assets/illustrations/fruits_scent.webp`

```text
Flat illustration, children's picture book style: a playful arrangement of autumn fruits floating among oversized translucent raindrops — a golden pear, a pineapple, a red apple, and orange mandarins, each partially tucked inside soft blue-grey rain droplets, with tiny scent swirl lines curling from the fruits. Style: modern flat vector illustration, matte low-saturation palette (warm cream background #FAFAF7, honey yellow, persimmon orange, soft red, muted teal droplets), soft rounded shapes, no outlines, generous negative space, dreamy and sweet mood, grainy paper texture, no text, no characters.
```

## 5. winter_prep（第4段 · 动植物准备过冬）

- 用途：第四自然段精读页右侧配图（4:3）
- 文件：`assets/illustrations/winter_prep.webp`

```text
Flat illustration, children's picture book style, autumn forest scene of animals preparing for winter: a cute squirrel holding a pinecone beside a tree hollow filled with acorns, a small green frog digging a cozy burrow underground shown in cutaway view, a tall pine tree wearing a thick glossy coat of needles, and a willow tree gently dropping its last leaves to the ground around its roots. A tiny golden trumpet horn floats in the sky with soft sound waves. Style: modern flat vector, matte low-saturation autumn palette (warm cream sky #FAFAF7, mustard, rust orange, deep pine green, warm brown), soft rounded shapes, no outlines, storybook composition with clear separated vignettes, grainy texture, no text.
```

## 6. harvest_song（第5段 · 丰收与欢乐之歌）

- 用途：第五自然段总结页居中配图（1:1）
- 文件：`assets/illustrations/harvest_song.webp`

```text
Flat illustration, children's picture book style: a gentle celebration of autumn harvest and joy — musical notes made of tiny leaves floating upward in a soft breeze above a warm golden field with simple flat haystacks, a couple of red-orange fruit trees heavy with mandarins and persimmons, and soft rain drops turning into sparkling musical staff lines across the sky. Style: modern flat vector, matte low-saturation autumn palette on warm cream background #FAFAF7, soft rounded shapes, no outlines, joyful yet serene mood, generous negative space at top, grainy paper texture, no text, no human characters.
```

---

## 提示词写作模式总结

| 要素 | 模式 | 示例 |
|---|---|---|
| 开头定位 | `Flat illustration, children's picture book style:` | 统一开头，锁定插画平面+绘本风 |
| 主体描述 | 具象名词 + 拟人化动作，对应课文意象 | key / paint box / raindrops / squirrel |
| 色板约束 | `matte low-saturation autumn palette on warm cream background #FAFAF7` | 与网页设计令牌同源，保证图页一体 |
| 留白指令 | `generous negative space / whitespace` | 为标题文字或排版预留呼吸感 |
| 质感 | `grainy paper texture, no outlines, soft organic shapes` | 纸感、无描边、柔和形状 |
| 负面约束 | `no text, no characters / no human characters` | 避免生成文字与人物干扰排版 |
