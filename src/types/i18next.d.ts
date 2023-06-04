// import the original type declarations
import 'i18next';
// import all namespaces (for the default language, only)
import enTranslation from '../../locales/en/translation.json';

declare module 'i18next' {
    // Extend CustomTypeOptions
    interface CustomTypeOptions {
        // custom resources type
        resources: {
            translation: typeof enTranslation;
        };
        // other
        returnNull: false;
    }
}
