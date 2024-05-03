import Image from "next/image";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";

import checkIcon from "@/images/icons/check-solid.png";
import warningIcon from "@/images/icons/triangle-exclamation-solid.png";
import { CustomInputType } from "@/types/componentTypes";

import "./CustomInput.css";

export const CustomInput = ({
  id,
  name,
  disabled,
  label,
  type,
  placeholder,
  hasError = false,
  error,
  outerMessageContainer,
  // errorMessageContainer,
  handleChange,
  value,
  onKeyDown,
  leftComponent,
  rightComponent,
  maxLength,
  pattern,
  onBlur,
  containerClasses,
  remainLabelHeight,
  successMessage,
  errorImg,
  labelClasses,
  textClasses,
  disabledTextClasses,
  path,
  onInput,
  inputRef,
}: CustomInputType) => {
  const leftDivRef = useRef<HTMLDivElement>(null);
  const rightDivRef = useRef<HTMLDivElement>(null);
  const [leftPadding, setLeftPadding] = useState<number | undefined>(undefined);
  const [rightPadding, setRightPadding] = useState<number | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(!!value);
  }, [value]);

  useLayoutEffect(() => {
    if (leftDivRef.current) {
      let pr = 0;
      const taregtEle = leftDivRef.current?.childNodes[0];
      if (taregtEle) {
        pr = (taregtEle as Element).getBoundingClientRect().width;
      }
      setLeftPadding(pr);
    }
  }, []);

  useLayoutEffect(() => {
    if (rightDivRef.current) {
      let pr = 0;
      const taregtEle = rightDivRef.current?.childNodes[0];
      if (taregtEle) {
        pr = (taregtEle as Element).getBoundingClientRect().width;
      }
      setRightPadding(pr);
    }
  }, []);

  return (
    <div className={`relative flex w-full flex-col ${containerClasses}`}>
      {" "}
      {label && label?.length > 0 ? (
        <label
          className={`${id === "promoCodeInput" ? "mb-4" : "mb-2"} text-xl font-semibold md:text-lg ${labelClasses}`}
        >
          {label}
        </label>
      ) : null}
      {remainLabelHeight ? <div className={`md:mb-2 text-lg ${labelClasses}`}>&#160;</div> : null}
      <div className="relative flex items-center">
        {leftComponent !== undefined && <div ref={leftDivRef}>{leftComponent()}</div>}
        <input
          onClick={e => e.stopPropagation()}
          id={id}
          name={name}
          pattern={pattern}
          disabled={disabled}
          type={type.toLocaleLowerCase()}
          onWheel={e => {
            if (type === "NUMBER" || type === "TEL") {
              (e.target as HTMLElement).blur();
            }
          }}
          maxLength={maxLength}
          className={`h-[50px] w-full rounded-full border 
          px-5 py-[12px] text-md font-semibold text-primaryDark outline-none  placeholder:font-normal
          placeholder:text-primaryGold placeholder:text-opacity-50 focus:border-none focus:outline-none focus:ring-2 focus:ring-primaryGold md:h-[45px] ${
            path === "add-cards" ? "pl-8" : id === "promoCodeInput" ? "pl-6" : "md:pl-8 md:pr-9"
          }  md:py-0 
          md:text-lg lg:h-[50px] 2xl:h-[50px]
          ${hasError && id !== "checkout-cvv" ? "border-primaryPurple" : "border-primaryGold"}
          ${textClasses}
          ${disabled ? `${disabledTextClasses ? disabledTextClasses : "bg-transparent opacity-50"}` : "bg-transparent"}
          `}
          style={{
            paddingLeft: leftPadding ?? undefined,
            paddingRight: rightPadding ?? undefined,
          }}
          placeholder={placeholder}
          value={value ? value : ""}
          onChange={handleChange}
          onInput={onInput}
          onKeyDown={onKeyDown}
          onBlur={e => {
            onBlur && onBlur(e);
          }}
          ref={inputRef}
        />
        {rightComponent !== undefined ? (
          <div ref={rightDivRef}>{rightComponent()}</div>
        ) : (
          <>
            <Image
              src={checkIcon}
              alt=""
              sizes="100vw"
              width={0}
              height={0}
              className={`absolute right-5 top-1/2 -translate-y-1/2 md:right-6 ${
                !hasError && value && isEditing ? "block" : "hidden"
              } h-auto w-[12px] cursor-default md:w-[18px]`}
            />
            <Image
              src={warningIcon}
              alt=""
              className={`absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 md:right-6 ${
                hasError ? "block" : "hidden"
              } h-auto w-[20px] cursor-default  md:w-[23px]`}
              width={0}
              height={0}
              sizes="100vw"
            />
          </>
        )}
      </div>
      {hasError && error && (
        <div
          className={`flex items-center ${
            outerMessageContainer && outerMessageContainer.length > 0 ? outerMessageContainer : "mt-1"
          } ml-4`}
        >
          {errorImg && <Image src={errorImg} alt="" className={"mr-[0.1rem] mt-[2px] block h-auto w-5"} />}
          <p className={`${!errorImg ? "ml-4" : "ml-1"} mt-1 text-lg font-semibold text-primaryPurple lg:text-md`}>{error}</p>
        </div>
      )}
      {successMessage && (
        <div
          className={`flex items-center ${
            outerMessageContainer && outerMessageContainer?.length > 0 ? outerMessageContainer : "mt-1"
          } ml-4`}
        >
          <p className={"mt-2 text-md font-semibold text-primaryGold md:text-lg md:leading-5"}>{successMessage}</p>
        </div>
      )}
    </div>
  );
};
