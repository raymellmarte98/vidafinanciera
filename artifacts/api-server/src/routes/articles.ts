import { Router } from "express";
import { eq, and, desc, sql, ilike } from "drizzle-orm";
import { db, articlesTable } from "@workspace/db";
import {
  ListArticlesQueryParams,
  GetArticleQueryParams,
  ListArticlesResponse,
  GetArticleResponse,
  GetSiteStatsResponse,
} from "@workspace/api-zod";

const router = Router();

// GET /articles
router.get("/articles", async (req, res): Promise<void> => {
  const parsed = ListArticlesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { lang, category, featured, limit = 10, offset = 0 } = parsed.data;

  const conditions = [];
  if (lang) conditions.push(eq(articlesTable.lang, lang));
  if (category) conditions.push(eq(articlesTable.category, category));
  if (featured !== undefined) conditions.push(eq(articlesTable.featured, featured));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [articles, countResult] = await Promise.all([
    db
      .select()
      .from(articlesTable)
      .where(whereClause)
      .orderBy(desc(articlesTable.publishedAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(articlesTable)
      .where(whereClause),
  ]);

  const total = countResult[0]?.count ?? 0;

  const response = ListArticlesResponse.parse({
    articles: articles.map((a) => ({
      ...a,
      publishedAt: a.publishedAt.toISOString(),
    })),
    total,
  });

  res.json(response);
});

// GET /articles/:slug
router.get("/articles/:slug", async (req, res): Promise<void> => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const parsed = GetArticleQueryParams.safeParse(req.query);
  const lang = parsed.success ? parsed.data.lang : undefined;

  const conditions = [eq(articlesTable.slug, slug)];
  if (lang) conditions.push(eq(articlesTable.lang, lang));

  const article = await db
    .select()
    .from(articlesTable)
    .where(and(...conditions))
    .limit(1);

  if (!article[0]) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  const response = GetArticleResponse.parse({
    ...article[0],
    publishedAt: article[0].publishedAt.toISOString(),
  });

  res.json(response);
});

// GET /stats
router.get("/stats", async (req, res): Promise<void> => {
  const [totals, finance, health] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(articlesTable),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(articlesTable)
      .where(eq(articlesTable.category, "finance")),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(articlesTable)
      .where(eq(articlesTable.category, "health")),
  ]);

  const response = GetSiteStatsResponse.parse({
    totalArticles: totals[0]?.count ?? 0,
    financeCount: finance[0]?.count ?? 0,
    healthCount: health[0]?.count ?? 0,
    languages: ["es", "en", "pt"],
  });

  res.json(response);
});

export default router;
