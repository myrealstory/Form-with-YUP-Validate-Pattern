import { LocaleKeysType } from "@/app/i18n";
import { StaticImageData } from "next/image";

export type TypeOfCustomInputType = "TEXT" | "NUMBER" | "OPTION" | "EMAIL" | "TEL";

export type CustomInputType = {
    id?: string;
    errorImg?: StaticImageData | string;
    name?: string;
    disabled?: boolean;
    label?: string;
    type: TypeOfCustomInputType;
    placeholder: string;
    hasError: boolean;
    error?: string | undefined;
    outerMessageContainer?: string;
    errorMessageContainer?: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string | number | null | undefined;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    leftComponent?: () => JSX.Element | null;
    rightComponent?: () => JSX.Element | null;
    maxLength?: number;
    pattern?: string;
    onBlur?: (...params: any) => any;
    containerClasses?: string;
    remainLabelHeight?: boolean;
    onWheel?: (event: React.WheelEventHandler<HTMLInputElement>) => void;
    successMessage?: string;
    labelClasses?: string;
    textClasses?: string;
    disabledTextClasses?: string;
    path?: string;
    onInput?: React.FormEventHandler<HTMLInputElement>;
    inputRef?: React.RefObject<HTMLInputElement>;
  };

  export type FormValueType = {
    firstName: string;
    lastName: string;
    email: string;
    title:string | undefined;
    typeofEnquiry: string | undefined;
    countryCode: "886";
    recaptcha: string | undefined;
    message: string;
    phone: string | undefined;
  }

  export type OptionalFormValueType = {
    orderReceipt : string | undefined;
    memberNumber: string | undefined;
    attachemnt: File | undefined;
  }

export type FormErrorType = {
  [key in keyof (FormValueType & OptionalFormValueType)]: string | false | undefined;
};

export type ContactUsFormInputType = {
  title: string;
  givenName: string;
  familyName: string;
  email: string;
  mobileNumber?: string;
  memberNumber?: string;
  orderNumber?: string;
  type: string;
  message: string;
  image?: File;
  lang: LocaleKeysType;
};

export interface CustomMessageProps {
  name: string;
  id: string;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (...params: any) => any;
  hasError?: boolean;
  error?: string;
  containerClasses?: string;
  textContainerClasses?: string;
  outerMessageContainer?: string;
  label?: string;
  labelClasses?: string;
  placeholder: string;
  value: string | number | null | undefined;
  rows: number;
  cols: number;
}

