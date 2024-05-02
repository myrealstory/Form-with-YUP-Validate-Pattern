
import React from 'react';
import Images from "next/image";
import logo from "@/images/LOGO02-01.png";
import shoppingCart from "@/images/cart-shopping-solid.png";
import accountIcon from "@/images/circle-user-solid.png";
import gitHubIcon from "@/images/github.png";
import { MenuBtn } from './MenuBtn';

export const Header = () => {

    return (
        <div className="sticky top-0 left-0 w-full px-6 py-3 bg-primaryGold05 ">
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
                
                <div className='h-[60px] w-auto flex gap-6 items-center'>
                    <button className='w-6 h-auto lg:block hidden'>
                        <Images
                            src={shoppingCart}
                            width={0}
                            height={0}
                            alt='shoppingCart'
                            sizes='100wv'
                            className='object-contain w-full h-full'
                            />
                    </button>  
                    <button className='h-auto w-6 lg:block hidden'>
                        <Images
                            src={accountIcon}
                            width={0}
                            height={0}
                            alt='userIcon'
                            sizes='100wv'
                            className='object-contain w-full h-full'
                        />
                    </button>
                    <button className='h-auto w-6 lg:block hidden'>
                        <Images
                            src={gitHubIcon}
                            width={0}
                            height={0}
                            alt='gitHubIcon'
                            sizes='100wv'
                            className='object-contain w-full h-full'
                        />
                    </button>
                   <MenuBtn containerClass={"h-full flex items-center"}/>
                        
                </div>
            </div>
        </div>
    )
}
