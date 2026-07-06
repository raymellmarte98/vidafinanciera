import { Router } from "express";
import { db, newsletterTable } from "@workspace/db";
import { SubscribeNewsletterBody, SubscribeNewsletterResponse } from "@workspace/api-zod";

const router = Router();

// POST /newsletter
router.post("/newsletter", async (req, res): Promise<void> => {
  const parsed = SubscribeNewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, lang } = parsed.data;

  try {
    const [subscription] = await db
      .insert(newsletterTable)
      .values({ email, lang: lang ?? null })
      .returning();

    const response = SubscribeNewsletterResponse.parse({
      ...subscription,
      subscribedAt: subscription.subscribedAt.toISOString(),
    });

    res.status(201).json(response);
  } catch (err: unknown) {
    const error = err as { code?: string };
    if (error.code === "23505") {
      // unique constraint violation
      res.status(409).json({ error: "Email already subscribed" });
      return;
    }
    throw err;
  }
});

export default router;
