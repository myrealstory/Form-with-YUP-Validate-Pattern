import { locales,defaultLocale, LocaleKeysType } from "@/app/i18n";
import acceptLanguage from "accept-language";
import { NextRequest, NextResponse } from "next/server";
import { getLangFromString } from "./component/commonUtils";
import { CookiesKey } from "@/constants/cookies";
 
acceptLanguage.languages(locales);

const checkLocal = (request: NextRequest, response: NextResponse) => {
    const url = new URL(request.url);
    const langFromPathname = getLangFromString(url.pathname);

    if (!locales.includes(langFromPathname)) {
        url.pathname = `/${defaultLocale}${url.pathname}`;
        return NextResponse.redirect(url);
    }

    const referer = request.headers.get("referer");
let langInReferer: string | undefined = undefined;

if (referer) {
    const refererUrl = new URL(referer);
    const pathLocale = refererUrl.pathname.split("/")[1]; // Assuming locale is the first part of the path

    // Check if the extracted part is a valid locale
    if (locales.includes(pathLocale as LocaleKeysType)) {
        langInReferer = pathLocale as LocaleKeysType;
    }
}



if (langInReferer) {
    response.cookies.set(CookiesKey.i18next, langInReferer);
} else {
    response.cookies.set(CookiesKey.i18next, langFromPathname);
}


    return NextResponse.next();
}

export function middleware(request: NextRequest, response: NextResponse) {
    return checkLocal(request,response);
}