import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useI18n, Language } from '@/lib/i18n';
import { useSubscribeNewsletter } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { NewsletterInputLang } from '@workspace/api-client-react';

const formSchema = z.object({
  email: z.string().email(),
});

export const NewsletterForm: React.FC = () => {
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const subscribeMutation = useSubscribeNewsletter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    subscribeMutation.mutate(
      { 
        data: { 
          email: values.email, 
          lang: lang as NewsletterInputLang 
        } 
      },
      {
        onSuccess: () => {
          toast({
            title: t('newsletter.success'),
          });
          form.reset();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: t('newsletter.error'),
          });
        }
      }
    );
  };

  return (
    <div className="bg-secondary p-8 md:p-12 text-secondary-foreground border-l-4 border-accent">
      <h3 className="font-serif text-3xl font-bold mb-4">{t('newsletter.title')}</h3>
      <p className="text-secondary-foreground/80 mb-8 max-w-md font-sans text-lg">
        {t('newsletter.desc')}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input 
                    placeholder={t('newsletter.placeholder')} 
                    {...field} 
                    className="bg-background text-foreground h-12 border-none rounded-none focus-visible:ring-accent"
                    data-testid="input-newsletter-email"
                  />
                </FormControl>
                <FormMessage className="text-accent" />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            disabled={subscribeMutation.isPending}
            className="h-12 px-8 rounded-none bg-accent text-accent-foreground hover:bg-accent/90 font-bold tracking-widest uppercase transition-colors"
            data-testid="button-subscribe-submit"
          >
            {subscribeMutation.isPending ? '...' : t('btn.subscribe')}
          </Button>
        </form>
      </Form>
    </div>
  );
};
