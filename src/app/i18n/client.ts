"use client";

import { useEffect } from "react";
import i18next from "i18next";
import {initReactI18next, useTranslation as useTranslationOrg} from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { LocaleKeysType,  getOptions } from ".";

i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(resourcesToBackend((lng:string, ns:string)=>
    import(`./${lng}/${ns}.json`)))
    .init({
        ...getOptions(),
        detection: {
            order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag", "path", "subdomain"],
            caches: ["cookie"]
        }
    });


const useTranslation = (lang: LocaleKeysType, namespace?: string, option?: {keyPrefix: string}) => {
    useEffect(() => {
        if (i18next.resolvedLanguage !== lang) {
            i18next.changeLanguage(lang);
        }
    }, [lang]); // Dependency array ensures this runs only if `lang` changes
    
    const { t: translate, i18n } = useTranslationOrg(namespace, option);
    return { translate, i18n };
}

export { useTranslation };
