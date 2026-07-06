import React from 'react';
import { useParams } from 'wouter';
import { useI18n } from '@/lib/i18n';
import { useListArticles, ListArticlesLang, ListArticlesCategory } from '@workspace/api-client-react';
import { ArticleCard } from '@/components/ArticleCard';
import { AdSenseSlot } from '@/components/AdSenseSlot';

interface CategoryPageProps {
  category: 'finance' | 'health';
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const { t, lang } = useI18n();

  const { data, isLoading, isError } = useListArticles({
    lang: lang as ListArticlesLang,
    category: category as ListArticlesCategory,
    limit: 20
  });

  const titleKey = category === 'finance' ? 'category.finance.title' : 'category.health.title';
  const descKey = category === 'finance' ? 'category.finance.desc' : 'category.health.desc';
  const colorClass = category === 'finance' ? 'text-primary' : 'text-secondary';
  const borderColorClass = category === 'finance' ? 'border-primary' : 'border-secondary';
  const bgClass = category === 'finance' ? 'bg-primary/5' : 'bg-secondary/5';

  return (
    <div className="flex flex-col gap-12 pb-24">
      {/* Category Header */}
      <section className={`py-16 md:py-24 ${bgClass} border-b border-border`}>
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <h1 className={`text-5xl md:text-7xl font-serif font-bold mb-6 ${colorClass}`} data-testid={`text-category-title-${category}`}>
            {t(titleKey)}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-serif leading-relaxed" data-testid={`text-category-desc-${category}`}>
            {t(descKey)}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8">
        <AdSenseSlot id={`adsense-${category}-top`} type="banner" />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mt-12">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex flex-col gap-4">
                <div className="aspect-[3/2] bg-muted animate-pulse" />
                <div className="h-6 bg-muted animate-pulse w-1/3" />
                <div className="h-8 bg-muted animate-pulse w-full" />
                <div className="h-8 bg-muted animate-pulse w-2/3" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-24 text-destructive font-bold text-xl">
            {t('error.load')}
          </div>
        ) : !data?.articles.length ? (
          <div className="text-center py-24 text-muted-foreground font-serif text-xl italic">
            {t('empty.articles')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mt-12">
            {data.articles.map((article, index) => (
              <React.Fragment key={article.id}>
                <ArticleCard article={article} />
                {/* Insert AdSense every 6 articles on finance page */}
                {category === 'finance' && (index + 1) % 6 === 0 && (
                  <div className="col-span-full py-8 border-y border-border my-4">
                    <AdSenseSlot id={`adsense-finance-mid-${index}`} type="rectangle" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
