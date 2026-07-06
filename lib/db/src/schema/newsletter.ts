import { pgTable, text, serial, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const newsletterTable = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  lang: text("lang"),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
}, (t) => [
  unique("newsletter_email_unique").on(t.email),
]);

export const insertNewsletterSchema = createInsertSchema(newsletterTable).omit({ id: true, subscribedAt: true });
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type Newsletter = typeof newsletterTable.$inferSelect;
