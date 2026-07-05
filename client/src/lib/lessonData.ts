/*
 * 《秋天的雨》课文数据（统编版三年级上册 第6课，作者：陶金鸿）
 */

export const LESSON_TITLE = "秋天的雨";
export const LESSON_AUTHOR = "陶金鸿";

/** 五个自然段 */
export const PARAGRAPHS = [
  {
    no: 1,
    keyword: "钥匙",
    theme: "秋雨是一把钥匙，轻轻打开秋天的大门。",
    text: "秋天的雨，是一把钥匙。它带着清凉和温柔，轻轻地，轻轻地，趁你没留意，把秋天的大门打开了。",
    device: "比喻：把秋雨比作「钥匙」，写出秋天悄悄来临。",
  },
  {
    no: 2,
    keyword: "颜料",
    theme: "秋雨有一盒五彩缤纷的颜料。",
    text: "秋天的雨，有一盒五彩缤纷的颜料。你看，它把黄色给了银杏树，黄黄的叶子像一把把小扇子，扇哪扇哪，扇走了夏天的炎热。它把红色给了枫树，红红的枫叶像一枚枚邮票，飘哇飘哇，邮来了秋天的凉爽。金黄色是给田野的，看，田野像金色的海洋。橙红色是给果树的，橘子、柿子你挤我碰，争着要人们去摘呢！菊花仙子得到的颜色就更多了，紫红的、淡黄的、雪白的……美丽的菊花在秋雨里频频点头。",
    device: "比喻＋拟人：小扇子、邮票、金色海洋；「你挤我碰」「频频点头」把植物写活了。",
  },
  {
    no: 3,
    keyword: "气味",
    theme: "秋雨藏着非常好闻的气味。",
    text: "秋天的雨，藏着非常好闻的气味。梨香香的，菠萝甜甜的，还有苹果、橘子，好多好多香甜的气味，都躲在小雨滴里呢！小朋友的脚，常被那香味勾住。",
    device: "拟人：气味「躲」在小雨滴里，香味把小朋友的脚「勾住」。",
  },
  {
    no: 4,
    keyword: "小喇叭",
    theme: "秋雨吹起金色的小喇叭，告诉大家冬天快来了。",
    text: "秋天的雨，吹起了金色的小喇叭。它告诉大家，冬天快要来了。小松鼠找来松果当粮食，小青蛙在加紧挖洞，准备舒舒服服地睡大觉。松柏穿上厚厚的、油亮亮的衣裳，杨树、柳树的叶子飘到树妈妈的脚下。它们都在准备过冬了。",
    device: "比喻＋拟人：秋雨像「小喇叭」传递消息，动植物都在准备过冬。",
  },
  {
    no: 5,
    keyword: "歌",
    theme: "秋雨带来丰收的歌、欢乐的歌。",
    text: "秋天的雨，带给大地的是一曲丰收的歌，带给小朋友的是一首欢乐的歌。",
    device: "总结全文：秋天是丰收的季节，也是欢乐的季节。",
  },
];

/** 第2段逐句拆分（跟读用） */
export const PARA2_SENTENCES = [
  "秋天的雨，有一盒五彩缤纷的颜料。",
  "你看，它把黄色给了银杏树，黄黄的叶子像一把把小扇子，扇哪扇哪，扇走了夏天的炎热。",
  "它把红色给了枫树，红红的枫叶像一枚枚邮票，飘哇飘哇，邮来了秋天的凉爽。",
  "金黄色是给田野的，看，田野像金色的海洋。",
  "橙红色是给果树的，橘子、柿子你挤我碰，争着要人们去摘呢！",
  "菊花仙子得到的颜色就更多了，紫红的、淡黄的、雪白的……美丽的菊花在秋雨里频频点头。",
];

/** 会认字 */
export const RECOGNIZE_CHARS = [
  { char: "钥", pinyin: "yào", word: "钥匙" },
  { char: "匙", pinyin: "shi", word: "钥匙" },
  { char: "缤", pinyin: "bīn", word: "五彩缤纷" },
  { char: "枚", pinyin: "méi", word: "一枚邮票" },
  { char: "爽", pinyin: "shuǎng", word: "凉爽" },
  { char: "柿", pinyin: "shì", word: "柿子" },
  { char: "频", pinyin: "pín", word: "频频点头" },
  { char: "梨", pinyin: "lí", word: "梨子" },
  { char: "萝", pinyin: "luó", word: "菠萝" },
  { char: "勾", pinyin: "gōu", word: "勾住" },
  { char: "喇", pinyin: "lǎ", word: "喇叭" },
  { char: "叭", pinyin: "ba", word: "喇叭" },
];

/** 会写字（田字格） */
export const WRITE_CHARS = [
  { char: "柔", pinyin: "róu", word: "温柔" },
  { char: "银", pinyin: "yín", word: "银杏" },
  { char: "夏", pinyin: "xià", word: "夏天" },
  { char: "枚", pinyin: "méi", word: "一枚" },
  { char: "票", pinyin: "piào", word: "邮票" },
  { char: "哇", pinyin: "wa", word: "飘哇飘哇" },
  { char: "爽", pinyin: "shuǎng", word: "凉爽" },
  { char: "柿", pinyin: "shì", word: "柿子" },
  { char: "争", pinyin: "zhēng", word: "争着" },
  { char: "频", pinyin: "pín", word: "频频" },
  { char: "勾", pinyin: "gōu", word: "勾住" },
  { char: "鼠", pinyin: "shǔ", word: "松鼠" },
];

/** 颜色配对游戏（第2段） */
export const COLOR_PAIRS = [
  { color: "黄色", colorCss: "oklch(0.83 0.14 90)", plant: "银杏树", hint: "黄黄的叶子像一把把小扇子" },
  { color: "红色", colorCss: "oklch(0.58 0.19 30)", plant: "枫树", hint: "红红的枫叶像一枚枚邮票" },
  { color: "金黄色", colorCss: "oklch(0.78 0.14 80)", plant: "田野", hint: "田野像金色的海洋" },
  { color: "橙红色", colorCss: "oklch(0.68 0.17 45)", plant: "果树", hint: "橘子、柿子你挤我碰" },
  { color: "紫红·淡黄·雪白", colorCss: "oklch(0.6 0.14 340)", plant: "菊花仙子", hint: "美丽的菊花频频点头" },
];

/** 过冬匹配游戏（第4段） */
export const WINTER_PAIRS = [
  { animal: "小松鼠", emoji: "🐿️", way: "找来松果当粮食", wayShort: "储存粮食" },
  { animal: "小青蛙", emoji: "🐸", way: "加紧挖洞，准备睡大觉", wayShort: "挖洞冬眠" },
  { animal: "松柏", emoji: "🌲", way: "穿上厚厚的、油亮亮的衣裳", wayShort: "穿厚衣裳" },
  { animal: "杨树柳树", emoji: "🍂", way: "叶子飘到树妈妈的脚下", wayShort: "落叶归根" },
];

/** 课文结构梳理（习题2） */
export const STRUCTURE_ITEMS = [
  { no: 1, answer: "钥匙", sentence: "秋天的雨，是一把＿＿", options: ["钥匙", "扇子", "邮票"] },
  { no: 2, answer: "颜料", sentence: "秋天的雨，有一盒五彩缤纷的＿＿", options: ["颜料", "画笔", "彩纸"] },
  { no: 3, answer: "气味", sentence: "秋天的雨，藏着非常好闻的＿＿", options: ["气味", "声音", "颜色"] },
  { no: 4, answer: "小喇叭", sentence: "秋天的雨，吹起了金色的＿＿", options: ["小喇叭", "小口哨", "小铃铛"] },
  { no: 5, answer: "歌", sentence: "秋天的雨，带给大地和小朋友的是＿＿", options: ["歌", "画", "诗"] },
];

/** 仿写例句 */
export const IMITATION_EXAMPLE =
  "它把黄色给了银杏树，黄黄的叶子像一把把小扇子，扇哪扇哪，扇走了夏天的炎热。";

