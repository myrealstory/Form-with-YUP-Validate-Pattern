"use client";
import react from 'react';
import { usePathname } from 'next/navigation';
import { getLangFromString } from '../commonUtils';
import { useTranslation } from '@/app/i18n/client';
import Image, { StaticImageData } from 'next/image';
import emailIcon from "@/images/icons/Email.png";
import phoneIcon from "@/images/icons/Phone.png";
import locationIcon from "@/images/icons/Location.png";

interface InfoFormatContentProps {
    Icon: StaticImageData;
    title: string;
    content: string;
    remark?: string;
    email?: boolean;
    phone?: boolean;
    location?: boolean;
}

const InfoFormatContent = ({Icon, title, content, remark,email,phone,location}:InfoFormatContentProps) => {
    return (
        <div className='flex'>
                    <div className='w-6 h-auto aspect-square'>
                        <Image 
                            src={Icon} 
                            alt={`Icons${title}`}
                            width={0}
                            height={0}
                            sizes='100vw'
                            className='w-full h-auto object-contain'
                        />
                    </div>
                    <div className='pl-4 box-content max-w-[90%]'>
                        <p className='mb-3 lg:text-[25px] lg:leading-[25px] text-xl font-semibold'>{title}</p>
                        <a 
                            href={`${email? "mailto:miyokono543@gmail.com": phone? `tel:${content}`: location? `https://maps.app.goo.gl/hGzX7SLK5BQ6Fdzf8`: ''}`}
                            target='_blank'
                            className={`text-primaryGold ${email? "underline":""} mb-1 md:text-[25px] text-xl`}
                            >
                            {content}
                        </a>
                        <p className='text-lightGrey font-semibold md:text-lg text-md '>{remark}</p>
                    </div>
        </div>
    );
}

export const Information = () => {

    const path = usePathname();
    const lang = getLangFromString(path);
    const { translate } = useTranslation(lang);

    return (
        <div>
            <h5 className="lg:text-[1.6rem] lg:leading-[2.5rem] font-medium lg:mb-8 mb-5">{translate("form.title")}</h5>
            <div className='flex flex-col lg:gap-[48px] gap-6'>
                <InfoFormatContent
                    Icon={emailIcon}
                    title={translate("form.email")}
                    content={"miyokono543@gmail.com"}
                    remark={translate("form.general")}
                    email
                />
                <InfoFormatContent
                    Icon={phoneIcon}
                    title={translate("form.hotline")}
                    content={"+886 955747048"}
                    remark={translate("form.hotlineContent")}
                    phone
                />
                <InfoFormatContent
                    Icon={locationIcon}
                    title={translate("form.address")}
                    content={translate("form.addressContent")}
                    location
                />
            </div>
        </div>
    )
}