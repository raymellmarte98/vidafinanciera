import { Router } from "express";
import { eq, sql, and } from "drizzle-orm";
import { db, articlesTable } from "@workspace/db";
import { ListCategoriesQueryParams, ListCategoriesResponse } from "@workspace/api-zod";

const router = Router();

// GET /categories
router.get("/categories", async (req, res): Promise<void> => {
  const parsed = ListCategoriesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { lang } = parsed.data;

  const categoryNames = [
    { slug: "finance", nameEs: "Finanzas", nameEn: "Finance", namePt: "Finanças", category: "finance" },
    { slug: "health", nameEs: "Salud", nameEn: "Health", namePt: "Saúde", category: "health" },
  ];

  const targetLang = lang ?? "es";

  const categories = await Promise.all(
    categoryNames.map(async (cat, index) => {
      const countConditions = [eq(articlesTable.category, cat.category)];
      if (lang) countConditions.push(eq(articlesTable.lang, lang));
      const countResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(articlesTable)
        .where(and(...countConditions));

      const name = targetLang === "en" ? cat.nameEn : targetLang === "pt" ? cat.namePt : cat.nameEs;

      return {
        id: index + 1,
        slug: cat.slug,
        name,
        lang: targetLang,
        articleCount: countResult[0]?.count ?? 0,
      };
    }),
  );

  const response = ListCategoriesResponse.parse({ categories });
  res.json(response);
});

export default router;
