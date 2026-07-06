import { pgTable, text, serial, boolean, timestamp, index, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const articlesTable = pgTable(
  "articles",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    lang: text("lang").notNull(), // 'es' | 'en' | 'pt'
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    category: text("category").notNull(), // 'finance' | 'health'
    imageUrl: text("image_url").notNull().default(""),
    publishedAt: timestamp("published_at").notNull().defaultNow(),
    featured: boolean("featured").notNull().default(false),
    tags: text("tags").array().notNull().default([]),
  },
  (t) => [
    unique("articles_slug_lang_unique").on(t.slug, t.lang),
    index("articles_lang_idx").on(t.lang),
    index("articles_category_idx").on(t.category),
    index("articles_slug_idx").on(t.slug),
    index("articles_featured_idx").on(t.featured),
  ],
);

export const insertArticleSchema = createInsertSchema(articlesTable).omit({ id: true });
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articlesTable.$inferSelect;
