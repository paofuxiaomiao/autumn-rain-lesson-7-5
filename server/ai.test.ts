import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(async () => ({
    choices: [{ message: { content: "这是雨滴老师的回答。" } }],
  })),
}));

import { invokeLLM } from "./_core/llm";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  } as TrpcContext;
}

describe("ai router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ask returns teacher answer", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.ai.ask({ question: "五彩缤纷是什么意思？" });
    expect(result.answer).toBe("这是雨滴老师的回答。");
    expect(invokeLLM).toHaveBeenCalledOnce();
    const args = vi.mocked(invokeLLM).mock.calls[0][0];
    expect(String(args.messages[0].content)).toContain("雨滴老师");
    expect(String(args.messages[0].content)).toContain("秋天的雨");
  });

  it("ask forwards history", async () => {
    const caller = appRouter.createCaller(createCtx());
    await caller.ai.ask({
      question: "还有别的比喻吗？",
      history: [
        { role: "user", content: "课文里有哪些比喻？" },
        { role: "assistant", content: "钥匙、小扇子、邮票……" },
      ],
    });
    const args = vi.mocked(invokeLLM).mock.calls[0][0];
    expect(args.messages).toHaveLength(4); // system + 2 history + question
  });

  it("explainChar includes char info in prompt", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.ai.explainChar({ char: "爽", pinyin: "shuǎng", word: "凉爽" });
    expect(result.explanation).toBeTruthy();
    const args = vi.mocked(invokeLLM).mock.calls[0][0];
    expect(String(args.messages[1].content)).toContain("爽");
    expect(String(args.messages[1].content)).toContain("凉爽");
  });

  it("reviewImitation includes student sentence", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.ai.reviewImitation({
      sentence: "它把绿色给了松树，绿绿的松针像一根根小针，缝哇缝哇，缝出了冬天的暖衣。",
    });
    expect(result.feedback).toBeTruthy();
    const args = vi.mocked(invokeLLM).mock.calls[0][0];
    expect(String(args.messages[1].content)).toContain("松树");
  });

  it("rejects empty question", async () => {
    const caller = appRouter.createCaller(createCtx());
    await expect(caller.ai.ask({ question: "" })).rejects.toThrow();
  });
});
