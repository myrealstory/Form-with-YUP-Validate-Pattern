"use client";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import react from "react";

interface MenuBtnProps {
    containerClass: string;
    lang: LocaleKeysType;
}

interface MenuBtnContentsProps {
    id: number;
    title: string;
    link: string;
    disabled: boolean;
}

const MenuBtnContents:MenuBtnContentsProps[] = [
    {
      id: 1,
      title: "home",
      link: "/",
      disabled: true,
    },
    {
      id: 2,
      title: "aboutUs",
      link: "/",
      disabled: true
    },
    {
      id: 3,
      title: "promotion",
      link: "/",
      disabled: true
    },
    {
      id: 4,
      title: "store",
      link: "/",
      disabled: true
    },
    {
      id: 5,
      title: "contactUs",
      link: "/",
      disabled: true
    },
    {
      id: 6,
      title: "member",
      link: "/",
      disabled: true
    },
    {
      id: 7,
      title: "reservation",
      link: "/",
      disabled: true
    },
    {
      id: 8,
      title: "faq",
      link: "/",
      disabled: true
    }
  ]

export const MenuBtn = ({containerClass, lang}:MenuBtnProps) => {
    const [trigger, setTrigger] = react.useState(false);
    const [hover, setHover] = react.useState<number | null>(null);
    const {translate : t } =useTranslation(lang); 

    const handleMouseEnter = (index: number) => {
        setHover(index);
    }
    const handleMouseLeave = () => {
        setHover(null);
    }

    const handleClick = () => {
        setTrigger(!trigger);
    }

    return (
        <div className={containerClass}>
            <button 
                className={`lg:w-6 w-10 h-auto aspect-square ${trigger?"bg-primaryGold2":"bg-black"} rounded-full relative flex items-center justify-center border-black border-solid border duration-300 z-[999]`}
                onClick={handleClick}
                >
                <p className={`h-[2px] w-[60%] rounded-full relative duration-300 ${trigger? "bg-transparent after:bg-black before:bg-black after:top-0 before:top-0 after:w-full before:w-full after:left-0 before:left-0 after:rotate-45 before:-rotate-45 ":"bg-white after:w-[80%] after:bg-white md:after:-top-1 after:-top-2 after:left-1/2 after:-translate-x-1/2 before:top-2 md:before:top-1 before:left-1/2 before:-translate-x-1/2 before:bg-white before:w-[80%]"} after:h-[2px] after:absolute  before:h-[2px]  before:absolute before:origin-center after:origin-center after:duration-300 before:duration-300`}/>
            </button>
            <div className={`h-[100vh] md:w-[300px] w-full bg-primaryGold4 fixed top-0 ${trigger?"translate-x-0":"translate-x-[500px]"} transform duration-300 right-0 z-[990] pt-20 lg:pt-[8rem]`}>
                {MenuBtnContents.map((item) =>{
                    return (
                        <div
                            key={item.id}
                            onMouseEnter={()=>handleMouseEnter(item.id)}
                            onFocus={()=>handleMouseEnter(item.id)}
                            onMouseLeave={handleMouseLeave}
                            onBlur={handleMouseLeave}
                            className="md:h-[60px] h-[80px] w-full"
                        >
                            <div
                                className={`${item.disabled === true && hover === item.id? "-rotate-x-90 h-0":"rotate-x-0 h-full"}  
                                duration-150 origin-top text-lg bg-primaryGold4 text-primaryDark text-center flex items-center justify-center  w-full `}
                            >
                                {t(`form.menuBtn.${item.title}`)}
                            </div>
                            {
                                item.disabled === true && (
                                    <div
                                        className={`${hover === item.id ? "rotate-x-0 h-full":"-rotate-x-90 h-0"}  
                                        duration-150 origin-top text-lg text-white bg-primaryGold text-center flex items-center justify-center h-full w-full `}
                                    >
                                        {item.title}
                                    </div>
                                )
                            }
                        </div>
                    )
                })
                }
            </div>

        </div>
    )
}