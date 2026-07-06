import React from 'react';
import { useI18n } from '@/lib/i18n';
import { useListArticles, useGetSiteStats, ListArticlesLang } from '@workspace/api-client-react';
import { ArticleCard } from '@/components/ArticleCard';
import { AdSenseSlot } from '@/components/AdSenseSlot';
import { NewsletterForm } from '@/components/NewsletterForm';
import { BookOpen, TrendingUp, HeartPulse } from 'lucide-react';
import { Link } from 'wouter';

export const Home: React.FC = () => {
  const { t, lang } = useI18n();

  // Queries
  const { data: featuredData, isLoading: loadingFeatured } = useListArticles({ 
    lang: lang as ListArticlesLang, 
    featured: true,
    limit: 1
  });
  
  const { data: statsData } = useGetSiteStats();

  const { data: financeData, isLoading: loadingFinance } = useListArticles({ 
    lang: lang as ListArticlesLang, 
    category: 'finance',
    limit: 4
  });

  const { data: healthData, isLoading: loadingHealth } = useListArticles({ 
    lang: lang as ListArticlesLang, 
    category: 'health',
    limit: 4
  });

  const featuredArticle = featuredData?.articles[0];

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-24">
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-8 mt-12">
        <h1 className="sr-only">VidaFinanciera</h1>
        {loadingFeatured ? (
          <div className="w-full aspect-[2/1] bg-muted animate-pulse mb-8" />
        ) : featuredArticle ? (
          <ArticleCard article={featuredArticle} featured />
        ) : null}
      </section>

      {/* AdSense Top Banner */}
      <div className="container mx-auto px-4 md:px-8">
        <AdSenseSlot id="adsense-top-banner" type="banner" />
      </div>

      {/* Stats Bar */}
      {statsData && (
        <section className="border-y border-border bg-card">
          <div className="container mx-auto px-4 md:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="flex flex-col items-center justify-center pt-4 md:pt-0">
                <BookOpen className="w-6 h-6 text-accent mb-3" />
                <span className="text-4xl font-serif font-bold text-foreground mb-1" data-testid="text-stats-articles">{statsData.totalArticles}</span>
                <span className="uppercase tracking-widest text-xs font-bold text-muted-foreground">{t('stats.articles')}</span>
              </div>
              <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
                <TrendingUp className="w-6 h-6 text-primary mb-3" />
                <span className="text-4xl font-serif font-bold text-foreground mb-1" data-testid="text-stats-finance">{statsData.financeCount}</span>
                <span className="uppercase tracking-widest text-xs font-bold text-muted-foreground">{t('stats.finance')}</span>
              </div>
              <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
                <HeartPulse className="w-6 h-6 text-secondary mb-3" />
                <span className="text-4xl font-serif font-bold text-foreground mb-1" data-testid="text-stats-health">{statsData.healthCount}</span>
                <span className="uppercase tracking-widest text-xs font-bold text-muted-foreground">{t('stats.health')}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content Column */}
          <div className="lg:col-span-8 flex flex-col gap-24">
            
            {/* Finanzas Section */}
            <section>
              <div className="flex items-baseline justify-between border-b-2 border-primary pb-4 mb-8">
                <h2 className="text-3xl font-serif font-bold text-primary">{t('section.finance')}</h2>
                <Link href="/finanzas" className="uppercase tracking-widest text-xs font-bold text-primary hover:text-accent transition-colors" data-testid="link-view-all-finance">{t('btn.viewAll')} &rarr;</Link>
              </div>
              {loadingFinance ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1,2,3,4].map(i => <div key={i} className="aspect-[3/2] bg-muted animate-pulse" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                  {financeData?.articles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </section>

            {/* In-content AdSense */}
            <AdSenseSlot id="adsense-in-content" type="in-content" />

            {/* Salud Section */}
            <section>
              <div className="flex items-baseline justify-between border-b-2 border-secondary pb-4 mb-8">
                <h2 className="text-3xl font-serif font-bold text-secondary">{t('section.health')}</h2>
                <Link href="/salud" className="uppercase tracking-widest text-xs font-bold text-secondary hover:text-accent transition-colors" data-testid="link-view-all-health">{t('btn.viewAll')} &rarr;</Link>
              </div>
              {loadingHealth ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1,2,3,4].map(i => <div key={i} className="aspect-[3/2] bg-muted animate-pulse" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                  {healthData?.articles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </section>

          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-12">
            <div className="sticky top-28 flex flex-col gap-12">
              <NewsletterForm />
              <AdSenseSlot id="adsense-sidebar-rect" type="rectangle" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
