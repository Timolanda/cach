import { I18n } from 'i18n-js';
import * as RNLocalize from 'react-native-localize';

import en from '../locales/en.json';
import es from '../locales/es.json';

const i18n = new I18n({
  en,
  es,
});

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

const setI18nConfig = () => {
  const fallback = { languageTag: 'en', isRTL: false };
  const { languageTag } =
    RNLocalize.findBestAvailableLanguage(['en', 'es']) || fallback;

  i18n.locale = languageTag;
};

setI18nConfig();

RNLocalize.addEventListener('change', setI18nConfig);

export default i18n;

