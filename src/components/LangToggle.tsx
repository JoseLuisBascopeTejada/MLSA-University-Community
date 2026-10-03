import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';

export function LangToggle() {
  const { locale, toggle, t } = useI18n();
  return (
    <Button type="button" variant="outline" size="sm" onClick={toggle} aria-label={t('language.toggle')}>
      {locale === 'es' ? t('language.english') : t('language.spanish')}
    </Button>
  );
}
