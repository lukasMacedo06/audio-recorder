import { FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

export default function BaseErrorHandler({ error }: FallbackProps) {
  const { t } = useTranslation();

  return (
    <div>
      <p>{t('apps.error.default')}</p>
      <p> {error} </p>
    </div>
  );
}
