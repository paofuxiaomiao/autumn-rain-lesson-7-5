import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const LESSON_CONTEXT = `课文《秋天的雨》（统编版三年级上册第6课，作者陶金鸿）全文：
第1段：秋天的雨，是一把钥匙。它带着清凉和温柔，轻轻地，轻轻地，趁你没留意，把秋天的大门打开了。
第2段：秋天的雨，有一盒五彩缤纷的颜料。你看，它把黄色给了银杏树，黄黄的叶子像一把把小扇子，扇哪扇哪，扇走了夏天的炎热。它把红色给了枫树，红红的枫叶像一枚枚邮票，飘哇飘哇，邮来了秋天的凉爽。金黄色是给田野的，看，田野像金色的海洋。橙红色是给果树的，橘子、柿子你挤我碰，争着要人们去摘呢！菊花仙子得到的颜色就更多了，紫红的、淡黄的、雪白的……美丽的菊花在秋雨里频频点头。
第3段：秋天的雨，藏着非常好闻的气味。梨香香的，菠萝甜甜的，还有苹果、橘子，好多好多香甜的气味，都躲在小雨滴里呢！小朋友的脚，常被那香味勾住。
第4段：秋天的雨，吹起了金色的小喇叭。它告诉大家，冬天快要来了。小松鼠找来松果当粮食，小青蛙在加紧挖洞，准备舒舒服服地睡大觉。松柏穿上厚厚的、油亮亮的衣裳，杨树、柳树的叶子飘到树妈妈的脚下。它们都在准备过冬了。
第5段：秋天的雨，带给大地的是一曲丰收的歌，带给小朋友的是一首欢乐的歌。
课文从五个方面写秋天：钥匙（引出秋天）、颜料（缤纷色彩）、气味（香甜丰收）、小喇叭（动植物准备过冬）、歌（丰收与欢乐的总结）。`;

const TEACHER_PERSONA = `你是「雨滴老师」，一位温柔耐心的小学三年级语文老师。回答规则：
1. 用适合8-9岁孩子的简单语言，亲切温暖，可以偶尔用一两个可爱的表情符号；
2. 回答简短（一般不超过150字），多用打比方、举例子；
3. 不直接灌输答案，先给一点提示，再引导孩子自己思考，结尾常带一个启发性的小问题；
4. 只围绕课文《秋天的雨》和语文学习相关内容回答，如果孩子问无关的问题，温柔地把话题引回课文；
5. 表扬要具体，指出孩子说得好的地方。`;

function extractText(response: Awaited<ReturnType<typeof invokeLLM>>): string {
  const content = response.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map(part => (typeof part === "string" ? part : "text" in part ? (part as { text?: string }).text ?? "" : ""))
      .join("");
  }
  return "";
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  ai: router({
    /** AI 互动问答（雨滴老师） */
    ask: publicProcedure
      .input(
        z.object({
          question: z.string().min(1).max(500),
          history: z
            .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(2000) }))
            .max(12)
            .optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: `${TEACHER_PERSONA}\n\n${LESSON_CONTEXT}` },
            ...(input.history ?? []).map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: input.question },
          ],
        });
        return { answer: extractText(response) || "雨滴老师走神啦，再问一次好吗？" };
      }),

    /** 生字 AI 解释 */
    explainChar: publicProcedure
      .input(z.object({ char: z.string().min(1).max(4), pinyin: z.string().max(20), word: z.string().max(20) }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: `${TEACHER_PERSONA}\n\n${LESSON_CONTEXT}` },
            {
              role: "user",
              content: `请给三年级小朋友讲一讲生字「${input.char}」（拼音：${input.pinyin}，课文词语：${input.word}）。要求：1) 用一句话说清它的意思；2) 结合课文中的句子讲讲用法；3) 再组2个新词并各造一个简单的短句。全部内容控制在120字以内，分小段呈现。`,
            },
          ],
        });
        return { explanation: extractText(response) || "这个字有点害羞，再点一次试试吧！" };
      }),

    /** 仿写练习 AI 点评 */
    reviewImitation: publicProcedure
      .input(z.object({ sentence: z.string().min(4).max(400) }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: `${TEACHER_PERSONA}\n\n${LESSON_CONTEXT}` },
            {
              role: "user",
              content: `课后习题：想象一下，秋天的雨还会把颜色分给谁呢？照样子写一写。例句：「它把黄色给了银杏树，黄黄的叶子像一把把小扇子，扇哪扇哪，扇走了夏天的炎热。」\n\n我写的句子是：「${input.sentence}」\n\n请你以雨滴老师的身份点评：1) 先找出句子里写得好的地方具体表扬；2) 检查是否用上了「把颜色给了谁＋像什么＋做了什么」的句式，比喻是否恰当；3) 温柔地提出一个改进小建议或追问，鼓励我再想一想。控制在130字以内。`,
            },
          ],
        });
        return { feedback: extractText(response) || "雨滴老师没看清，再交一次好吗？" };
      }),
  }),
});

export type AppRouter = typeof appRouter;
