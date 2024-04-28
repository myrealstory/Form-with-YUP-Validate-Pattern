const CookiesKey = {
    i18next: "i18next" as const,
}

type CookiesKeyType = keyof typeof CookiesKey;
export type {CookiesKeyType};
export {CookiesKey};