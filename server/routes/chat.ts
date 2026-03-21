import { Router } from "express";

const router = Router();

/**
 * POST /api/chat
 *
 * Wire an LLM provider here (OpenAI, Anthropic, etc.) or your own agent.
 * Shape is intentionally open: the client sends { message, ...context } and
 * gets back { reply } or a streamed response.
 *
 * Example wiring for OpenAI:
 *
 *   import OpenAI from "openai";
 *   const openai = new OpenAI({ apiKey: Bun.env.OPENAI_API_KEY });
 *
 *   router.post("/", async (req, res) => {
 *     const stream = await openai.chat.completions.create({
 *       model: "gpt-4o-mini",
 *       messages: [{ role: "user", content: req.body.message }],
 *       stream: true,
 *     });
 *     res.setHeader("Content-Type", "text/event-stream");
 *     for await (const chunk of stream) {
 *       res.write(`data: ${JSON.stringify(chunk)}\n\n`);
 *     }
 *     res.end();
 *   });
 */
router.post("/", (_req, res) => {
  res.status(501).json({
    error: "not_implemented",
    hint: "Wire an LLM provider in routes/chat.ts",
  });
});

export default router;
