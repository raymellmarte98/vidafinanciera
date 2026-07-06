import React from 'react';
import { useParams, Link } from 'wouter';
import { useI18n } from '@/lib/i18n';
import { useGetArticle, getGetArticleQueryKey, useListArticles, getListArticlesQueryKey, GetArticleLang, ListArticlesLang } from '@workspace/api-client-react';
import { AdSenseSlot } from '@/components/AdSenseSlot';
import { ArticleCard } from '@/components/ArticleCard';
import { MarkdownContent } from '@/components/MarkdownContent';
import { format } from 'date-fns';
import { es, enUS, pt } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';

const locales = { es, en: enUS, pt };

export const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useI18n();

  const { data: article, isLoading, isError } = useGetArticle(slug, {
    lang: lang as GetArticleLang
  }, {
    query: {
      enabled: !!slug,
      queryKey: getGetArticleQueryKey(slug, { lang: lang as GetArticleLang }),
    }
  });

  const { data: relatedData } = useListArticles({
    lang: lang as ListArticlesLang,
    category: article?.category as any,
    limit: 3
  }, {
    query: {
      enabled: !!article,
      queryKey: getListArticlesQueryKey({ lang: lang as ListArticlesLang, category: article?.category as any, limit: 3 }),
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-12 max-w-4xl animate-pulse">
        <div className="h-8 bg-muted w-24 mb-8" />
        <div className="h-16 bg-muted w-3/4 mb-6" />
        <div className="h-6 bg-muted w-1/4 mb-12" />
        <div className="aspect-video bg-muted mb-12" />
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-muted w-full" />)}
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-24 text-center">
        <h1 className="text-3xl font-serif text-destructive mb-4">{t('error.load')}</h1>
        <Link href="/" className="text-accent underline font-bold" data-testid="link-article-back-home">{t('nav.back')}</Link>
      </div>
    );
  }

  const formattedDate = format(new Date(article.publishedAt), 'MMMM d, yyyy', {
    locale: locales[lang as keyof typeof locales] || es
  });

  const categoryColor = article.category === 'finance' ? 'text-primary' : 'text-secondary';
  const categoryLabel = article.category === 'finance' ? t('nav.finance') : t('nav.health');

  return (
    <article className="pb-24">
      {/* Header */}
      <header className="container mx-auto px-4 md:px-8 max-w-4xl py-12 md:py-20 text-center">
        <Link 
          href={`/${article.category}`}
          className={`inline-flex items-center gap-2 uppercase tracking-widest text-xs font-bold mb-8 hover:text-accent transition-colors ${categoryColor}`}
          data-testid="link-article-back-category"
        >
          <ArrowLeft className="w-4 h-4" /> {categoryLabel}
        </Link>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-tight mb-8" data-testid="text-article-title">
          {article.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-muted-foreground font-sans uppercase tracking-widest text-sm" data-testid="text-article-meta">
          <span>{t('article.by')} Redacción</span>
          <span>&mdash;</span>
          <time dateTime={article.publishedAt}>{formattedDate}</time>
        </div>
      </header>

      {/* Featured Image */}
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8 mb-12">
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <AdSenseSlot id="adsense-article-top" type="banner" />

        {/* Content */}
        <MarkdownContent
          content={article.content}
          className="prose prose-lg md:prose-xl dark:prose-invert prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed max-w-none my-12"
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-12 border-t border-border pt-8">
          {article.tags.map(tag => (
            <span key={tag} className="px-4 py-2 bg-muted text-muted-foreground font-sans text-xs uppercase tracking-widest font-bold" data-testid={`text-tag-${tag}`}>
              #{tag}
            </span>
          ))}
        </div>

        <AdSenseSlot id="adsense-article-bottom" type="rectangle" />
      </div>

      {/* Related Articles */}
      {relatedData?.articles && relatedData.articles.length > 0 && (
        <section className="bg-muted/30 border-t border-border py-24 mt-24">
          <div className="container mx-auto px-4 md:px-8">
            <h3 className="text-3xl font-serif font-bold text-center mb-16">
              {t('article.related')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedData.articles.filter(a => a.id !== article.id).slice(0, 3).map(related => (
                <ArticleCard key={related.id} article={related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
};
