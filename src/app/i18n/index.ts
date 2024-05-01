import {createInstance} from 'i18next';
import {initReactI18next} from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';

type LocaleKeysType = "en" | "tc";

const locales: LocaleKeysType[] = ["en", "tc"];
const defaultLocale: LocaleKeysType = "tc";
const defaultNamespace = "main";
const LANGUAGE = {
  EN: "en" as const,
  TC: "tc" as const,
};

const getOptions = (lang: LocaleKeysType = defaultLocale, namespace = defaultNamespace) => {
  return {
    // debug: true,
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    lng: lang,
    fallbackNS: defaultNamespace,
    defaultNS: defaultNamespace,
    ns: namespace,
  };
};

const initI18next = async (lang: LocaleKeysType, namespace? : string) => {
    const i18nInstance = createInstance();
    await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((lng:string, ns:string)=>
    import(`./${lng}/${ns}.json`)))
    .init(getOptions(lang, namespace));
    return i18nInstance;
}

const useTranslation = async (lang: LocaleKeysType, namespace? : string, option?: {keyPrefix: string}) => {
    const i18nextInstance = await initI18next(lang, namespace);
    return {
        translate: i18nextInstance.getFixedT(lang, namespace, option?.keyPrefix),
        i18n: i18nextInstance,
    }
}

export {locales, defaultLocale, useTranslation,getOptions,LANGUAGE};
export type {LocaleKeysType};