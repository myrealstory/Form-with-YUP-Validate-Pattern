"use client";

import UploadFile from "@/images/upload-solid.png";
import Delete from "@/images/trash-can-solid.png";
import Image from "next/image";
import { ChangeEvent, useState, MouseEvent } from "react";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType, defaultLocale } from "@/app/i18n";
import moment from "moment";
import Warning from "@/images/icons/triangle-exclamation-solid.png";

interface ImageProps {
  onImageUpload: (files: File | undefined) => void;
  onDelete?: (...params: any) => any;
  lang?: LocaleKeysType;
  hasError?: boolean;
  error?: string;
  containerClasses?: string;
}

export const Upload = ({ onImageUpload, lang, onDelete, hasError, error, containerClasses }: ImageProps) => {
  const { translate } = useTranslation(lang as LocaleKeysType);
  const [imageTitle, setImageTitle] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) {
      onImageUpload(undefined);
      setFile(undefined);
      return;
    }

    // const imageFormat = file.name.split(".").pop();
    // const imageTitle = file.name;
    // const title = `${imageTitle}.${imageFormat}`;
    onImageUpload(file);
    setFile(file);
    setImageTitle(file.name);
  };

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // setImageTitle("");
    setFile(undefined);
    onDelete && onDelete();
  };

  return (
    <div className={`flex flex-col gap-1 md:pb-4 ${containerClasses}`}>
      <div>
        <h3 className="text-md font-semibold leading-4 md:text-lg lg:text-primaryGold">
          {translate("contactUs.attachment")}
        </h3>
        <span className="text-md leading-8 text-primaryMine">{translate("contactUs.fileRemarks")}</span>
      </div>
      <div className={`${file && imageTitle !== "" && "flex"}`}>
        <input
          key={`${file?.name ?? ""}${moment()}`}
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleImageUpload}
          name="imageUrl"
          accept="image/png, image/jpg, image/jpeg"
        />
        <label
          htmlFor="file-upload"
          className="text-slate-500  bg-pink-50 text-pink-700 hover:bg-pink-100 mr-4 flex h-[50px] w-full   cursor-pointer  items-center justify-center gap-3 rounded-full
            border-[1px] border-primaryGold px-4 py-3
            text-center text-lg font-medium text-primaryGold"
        >
          {file && imageTitle !== "" ? (
            <Image
              src={UploadFile}
              width={30}
              height={30}
              alt="Your file has been uploaded"
              className="h-auto w-[20px] self-center"
            />
          ) : null}
          <span className="text-ellipsis whitespace-nowrap overflow-hidden max-w-[250px] xl:max-w-[300px] 2xl:max-w-[330px]">{file && imageTitle !== "" ? imageTitle : `${translate("contactUs.upload")}`}</span>
        </label>
        {file && file.name !== "" && (
          <button onClick={handleDelete}>
            <Image
              src={Delete}
              width={30}
              height={30}
              alt="Click here to delete image"
              className="h-auto w-[30px] self-center"
            />
          </button>
        )}
      </div>
      {hasError && error?.length && (
        <div className="inline-block pl-[20px]">
          <Image
              src={Warning}
              width={30}
              height={30}
              alt="Invalid mobile number, please try again"
              className={`otpFormErrorMsg mt-[-3px] inline-block h-auto ${
                lang === defaultLocale ? "w-[15px]" : "w-[14px]"
              } md:mr-[0.2rem]`}
            />
          <span className="text-primary text-md font-semibold leading-5 text-primaryPurple">{error}</span>
        </div>
      )}
    </div>
  );
};
