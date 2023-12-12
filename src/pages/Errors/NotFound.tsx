import { useTranslation } from 'react-i18next';

function NotFound(): JSX.Element {
  const { t } = useTranslation();

  return <>{t('apps.error.notFoundApp')}</>;
}

export default NotFound;
