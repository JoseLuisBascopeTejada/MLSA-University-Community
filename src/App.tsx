// TEMP: tokens + theme + i18n preview for FASE 1 review — delete in FASE 3.
// Hardcoded strings are allowed ONLY in this file while it exists.
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LangToggle } from '@/components/LangToggle';
import { useI18n } from '@/hooks/useI18n';

const AREAS = [
  { id: 'rrhh', name: 'RRHH' },
  { id: 'finanzas', name: 'Finanzas y sostenibilidad' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'operativa', name: 'Operativa' },
] as const;

export default function App() {
  const { locale, t } = useI18n();
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col items-start gap-6 p-6">
      <p className="text-sm text-muted-foreground">TEMP: tokens preview — delete in FASE 3</p>
      <div className="flex flex-wrap items-center gap-4">
        <ThemeToggle label={t('theme.toggle')} />
        <ThemeToggle label={t('theme.toggle')} />
        <LangToggle />
        <span className="text-sm text-muted-foreground">locale: {locale}</span>
      </div>
      <nav aria-label="TEMP" className="flex flex-wrap gap-4">
        <span>{t('nav.home')}</span>
        <span>{t('nav.about')}</span>
        <span>{t('nav.activities')}</span>
        <span>{t('nav.areas')}</span>
        <span>{t('nav.join')}</span>
        <span>{t('nav.faq')}</span>
      </nav>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="button">Primary button</Button>
        <Button type="button" variant="outline">
          Outline button
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-semibold text-foreground">Foreground sample</p>
        <p className="text-muted-foreground">Muted foreground sample</p>
        <p className="text-primary">Primary (link) text sample</p>
      </div>
      <div className="grid w-full gap-4 sm:grid-cols-2">
        {AREAS.map((area) => (
          <section key={area.id} data-area={area.id}>
            <Card>
              <CardHeader>
                <CardTitle className="text-area-text">{area.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="rounded-md bg-area px-3 py-2 text-sm font-medium text-area-foreground">
                  Area fill sample
                </div>
                <p className="text-sm text-muted-foreground">Muted text on card</p>
              </CardContent>
            </Card>
          </section>
        ))}
      </div>
      <footer className="flex flex-col gap-2 border-t pt-4 text-sm text-muted-foreground">
        <p>{t('footer.nonAffiliation')}</p>
        <span>{t('footer.cookieSettings')}</span>
      </footer>
    </main>
  );
}
