import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-xhr-backend';
import english from './locales/en/translation.json';
import portuguese from './locales/pt/translation.json';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'pt', // #TODO - #8: Change to 'en' when client is outside of the BR
    react: {
      useSuspense: false,
    },
    resources: {
      en: {
        translation: english,
      },
      pt: {
        translation: portuguese,
      },
    },
  });

export default i18n;
