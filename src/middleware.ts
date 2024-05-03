import { locales,defaultLocale } from "@/app/i18n";
import acceptLanguage from "accept-language";
import { NextRequest, NextResponse } from "next/server";
import { getLangFromString } from "./component/commonUtils";
import { CookiesKey } from "@/constants/cookies";
 
acceptLanguage.languages(locales);

const checkLocal = (request: NextRequest) => {

    const url = new URL(request.nextUrl);
    const langFromPathname = getLangFromString(url.pathname);
    const queryParams = request.nextUrl.searchParams.toString();

    const response = NextResponse.next();

    const path = request.nextUrl.pathname;

    // Redirect to default locale if visiting the root path
    if (path === "/") {
        const url = new URL(request.url);
        url.pathname = `/${defaultLocale}`;
        return NextResponse.redirect(url);
    }

    if(
        !locales.some(locale => request.nextUrl.pathname.startsWith(`/${locale}`)) &&
        !path.startsWith("/_next") && request.nextUrl.locale === "en"
    ) {
        url.pathname = `/${langFromPathname}${path}`;
        if(queryParams){
            url.search = queryParams;
        }
        return NextResponse.redirect(url);
    }

    const referer = request.headers.get("referer");
    let langInReferer: string | undefined;

    if (referer) {
        const refererUrl = new URL(referer);
        langInReferer = locales.find(locale => refererUrl.pathname.startsWith(`/${locale}`));
    }



    if (langInReferer) {
        response.cookies.set(CookiesKey.i18next, langInReferer);
      } else {
        response.cookies.set(CookiesKey.i18next, langFromPathname);
      }


    return response;
}

export async function middleware(request: NextRequest, response: NextResponse) {
    
    response = checkLocal(request);
    return response ;
}