"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface ChipProps {
  unSelectAble?: boolean;
  items: {
    label: string;
    code: string | boolean | undefined;
    isIconButton?: boolean;
    iconSrc?: string | StaticImport;
    buttonStyle?: string;
    disabled?: boolean;
  }[];
  onClick: (...params: any) => any;
  value?: string | boolean;
  hasError?: boolean;
  error?: string;
}

export const CustomChip = ({ unSelectAble, items, onClick, value, hasError, error }: ChipProps) => {
  const [selectedValue, setSelectedValue] = useState<string | boolean | undefined>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex gap-4">
        {items.map((item, index) => {
          if (item.code === undefined) {
            return null;
          }

          return (
            <div
              className={`border border-primaryGold text-lg  text-primaryGold  xl:text-lg flex cursor-pointer items-center justify-center
              ${item.disabled ? "opacity-50" : ""}
              ${selectedValue === item.code && "chip-Selected text-white"}
              ${hasError ? "border-primaryPurple" : "border-primaryGold"}
              ${item.buttonStyle}
              `}
              key={`${index}-${item.code}`}
              aria-label={item.label}
              onClick={() => {
                if (item.disabled) {
                  return;
                }
                let newValue: boolean | string | undefined = item.code;
                if (unSelectAble && item.code === selectedValue) {
                  newValue = undefined;
                }

                onClick && onClick(newValue);
                setSelectedValue(newValue);
              }}
            >
              {item.isIconButton && item.iconSrc ? (
                <Image
                  src={item.iconSrc}
                  width={0}
                  height={0}
                  alt="Gender Icon"
                  className={`block h-auto ${item.label === "male" ? "w-[10px]" : "w-[14px]"} self-center`}
                />
              ) : (
                item.label
              )}
            </div>
          );
        })}
      </div>
      {hasError && error && error?.length > 0 && (
        <span className={"mt-2 text-md font-semibold text-primaryPurple"}>{error}</span>
      )}
    </div>
  );
};
