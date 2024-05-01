"use client";
import react, { useMemo } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { getLangFromString, isEmailValid, isNameValid, useWindowSize } from '../commonUtils';
import { usePathname } from 'next/navigation';
import { ContactFromYupType } from './validation';
import { ContactUsFormInputType, FormErrorType, FormValueType, OptionalFormValueType } from '@/types/componentTypes';
import { mixed, number, object, string } from 'yup';
import { setLoadingScreenDisplay } from '@/redux/slice/product';
import { useDispatch } from 'react-redux';

export const Headline = ({title}:{title:string}) =>{
    return (
        <div className='lg:mb-3 mb-2'>
            <p className='text-primaryGold lg:text-lg text-md font-semibold'>{title}</p>
        </div>
    );
}



export const FormContent = () => {

    const path = usePathname();
    const lang = getLangFromString(path);
    const {translate: t} =useTranslation(lang);
    const [isEditing, setIsEditing] = react.useState(false);
    const [isSubmitting, setIsSubmitting] = react.useState(false);
    const { width } = useWindowSize();
    const isMolbileView = width < 768;
    const dispatch = useDispatch();

    const titleItems = useMemo(() => {
        const commonStyle = "chipBtnWithMoreRadius";
        return [
          {
            label: t("profile.title_default"),
            code: undefined,
            buttonStyle: commonStyle,
          },
          {
            label: t("profile.title_mr"),
            code: "Mr.",
            buttonStyle: commonStyle,
          },
          {
            label: t("profile.title_mrs"),
            code: "Mrs.",
            buttonStyle: commonStyle,
          },
          {
            label: t("profile.title_ms"),
            code: "Ms.",
            buttonStyle: commonStyle,
          },
          {
            label: t("profile.title_miss"),
            code: "Miss",
            buttonStyle: commonStyle,
          },
          {
            label: t("profile.title_dr"),
            code: "Dr.",
            buttonStyle: commonStyle,
          },
          {
            label: t("profile.title_prof"),
            code: "Prof.",
            buttonStyle: commonStyle,
          },
        ];
      }, []);

      const typeofEnquiryItems = useMemo(() => {
        const commonStyle = "";
    
        return [
          {
            label: t("contactUs.typeofEnquiryOptions.- Select Enquiry Type-"),
            code: undefined,
            buttonStyle: commonStyle,
          },
          {
            label: t("contactUs.typeofEnquiryOptions.Account Login"),
            code: "ACCOUNT_LOGIN",
            buttonStyle: commonStyle,
          },
          {
            label: t("contactUs.typeofEnquiryOptions.Member Upgrade/ Renewal"),
            code: "MEMBER_UPGRADE_RENEWAL",
            buttonStyle: commonStyle,
          },
          {
            label: t("contactUs.typeofEnquiryOptions.Member Registration/ Recruitment"),
            code: "MEMBER_REGISTRATION_RECRUITMENT",
            buttonStyle: commonStyle,
          },
          {
            label: t("contactUs.typeofEnquiryOptions.Promotion/ Transactions"),
            code: "PROMOTION_TRANSACTIONS",
            buttonStyle: commonStyle,
          },
          {
            label: t("contactUs.typeofEnquiryOptions.Feedback(Order/ Service/ Food)"),
            code: "FEEDBACK",
            buttonStyle: commonStyle,
          },
          {
            label: t("contactUs.typeofEnquiryOptions.Member Account Deletion"),
            code: "MEMBER_ACCOUNT_DELETION",
            buttonStyle: commonStyle,
          },
          {
            label: t("contactUs.typeofEnquiryOptions.Others"),
            code: "OTHERS",
            buttonStyle: commonStyle,
          },
        ];
      }, []);

      const ContactFromYup: ContactFromYupType<FormErrorType>= {
        firstName: string()
        .required(t("contactUs.error.required")!)
        .test("firstName", (value,ctx)=>{
            if(!isNameValid(value)){
                return ctx.createError({message: t(`contactUs.error.${ctx.path}`)!});
            }
            return true;
        }),
        lastName: string()
        .required(t("contactUs.error.required")!)
        .test("lastName", (value,ctx)=>{
            if(!isNameValid(value)){
                return ctx.createError({message: t(`contactUs.error.${ctx.path}`)!});
            }
            return true;
        }),
        email: string()
        .required(t("contactUs.error.required")!)
        .test("email",(value,ctx) =>{
            if(!isEmailValid(value)){
                return ctx.createError({message: t(`contactUs.error.email`)! });
            }
            return true;
        }),
        title: string().required(t("contactUs.error.required")!),
        typeofEnquiry: string().required(t("contactUs.error.required")!),
        countryCode: string().required(t("contactUs.error.required")!),
        recaptcha: string().required(t("contactUs.error.required")!),
        message: string().required(t("contactUs.error.required")!),
        phone: string().required(t("contactUs.error.required")!)
        .test("phone", (value,ctx)=>{
            if(value && formValue.countryCode === "886" && value.length !== 9){
                return ctx.createError({message: t(`contactUs.error.phone`)!});
            }
            return true;
        }),
        orderReceipt: number()
            .transform((value, originalValue)=>{
                const numValue = Number(originalValue);
                return typeof originalValue === "string" && 
                !isNaN(numValue) &&
                (originalValue.length === 8 ||
                originalValue.length === 10 )
                ? numValue : 
                originalValue === 0
                ? undefined :
                numValue;
            })
            .test("orderReceipt", (value,ctx)=>{
                if(value === undefined){
                    return true;
                }

                const valueStr = value.toString();
                return valueStr.length === 8 || valueStr.length === 10 ?
                true :
                ctx.createError({message: t(`contactUs.error.orderReceipt`)!});
        }),
        memberNumber: string().test("memberNumber", (value,ctx)=>{
            if(
                (ctx.parent.typeofEnquiry === 
                    "MEMBER_ACCOUNT_DELETION" ||
                    formValue.typeofEnquiry === 
                    "MEMBER_ACCOUNT_DELETION") &&
                    (!value || value.trim().length === 0)
                ){
                    return ctx.createError({message: t(`contactUs.error.required`)!});
                }
                if(!value || (value && (value.length === 0 || value.length === 10))){
                    return true;
                }

                return ctx.createError({message: t(`contactUs.error.memberNumMSG`)! });
        }),
        attachemnt: mixed<File>().test("attachemnt", (value,ctx)=>{
            const maxSizeOfImage = 4 * 1000 * 1000;
            const allowFormatOfImage = ["image/jpg","image.jpeg","image/png"];
            if(!value){
                return true;
            }

            if(value && value.size > maxSizeOfImage){
                return ctx.createError({message: t(`contactUs.error.fileExceedMsg`)!});
            }else if(value && !allowFormatOfImage.includes(value.type)){
                return ctx.createError({message: t(`contactUs.error.fileRemarks`)!});
            }

            return true;
        }),
    };

    const [formValue, setFormValue] = react.useState<FormValueType>({
        title: undefined,
        firstName: "",
        lastName: "",
        email: "",
        phone: undefined,
        countryCode: "886",
        typeofEnquiry: undefined,
        recaptcha: "",
        message: "",
    });
    const [optionalFormValue, setOptionalFormValue] = react.useState<OptionalFormValueType>({
        orderReceipt: undefined,
        memberNumber: "",
        attachemnt: undefined,
    });

    const [formError, setFormError] = react.useState<FormErrorType>({
        title: undefined,
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        phone: undefined,
        countryCode: undefined,
        typeofEnquiry: undefined,
        recaptcha: undefined,
        message: undefined,

        // optional = false by default
        orderReceipt: false,
        memberNumber: false,
        attachemnt: false,
    });

    // for if profile exist then fill the form
    // useEffect(() => {
    //     if (isAlreadyLogin && profileData) {
    //       setFormValue({
    //         ...formValue,
    //         title: profileData.title,
    //         firstName: profileData.firstName,
    //         lastName: profileData.lastName,
    //         email: profileData.email,
    //         countryCode: profileData.countryCode as "852" | "853" | "86",
    //         mobile: profileData.countryCode === "852" ? profileData.mobile : undefined,
    //       });
    
    //       setOptionalFormValue({
    //         ...optionalFormValue,
    //         memberNumber: profileData.memberNo,
    //       });
    
    //       onBlurValidation({
    //         title: profileData.title,
    //         firstName: profileData.firstName,
    //         lastName: profileData.lastName,
    //         email: profileData.email,
    //         mobile: profileData.countryCode === "852" ? profileData.mobile : undefined,
    //         memberNumber: profileData.memberNo,
    //         countryCode: profileData.countryCode as "852" | "853" | "86",
    //       });
    
    //       setIsEditing(false);
    //     } else {
    //       onBlurValidation({
    //         countryCode: formValue.countryCode as "852" | "853" | "86",
    //       });
    //     }
    //   }, [isAlreadyLogin, profileData]);

    const onBlurValidation = (formData: {[key in keyof FormErrorType]?: any;}, callback?: (formError: FormErrorType)=> any) =>{

        setIsEditing(true);

        const newErrorObject: FormErrorType = formError;

        Object.entries(formData).forEach(([key, value])=>{
            const field = key as keyof FormErrorType;
            const schema = object({
                [field]: ContactFromYup[field],
            });
            schema.validate({[field]: value})
            .then(()=>{
                newErrorObject[field] = false;
            })
            .catch((error: any) =>{
                const path = error.path as keyof FormErrorType;
                newErrorObject[path] = error.message;
            })
            .finally(()=>{
                setFormError({
                    ...formError,
                    ...newErrorObject,
                });
                callback && callback({
                    ...formError,
                    ...newErrorObject,
                });
            });
        });
    };

    const isOrderReceiptNeeded = (typeofEnquiry: string | undefined) =>{
        if(!typeofEnquiry){
            return false;
        }
        return !!["MEMBER_REGISTRATION_RECRUITMENT","MEMBER_UPGRADE_RENEWAL","PROMOTION_TRANSACTIONS", "OTHERS"].find(
            type => type === typeofEnquiry
        );
    };

    const shouldInputOrderReceipt = useMemo(()=>{
        return isOrderReceiptNeeded(formValue.typeofEnquiry);
    },[formValue]);

    const isFormValid = useMemo(()=>{
        return (
            isEditing &&
            Object.values(formError).filter(error => error === false).length === Object.keys(formError).length
        )
    },[formError, isEditing])

    const onSubmit = async() =>{
        if(!isFormValid){
            onBlurValidation({
                ...formValue,
                ...optionalFormValue,
            })
            return ;
        }

        const payload: ContactUsFormInputType = {
            title: formValue.title!,
            givenName: formValue.firstName,
            familyName: formValue.lastName,
            email: formValue.email,
            mobileNumber: formValue.phone,
            memberNumber: optionalFormValue.memberNumber,
            orderNumber: optionalFormValue.orderReceipt?.toString(),
            type: formValue.typeofEnquiry!,
            message: formValue.message,
            image: optionalFormValue.attachemnt,
            lang,
        }

        dispatch(setLoadingScreenDisplay(true));
        setIsSubmitting(true);

        const formData = new FormData();
        Object.entries(payload).forEach(([key, value])=>{
            formData.append(key, value);
        });

        try {
            const response = await fetch("/api/submitForm", {
                method: "POST",
                body: formData,
            });

            if(response.ok){
                const result = await response.json();
                if(result.success){
                    console.log("success:", result);
                    alert("Form submitted successfully!");
                }else {
                    throw new Error("Failed to Submit form :",result.message);
                }
            }
        }catch (error) {
            console.error(error);
            if(error instanceof Error)
                alert("Failed to Submit form" + error.message);
        } finally {
            dispatch(setLoadingScreenDisplay(false));
            setIsSubmitting(false);
        }
    };


    
    
    return (
        <div>
            <h5 className='text-primaryGold font-medium md:text-[32px] md:leading-[36px] text-center md:text-left md:mb-6 mb-4'>
                {t("form.inner.topic")}
            </h5>
            <p className='text-center md:text-left md:mb-12 mb-8 lg:text-lg text-md text-primaryDark'>
                {t("form.inner.topicContent")}
            </p>

            // form content
            <Headline title={t("form.inner.title")}/>


        </div>
    );

}