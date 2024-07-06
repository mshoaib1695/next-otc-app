import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
// import es from './locales/es.json';
// import pt from './locales/pt.json';

// const fetchLanguage = async (language: string) => {
//     const response = await fetch(`locales/${language}.json`);
//     return await response.json();
// };

export const languages = {
    // en: await fetchLanguage('en'),
    en: { ...en },
    // pt: { ...pt },
    // es: { ...es },
};

i18n.use(initReactI18next).init({
    resources: languages,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
});

export default i18n;
