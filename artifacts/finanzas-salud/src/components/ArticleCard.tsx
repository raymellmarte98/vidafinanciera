import React from 'react';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { es, enUS, pt } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';
import type { Article } from '@workspace/api-client-react';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const locales = { es, en: enUS, pt };

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false }) => {
  const { lang, t } = useI18n();

  const formattedDate = format(new Date(article.publishedAt), 'MMMM d, yyyy', {
    locale: locales[lang as keyof typeof locales] || es
  });

  const categoryColor = article.category === 'finance' ? 'text-primary' : 'text-secondary';
  const categoryLabel = article.category === 'finance' ? t('nav.finance') : t('nav.health');

  if (featured) {
    return (
      <Link href={`/articulos/${article.slug}`} className="group block w-full no-underline hover-elevate" data-testid={`link-article-featured-${article.id}`}>
        <article className="relative grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-card border-b-4 border-b-accent pb-8">
          <div className="order-2 md:order-1 flex flex-col items-start gap-4">
            <span className={`uppercase tracking-widest text-xs font-bold ${categoryColor}`} data-testid={`text-article-category-${article.id}`}>
              {categoryLabel}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif leading-tight font-bold text-foreground group-hover:text-accent transition-colors" data-testid={`text-article-title-${article.id}`}>
              {article.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed line-clamp-3" data-testid={`text-article-excerpt-${article.id}`}>
              {article.excerpt}
            </p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-4 font-sans font-medium">
              <span className="uppercase tracking-wide">{t('article.by')} Redacción</span>
              <span>&mdash;</span>
              <time dateTime={article.publishedAt} className="uppercase tracking-wide">{formattedDate}</time>
            </div>
          </div>
          <div className="order-1 md:order-2 aspect-[4/3] md:aspect-[3/4] w-full overflow-hidden">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="eager"
            />
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/articulos/${article.slug}`} className="group block w-full no-underline" data-testid={`link-article-${article.id}`}>
      <article className="flex flex-col gap-4 h-full">
        <div className="aspect-[3/2] w-full overflow-hidden mb-2">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </div>
        <span className={`uppercase tracking-widest text-xs font-bold ${categoryColor}`} data-testid={`text-article-category-${article.id}`}>
          {categoryLabel}
        </span>
        <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground leading-snug group-hover:text-accent transition-colors line-clamp-3" data-testid={`text-article-title-${article.id}`}>
          {article.title}
        </h3>
        <p className="text-muted-foreground text-sm font-sans line-clamp-2" data-testid={`text-article-excerpt-${article.id}`}>
          {article.excerpt}
        </p>
        <time dateTime={article.publishedAt} className="text-xs text-muted-foreground uppercase tracking-wide font-medium mt-auto">
          {formattedDate}
        </time>
      </article>
    </Link>
  );
};
