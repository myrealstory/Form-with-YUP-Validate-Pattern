"use client";
import {useState,useEffect, useRef} from "react";
import { usePathname } from "next/navigation";
import { LocaleKeysType, defaultLocale, locales } from "@/app/i18n";

type WindowSizeProps = {
    width: number;
    height: number;
    scrollY: number;
    isWindowReady: boolean;
    isAppear: boolean;
  };

const getLangFromString = (str: string) => {
    const regex = /\/(\w+)/g;
    const matches = str.matchAll(regex);
    let lang = defaultLocale;
    for (const match of matches) {
      if (locales.indexOf(match[1] as LocaleKeysType) > -1) {
        lang = match[1] as LocaleKeysType;
      }
    }
    return lang;
  };

  const isNameValid = (string: string) => {
    const startWithSpace = /^ /;
    const startWithSpaceMatch = string.match(startWithSpace);
    if (startWithSpaceMatch && [...startWithSpaceMatch]?.length > 0) {
      return false;
    }
  }

  const isEmailValid = (email: string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) && email?.length !== 0 && email?.length <= 100;
  };

  const useWindowSize = () => {
    const path = usePathname();
    const location = path.split("/")[2];
    const locationForMoreThanTwoFolder = path.split("/")[3];
    let isForceHiddenPage = false;
    if (location === "store-location" ||
        location === "checkout" ||
        location === "maintenance" ||
        location === "maintenance-daily" ||
        locationForMoreThanTwoFolder === "payment-in-progress" ||
        (location === "campaign" && locationForMoreThanTwoFolder === "submitted")) {  // condition copied from /src/components/BottomNavbar.tsx 
          isForceHiddenPage = true;
    }
  
    const [windowSize, setWindowSize] = useState<WindowSizeProps>({
      width: 0,
      height: 0,
      scrollY: 0,
      isWindowReady: false,
      isAppear: isForceHiddenPage ? false : true,
    });
    const lastScrollLocation = useRef<number>(0);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
    useEffect(() => {
  
      const handleScroll = () => {
  
        if (lastScrollLocation.current >= window.scrollY || window.scrollY <= 0) {  // scrolling up keep display
          setWindowSize((prevWindowSize) => ({
            ...prevWindowSize,
            scrollY: window.scrollY,
            isAppear: isForceHiddenPage ? false : true,
          }));
        } else {
          setWindowSize((prevWindowSize) => ({  // scrolling down hidd
            ...prevWindowSize,
            scrollY: window.scrollY,
            isAppear: false,
          }));
        }
        lastScrollLocation.current = window.scrollY;
  
        clearTimeout(scrollTimeoutRef.current!);
        scrollTimeoutRef.current = setTimeout(() => {  // stop scrolling display
          setWindowSize((prevWindowSize) => ({
            ...prevWindowSize,
            isAppear: isForceHiddenPage ? false : true,
          }));
        }, 200);
      };
  
      const handleSize = () => {
        if (window.visualViewport) {
          setWindowSize((prevWindowSize) => ({
            ...prevWindowSize,
            width: window?.visualViewport?.width ?? 0,
            height: window?.visualViewport?.height ?? 0,
            scrollY: window.scrollY,
            isWindowReady: true,
          }));
        }
      };
  
      if (typeof window !== "undefined") {
        window.addEventListener("resize", handleSize);
        window.addEventListener("scroll", handleScroll);
        handleSize();
  
        return () => {
          window.removeEventListener("resize", handleSize);
          window.removeEventListener("scroll", handleScroll);
          clearTimeout(scrollTimeoutRef.current!);
        };
      }
    }, []);

    return windowSize;
  };

  export {
    getLangFromString,
    useWindowSize,
    isNameValid,
    isEmailValid
  }