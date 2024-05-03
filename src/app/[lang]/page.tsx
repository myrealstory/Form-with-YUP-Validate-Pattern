import Image from "next/image";
import BG from "@/images/PinBG.jpg"
import { Information } from "@/component/form/Information";
import { FormContent } from "@/component/form/FormContent";
import "./globals.css";
import { LocaleKeysType, locales } from "../i18n";

export async function generateStaticParams(){
  const lang = locales[0];
  return [{lang}];
}


export default async function Home({params}: {params:{lang: LocaleKeysType}}) {
  const {lang} = params;
  return (
    <div>
      <div className="w-full md:h-[300px] h-[150px]">
        <Image
          src={BG}
          alt="Picture of the author"
          width={0}
          height={0}
          sizes="100wv"
          className="object-cover object-center w-full h-full"
        />
      </div>
      <div className="formContainer md:py-20 py-8 lg:px-28 md:px-20 px-8 gap-20">
          <div className=" bg-primaryGold05 rounded-3xl md:py-[70px] md:px-[60px] py-8 px-5 shadow-[10px_0_10px_3px_rgba(0,0,0,0.06)]">
            <FormContent lang={lang}/>
          </div>
          <Information/>
      </div>
    </div>
  );
}
