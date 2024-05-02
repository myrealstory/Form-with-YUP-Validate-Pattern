"use client";
import react from "react";

interface MenuBtnProps {
    containerClass: string;
}

export const MenuBtn = ({containerClass}:MenuBtnProps) => {
    const [trigger, setTrigger] = react.useState(false);
    const handleClick = () => {
        setTrigger(!trigger);
    }

    return (
        <div className={containerClass}>
            <button 
                className={`w-6 h-auto aspect-square ${trigger?"bg-primaryGold2":"bg-black"} rounded-full relative flex items-center justify-center border-black border-solid border duration-300 z-[999]`}
                onClick={handleClick}
                >
                <p className={`h-[2px] w-[60%] rounded-full relative duration-300 ${trigger? "bg-transparent after:bg-black before:bg-black after:top-0 before:top-0 after:w-full before:w-full after:left-0 before:left-0 after:rotate-45 before:-rotate-45 ":"bg-white after:w-[80%] after:bg-white after:-top-1 after:left-1/2 after:-translate-x-1/2 before:top-1 before:left-1/2 before:-translate-x-1/2 before:bg-white before:w-[80%]"} after:h-[2px] after:absolute  before:h-[2px]  before:absolute before:origin-center after:origin-center after:duration-300 before:duration-300`}/>
            </button>
            <div className={`h-[100vh] w-[300px] bg-primaryGold4 fixed top-0 ${trigger?"translate-x-0":"translate-x-[500px]"} transform duration-300 right-0 z-[990]`}>

            </div>

        </div>
    )
}