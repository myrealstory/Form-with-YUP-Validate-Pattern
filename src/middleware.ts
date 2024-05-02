import { locales,defaultLocale } from "@/app/i18n";
import acceptLanguage from "accept-language";
import { NextRequest, NextResponse } from "next/server";
import { getLangFromString } from "./component/commonUtils";
import { CookiesKey } from "@/constants/cookies";
 
acceptLanguage.languages(locales);

const checkLocal = (request: NextRequest, response: NextResponse) => {

    if(request.nextUrl.pathname === "/"){
        const url = new URL(request.url);
        url.pathname = `/${defaultLocale}`;
        return NextResponse.redirect(url);
    }

    const langFromPathname = getLangFromString(request.nextUrl.pathname);
    const queryParams = request.nextUrl.searchParams.toString();

    if(
        !locales.some(locales => request.nextUrl.pathname.startsWith(`/${locales}`)) &&
        !request.nextUrl.pathname.startsWith("/_next") 
    ){
        const url = new URL(request.url);
        url.pathname = `/${defaultLocale}${request.nextUrl.pathname}${queryParams ?? ""}`;
        if(queryParams){
            url.search = queryParams;
        }
        return NextResponse.redirect(url);
    }

    const referer = request.headers.get("referer");
    let langInReferer: string | undefined = undefined;
    if(referer){
        const refererUrl = new URL(referer);
        langInReferer = locales.find(locales => refererUrl.pathname.startsWith(`/${locales}`));
    }

    if(langInReferer){
        response.cookies.set(CookiesKey.i18next, langInReferer);
    }else {
        response.cookies.set(CookiesKey.i18next, langFromPathname);
    }

    return response;
}

export async function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname",request.nextUrl.pathname);
    let response = NextResponse.next({
        request:{
            headers: requestHeaders
        },
    });

    response = checkLocal(request, response);
    return response;

}