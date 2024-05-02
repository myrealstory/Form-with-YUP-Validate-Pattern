"use client";

import { v4 as uuidv4 } from "uuid";
import Image, { StaticImageData } from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";
import "@/style/scrollBar/scrollBar.css";
import { useComponentLostFocus } from "@/hook/useComponentLostFocus";
import { useWindowSize } from "./commonUtils";


export type DropDownOptionsType = {
  label: string;
  code: string | undefined;
}[];

type RevampedSelectType = {
  items: {
    label: string;
    code: string | number | undefined | null;
    defaultLabel?: string | undefined | null;
  }[];
  onChange?: (...params: any) => any;
  disabled?: boolean;
  value?: string | number | undefined;
  hasError?: boolean;
  error?: string;
  forceDisplay?: boolean;
  overflowHidden?: boolean;
  dropdownIcon: StaticImageData | string;
}

export const CustomSelect = ({
  items,
  onChange,
  disabled,
  value,
  hasError,
  error,
  forceDisplay,
  overflowHidden,
  dropdownIcon,
}: RevampedSelectType) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isDisplayDropDown, setIsDisplayDropDown] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | number | undefined | null>(value);
  const { width } = useWindowSize();
  const isMobileView = width < 768;

  const id = useMemo(() => uuidv4(), []);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    const dropdown = document.getElementById(`dropdown_${id}`);
    const dropdownContainer = document.getElementById(`dropdownContainer_${id}`);
    if (isDisplayDropDown && dropdownContainer && dropdown && window) {
      // in pixel, like padding / margin
      const factor = 30;
      const screenHeight = window.innerHeight;
      const elementViewport = dropdown.getBoundingClientRect();
      const dropdownContainerViewport = dropdownContainer.getBoundingClientRect();
      const isOutOfScreen = screenHeight - elementViewport.y - elementViewport.height - factor <= 0;
      if (isOutOfScreen) {
        dropdown.style.removeProperty("top");
        dropdown.style.bottom = `${dropdownContainerViewport.height + 10}px`;
      } else {
        dropdown.style.removeProperty("bottom");
        dropdown.style.top = "60px";
      }
    }

    if (!isDisplayDropDown && dropdown) {
      dropdown.style.removeProperty("bottom");
      dropdown.style.removeProperty("top");
    }
  }, [isDisplayDropDown, items]);

  useComponentLostFocus(
    wrapperRef,
    () => {
      if (isDisplayDropDown) {
        setIsDisplayDropDown(false);
        onChange && onChange(selectedValue);
      }
    },
    [isDisplayDropDown]
  );

  const renderSelectedLabel = () => {
    const found = items?.find(item => item.code === value ?? item.code === selectedValue);

    if (found) {
      return found.label;
    }
    return forceDisplay ? selectedValue :"error";
  };

  return (
    <>
      <div className={"relative flex w-full flex-col"} ref={wrapperRef}>
        <div
          id={`dropdownContainer_${id}`}
          onClick={() => !disabled && setIsDisplayDropDown(!isDisplayDropDown)}
          className={`item-center flex h-[50px] w-full justify-between rounded-full border px-2 py-3
          ${disabled ? "bg-[#DDD7CE]" : "cursor-pointer"}
          ${hasError ? "border-primaryPurple" : "border-primaryGold"}
          ${overflowHidden && selectedValue !== undefined ? "max-w-[100%]" : ""}
          `}
        >
          <span
            className={` flex items-center pl-4 pt-[2px] leading-5 
            ${
              selectedValue !== undefined
                ? disabled
                  ? "font-semibold text-primaryGold"
                  : "font-semibold text-primaryDark"
                : "text-lg font-medium  text-primaryGold/40"
            }
            ${overflowHidden && selectedValue !== undefined ? "max-w-[80%]" : ""}
            `}
          >
            <div className={`${overflowHidden && selectedValue !== undefined ? "whitespace-nowrap overflow-hidden text-ellipsis" : ""}`}>
              {renderSelectedLabel()}
            </div>
          </span>
          <Image
            src={dropdownIcon}
            width={0}
            height={0}
            alt="Click to dropdown list"
            className={`mr-3 h-auto w-4 ${isDisplayDropDown ? "rotate-180" : "rotate-0"}`}
          />
        </div>
        <ul
          id={`dropdown_${id}`}
          style={{ display: isDisplayDropDown ? "block" : "none" }}
          className={`select-scrollbar absolute ${!isMobileView ? "z-[999]" : "z-40"} flex ${!isMobileView ? "max-h-fit" : "max-h-[188px]"} w-full flex-col gap-1 overflow-y-scroll rounded-b-[20px] border 
          border-none bg-white shadow-lg`}
        >
          {items &&
            items.map((item, index) => {
              // skip if code === undefined
              if (!item.code && !item?.defaultLabel) {
                return null;
              }

              return (
                <li
                  key={`${item}-${index}`}
                  className={
                    "flex h-[47px] cursor-pointer items-center border-b-[0.2px] border-lightGrey border-opacity-[50%] bg-opacity-25 px-5 py-[8px] hover:bg-primaryGold05                    "
                  }
                  onClick={() => {
                    onChange && onChange(item.code);
                    setSelectedValue(item.code);
                    setIsDisplayDropDown(false);
                  }}
                >
                  <span className="text-lg leading-5 lg:text-md">{item.label}</span>
                </li>
              );
            })}
        </ul>
        {hasError && error && error?.length > 0 && (
          <span className={"mt-1 text-lg font-semibold text-primaryPurple ml-4 lg:text-md"}>{error}</span>
        )}
      </div>
    </>
  );
};
