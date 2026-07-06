import React from 'react';
import { Link } from 'wouter';
import { useI18n, Language } from '@/lib/i18n';
import { Globe, BookOpen, HeartPulse, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-accent selection:text-primary">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest uppercase">
            <Link href="/finanzas" className="hover:text-accent transition-colors" data-testid="link-nav-finance">
              {t('nav.finance')}
            </Link>
            <Link href="/salud" className="hover:text-accent transition-colors" data-testid="link-nav-health">
              {t('nav.health')}
            </Link>
          </nav>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="font-serif text-2xl md:text-4xl font-bold tracking-tight text-primary hover:opacity-80 transition-opacity" data-testid="link-nav-home">
              Vida<span className="text-accent italic">Financiera</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Select value={lang} onValueChange={(v) => setLang(v as Language)}>
              <SelectTrigger className="w-[100px] border-none bg-transparent shadow-none hover:bg-muted/50 focus:ring-0" data-testid="select-lang-trigger">
                <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Lang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">ES</SelectItem>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="pt">PT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-primary text-primary-foreground py-16 mt-24">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="font-serif text-3xl font-bold tracking-tight text-primary-foreground mb-6 block">
              Vida<span className="text-accent italic">Financiera</span>
            </Link>
            <p className="text-primary-foreground/70 max-w-md text-lg leading-relaxed font-serif">
              {t('newsletter.desc')}
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="uppercase tracking-widest text-sm font-bold text-accent mb-2">Explorar</h4>
            <Link href="/" className="hover:text-accent transition-colors text-primary-foreground/80" data-testid="link-footer-home">{t('nav.home')}</Link>
            <Link href="/finanzas" className="hover:text-accent transition-colors text-primary-foreground/80" data-testid="link-footer-finance">{t('nav.finance')}</Link>
            <Link href="/salud" className="hover:text-accent transition-colors text-primary-foreground/80" data-testid="link-footer-health">{t('nav.health')}</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="uppercase tracking-widest text-sm font-bold text-accent mb-2">Legal</h4>
            <span className="text-primary-foreground/80 cursor-pointer hover:text-accent">Privacidad</span>
            <span className="text-primary-foreground/80 cursor-pointer hover:text-accent">Términos</span>
            <span className="text-primary-foreground/80 cursor-pointer hover:text-accent">Contacto</span>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-primary-foreground/10 text-center text-primary-foreground/50 text-sm">
          &copy; {new Date().getFullYear()} VidaFinanciera. {t('footer.rights')}
        </div>
      </footer>
    </div>
  );
};
