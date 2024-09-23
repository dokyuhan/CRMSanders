import polyglotI18nProvider from 'ra-i18n-polyglot';
import { spanishMessages } from './i18nProvider';

export const i18nProvider = polyglotI18nProvider(
    locate => spanishMessages, 'es' //DEFAULT en ESPAÑOL
);

