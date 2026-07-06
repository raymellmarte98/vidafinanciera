import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { I18nProvider } from '@/lib/i18n';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { CategoryPage } from '@/pages/Category';
import { ArticleDetail } from '@/pages/ArticleDetail';

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/finanzas">
          <CategoryPage category="finance" />
        </Route>
        <Route path="/salud">
          <CategoryPage category="health" />
        </Route>
        <Route path="/articulos/:slug" component={ArticleDetail} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
