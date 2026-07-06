import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'es' | 'en' | 'pt';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  es: {
    'nav.home': 'Inicio',
    'nav.finance': 'Finanzas',
    'nav.health': 'Salud',
    'hero.featured': 'Destacados',
    'stats.articles': 'Artículos Publicados',
    'stats.finance': 'Guías Financieras',
    'stats.health': 'Guías de Salud',
    'section.finance': 'Último en Finanzas',
    'section.health': 'Último en Salud',
    'btn.readMore': 'Leer artículo completo',
    'btn.viewAll': 'Ver todos',
    'btn.subscribe': 'Suscribirse',
    'newsletter.title': 'Recibe nuestros mejores artículos',
    'newsletter.desc': 'Únete a miles de lectores que reciben consejos accionables de dinero y bienestar cada semana.',
    'newsletter.placeholder': 'Tu correo electrónico',
    'newsletter.success': '¡Gracias por suscribirte!',
    'newsletter.error': 'Error al suscribirse. Inténtalo de nuevo.',
    'adsense.placeholder': 'Publicidad',
    'article.by': 'Por',
    'article.published': 'Publicado',
    'article.related': 'Artículos Relacionados',
    'category.finance.title': 'Finanzas',
    'category.finance.desc': 'Estrategias de inversión, gestión de patrimonio y consejos para hacer crecer tu capital con confianza.',
    'category.health.title': 'Salud & Bienestar',
    'category.health.desc': 'Salud preventiva, longevidad y rutinas basadas en la ciencia para una vida plena.',
    'footer.rights': 'Todos los derechos reservados.',
    'error.load': 'Ocurrió un error al cargar el contenido.',
    'empty.articles': 'No se encontraron artículos.',
    'nav.back': 'Volver'
  },
  en: {
    'nav.home': 'Home',
    'nav.finance': 'Finance',
    'nav.health': 'Health',
    'hero.featured': 'Featured',
    'stats.articles': 'Published Articles',
    'stats.finance': 'Finance Guides',
    'stats.health': 'Health Guides',
    'section.finance': 'Latest in Finance',
    'section.health': 'Latest in Health',
    'btn.readMore': 'Read full article',
    'btn.viewAll': 'View all',
    'btn.subscribe': 'Subscribe',
    'newsletter.title': 'Get our best articles',
    'newsletter.desc': 'Join thousands of readers getting actionable money and wellness advice every week.',
    'newsletter.placeholder': 'Your email address',
    'newsletter.success': 'Thanks for subscribing!',
    'newsletter.error': 'Error subscribing. Please try again.',
    'adsense.placeholder': 'Advertisement',
    'article.by': 'By',
    'article.published': 'Published',
    'article.related': 'Related Articles',
    'category.finance.title': 'Finance',
    'category.finance.desc': 'Investment strategies, wealth management, and tips to grow your capital with confidence.',
    'category.health.title': 'Health & Wellness',
    'category.health.desc': 'Preventive health, longevity, and science-backed routines for a fulfilling life.',
    'footer.rights': 'All rights reserved.',
    'error.load': 'An error occurred while loading content.',
    'empty.articles': 'No articles found.',
    'nav.back': 'Back'
  },
  pt: {
    'nav.home': 'Início',
    'nav.finance': 'Finanças',
    'nav.health': 'Saúde',
    'hero.featured': 'Destaques',
    'stats.articles': 'Artigos Publicados',
    'stats.finance': 'Guias Financeiros',
    'stats.health': 'Guias de Saúde',
    'section.finance': 'Últimas em Finanças',
    'section.health': 'Últimas em Saúde',
    'btn.readMore': 'Ler artigo completo',
    'btn.viewAll': 'Ver todos',
    'btn.subscribe': 'Inscrever-se',
    'newsletter.title': 'Receba nossos melhores artigos',
    'newsletter.desc': 'Junte-se a milhares de leitores que recebem conselhos práticos de dinheiro e bem-estar toda semana.',
    'newsletter.placeholder': 'Seu endereço de e-mail',
    'newsletter.success': 'Obrigado por se inscrever!',
    'newsletter.error': 'Erro ao se inscrever. Tente novamente.',
    'adsense.placeholder': 'Publicidade',
    'article.by': 'Por',
    'article.published': 'Publicado',
    'article.related': 'Artigos Relacionados',
    'category.finance.title': 'Finanças',
    'category.finance.desc': 'Estratégias de investimento, gestão de patrimônio e dicas para aumentar seu capital com confiança.',
    'category.health.title': 'Saúde & Bem-Estar',
    'category.health.desc': 'Saúde preventiva, longevidade e rotinas baseadas na ciência para uma vida plena.',
    'footer.rights': 'Todos os direitos reservados.',
    'error.load': 'Ocorreu um erro ao carregar o conteúdo.',
    'empty.articles': 'Nenhum artigo encontrado.',
    'nav.back': 'Voltar'
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('es');

  const t = (key: string): string => {
    return translations[lang]?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
