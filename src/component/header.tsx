
import React from 'react';
import Images from "next/image";
import logo from "@/images/LOGO02-01.png";

export const Header = () => {
    return (
        <div className="sticky top-0 left-0 w-full px-6 py-3 bg-lightGrey ">
            <div className='flex justify-between items-center w-full h-[60px]'>
                <div className='h-full w-auto'>
                    <Images 
                        src={logo}
                        width={0}
                        height={0}
                        alt="logo"
                        sizes='100wv'
                        className='object-contain w-full h-full' 
                    />
                        
                </div>
            </div>
        </div>
    )
}