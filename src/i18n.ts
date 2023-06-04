import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
export function i18nInit() {
    i18next.use(Backend).init({
        backend: {
            loadPath: 'locales/{{lng}}/{{ns}}.json',
        },
        fallbackLng: 'en',
        debug: true,
        returnNull: false,
        initImmediate: false,
    });
}
