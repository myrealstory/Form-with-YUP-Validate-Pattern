import Image from "next/image";
import BG from "@/images/PinBG.jpg"
import { Information } from "@/component/form/Information";

export default function Home() {
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
          <div className=" bg-primaryGold05 rounded-3xl md:py-[70px] md:px-[60px] py-8 px-5">
            
          </div>
          <Information/>
      </div>
    </div>
  );
}
