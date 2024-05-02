"use client";

import { CustomMessageProps } from "@/types/componentTypes";
import { useState } from "react";

export const CustomTextArea = ({
  name,
  id,
  maxLength,
  minLength,
  required,
  handleChange,
  onBlur,
  hasError,
  error,
  containerClasses,
  textContainerClasses,
  outerMessageContainer,
  label,
  labelClasses,
  placeholder,
  value,
  rows,
  cols,
}: CustomMessageProps) => {
  const [textCount, setTextCount] = useState(0);

  return (
    <div
      className={`relative flex w-full flex-col ${
        hasError && error ? (outerMessageContainer !== undefined ? "mb-8 lg:mb-12 xl:mb-8" : "") : ""
      }
    ${containerClasses}
    `}
    >
      {label && label?.length > 0 ? (
        <label className={`mb-[.5rem] text-md font-semibold md:text-lg ${labelClasses}`}>{label}</label>
      ) : null}

      <div className="relative flex items-center">
        <textarea
          placeholder={placeholder}
          id={id}
          name={name}
          maxLength={maxLength}
          minLength={minLength}
          required={required}
          rows={rows}
          cols={cols}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            event.target.value = event.target.value.slice(0, maxLength);
            handleChange(event);
            setTextCount(event.target.value.length);
          }}
          className={`h-[160px] w-full overflow-auto rounded-3xl border border-solid border-primaryGold bg-transparent
          px-[20px] py-[15px] text-xl font-medium leading-5 text-primaryDark placeholder-primaryGold placeholder-opacity-40 placeholder:pl-[5px] placeholder:text-lg focus:border-deepPrimaryGold focus:ring-0 lg:placeholder:leading-[21px] xl:h-[300px]
          ${textContainerClasses}`}
          style={{ resize: "none" }}
          onBlur={e => {
            onBlur && onBlur(e);
          }}
          value={value ? value : ""}
        />
        <span className="absolute bottom-6 right-6 text-md font-medium text-primaryGold opacity-50">
          {textCount} / {maxLength}
        </span>
      </div>
      {hasError && error?.length && (
        <p className={"text-md font-semibold leading-4 text-primaryPurple md:leading-5"}>{error}</p>
      )}
    </div>
  );
};
