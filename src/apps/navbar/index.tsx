import { useTranslation } from 'react-i18next';
import { Container } from './style';

function NavBar(): JSX.Element {
  const { t } = useTranslation();

  return <Container>{t('apps.navbar.title')}</Container>;
}

export default NavBar;
