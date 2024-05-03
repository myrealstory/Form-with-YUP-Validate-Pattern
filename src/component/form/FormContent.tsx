"use client";
import react, { useMemo } from "react";
import { useTranslation } from "@/app/i18n/client";
import { isEmailValid, isNameValid, useWindowSize } from "../commonUtils";
import { ContactFromYupType } from "@/component/form/validation";
import { ContactUsFormInputType, FormErrorType, FormValueType, OptionalFormValueType } from "@/types/componentTypes";
import { mixed, number, object, string } from "yup";
import { setLoadingScreenDisplay } from "@/redux/slice/product";
import { useDispatch } from "react-redux";
import { CustomSelect } from "@/component/CustomSelect";
import { CustomChip } from "@/component/CustomChip";
import { CustomInput } from "@/component/CustomInput";
import dropDown from "@/images/icons/caret-down-solid.png";
import { CustomTextArea } from "@/component/CustomTextArea";
import { Upload } from "@/component/Upload";
import ReCAPTCHA from "react-google-recaptcha";
import { LocaleKeysType } from "@/app/i18n";

export const Headline = ({title}:{title:string}) =>{
    return (
        <div className="lg:mb-3 mb-2">
            <p className="text-primaryGold md:text-lg text-md font-semibold">{title}</p>
        </div>
    );
}



export const FormContent = ({lang}:{lang:LocaleKeysType}) => {

    
    const {translate: t} =useTranslation(lang);
    const [isEditing, setIsEditing] = react.useState(false);
    const [isSubmitting, setIsSubmitting] = react.useState(false);
    const { width } = useWindowSize();
    const dispatch = useDispatch();

    

    const titleItems = useMemo(() => {
        const commonStyle = "chipBtnWithMoreRadius";
        return [
          {
            label: t("form.info.title_default"),
            code: undefined,
            buttonStyle: commonStyle,
          },
          {
            label: t("form.info.mr"),
            code: "Mr.",
            buttonStyle: commonStyle,
          },
          {
            label: t("form.info.mrs"),
            code: "Mrs.",
            buttonStyle: commonStyle,
          },
          {
            label: t("form.info.ms"),
            code: "Ms.",
            buttonStyle: commonStyle,
          },
          {
            label: t("form.info.miss"),
            code: "Miss",
            buttonStyle: commonStyle,
          },
          {
            label: t("form.info.dr"),
            code: "Dr.",
            buttonStyle: commonStyle,
          },
          {
            label: t("form.info.prof"),
            code: "Prof.",
            buttonStyle: commonStyle,
          },
        ];
      }, []);

      const typeofEnquiryItems = useMemo(() => {
        const commonStyle = "";
    
        return [
          {
            label: t("form.typeofEnquiryOptions.- Select Enquiry Type-"),
            code: undefined,
            buttonStyle: commonStyle,
          },
          {
            label: t("form.typeofEnquiryOptions.Account Login"),
            code: "ACCOUNT_LOGIN",
            buttonStyle: commonStyle,
          },
          {
            label: t("form.typeofEnquiryOptions.Member Upgrade/ Renewal"),
            code: "MEMBER_UPGRADE_RENEWAL",
            buttonStyle: commonStyle,
          },
          {
            label: t("form.typeofEnquiryOptions.Member Registration/ Recruitment"),
            code: "MEMBER_REGISTRATION_RECRUITMENT",
            buttonStyle: commonStyle,
          },
          {
            label: t("form.typeofEnquiryOptions.Promotion/ Transactions"),
            code: "PROMOTION_TRANSACTIONS",
            buttonStyle: commonStyle,
          },
          {
            label: t("form.typeofEnquiryOptions.Feedback(Order/ Service/ Food)"),
            code: "FEEDBACK",
            buttonStyle: commonStyle,
          },
          {
            label: t("form.typeofEnquiryOptions.Member Account Deletion"),
            code: "MEMBER_ACCOUNT_DELETION",
            buttonStyle: commonStyle,
          },
          {
            label: t("form.typeofEnquiryOptions.Others"),
            code: "OTHERS",
            buttonStyle: commonStyle,
          },
        ];
      }, []);

      const ContactFromYup: ContactFromYupType<FormErrorType>= {
        firstName: string()
        .required(t("form.error.required")!)
        .test("firstName", t("form.error.firstName")!, value => isNameValid(value || "")),
        lastName: string()
        .required(t("form.error.required")!)
        .test("lastName", t("form.error.lastName")!, value => isNameValid(value || "")),
        email: string()
        .required(t("form.error.required")!)
        .test("email",(value,ctx) =>{
            if(!isEmailValid(value)){
                return ctx.createError({message: t("form.error.email")! });
            }
            return true;
        }),
        title: string().required(t("form.error.required")!),
        typeofEnquiry: string().required(t("form.error.required")!),
        countryCode: string().required(t("form.error.required")!),
        recaptcha: string().required(t("form.error.required")!),
        message: string().required(t("form.error.required")!),
        phone: string().required(t("form.error.required")!)
        .test("phone", (value,ctx)=>{
            if(value && formValue.countryCode === "886" && (value.length !== 9 || value[0] !== "9")){
                return ctx.createError({message: t("form.error.twMobileNumber")!});
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
                ctx.createError({message: t("form.error.orderReceipt")!});
        }),
        memberNumber: string().test("memberNumber", (value,ctx)=>{
            if(
                (ctx.parent.typeofEnquiry === 
                    "MEMBER_ACCOUNT_DELETION" ||
                    formValue.typeofEnquiry === 
                    "MEMBER_ACCOUNT_DELETION") &&
                    (!value || value.trim().length === 0)
                ){
                    return ctx.createError({message: t("form.error.required")!});
                }
                if(!value || (value && (value.length === 0 || value.length === 10))){
                    return true;
                }

                return ctx.createError({message: t("form.error.memberNumMsg")! });
        }),
        attachemnt: mixed<File>().test("attachemnt", (value,ctx)=>{
            const maxSizeOfImage = 4 * 1000 * 1000;
            const allowFormatOfImage = ["image/jpg","image.jpeg","image/png"];
            if(!value){
                return true;
            }

            if(value && value.size > maxSizeOfImage){
                return ctx.createError({message: t("form.error.fileExceedMsg")!});
            }else if(value && !allowFormatOfImage.includes(value.type)){
                return ctx.createError({message: t("form.error.fileRemarks")!});
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

    const onBlurValidation = (
        formData: {
            [key in keyof FormErrorType]?: any;
        }, 
        callback?: (formError: FormErrorType)=> any
    ) =>{

        setIsEditing(true);

        const newErrorObject: FormErrorType = formError;

        Object.entries(formData).forEach(([key, value])=>{
            const field = key as keyof FormErrorType;
            const schema = object({
                [field]: ContactFromYup[field],
            });
            schema
                .validate({[field]: value})
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

        // try {
        //     const response = await fetch(`http://localhost:3000/api/submitForm`, {
        //         method: "POST",
        //         headers:{
        //             "Content-Type": "application/json",
        //         },
        //         body: formData,
        //     });

        //     if(response.ok){
        //         const result = await response.json();
        //         if(result.success){
        //             console.log("success:", result);
        //             alert("Form submitted successfully!");
        //         }else {
        //             throw new Error("Failed to Submit form :",result.message);
        //         }
        //     }
        // }catch (error) {
        //     console.error(error);
        //     if(error instanceof Error)
        //         alert("Failed to Submit form" + error.message);
        // } finally {
        //     dispatch(setLoadingScreenDisplay(false));
        //     setIsSubmitting(false);
        // }
        try {
            const simulatedResponse = {success: true, message:"Simulated response", payload:payload};
            if(simulatedResponse.success){
                console.log("success:", simulatedResponse);
                alert("Form submitted successfully!");

                if(simulatedResponse.payload){
                    sessionStorage.setItem("contactUsForm", JSON.stringify(simulatedResponse.payload));
                }
            }else {
                throw new Error("Failed to Submit form :"+ simulatedResponse.message);
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

    const onTypeofEnquiryUpdate = (typeofEnquiry: string) =>{
        if(formValue.typeofEnquiry !== typeofEnquiry){
            setFormValue({
                ...formValue,
                typeofEnquiry,
            });
        }

        onBlurValidation({
            typeofEnquiry,
        },
            formError => {
                let memberNumberHasError: string | false | undefined = undefined;
                let orderReceiptHasError: string | false | undefined = undefined;
                const shouldCheckOrderReceipt = isOrderReceiptNeeded(typeofEnquiry);

                if(typeofEnquiry !== "MEMBER_ACCOUNT_DELETION"){
                    memberNumberHasError = false;
                }

                if(!shouldCheckOrderReceipt || !optionalFormValue.orderReceipt?.length){
                    orderReceiptHasError = false;
                }

                // update error form with multi fields
                if(typeofEnquiry === "MEMBER_ACCOUNT_DELETION"){
                    object({
                        memberNumber : ContactFromYup["memberNumber"],
                        typeofEnquiry: ContactFromYup["typeofEnquiry"],
                    })
                    .validate({
                        memberNumber: optionalFormValue.memberNumber,
                        typeofEnquiry,
                    })
                    .then(()=>{
                        memberNumberHasError = false;
                    })
                    .catch(error =>{
                        memberNumberHasError = error.message;
                    })
                    .finally(()=>{
                        setFormError({
                            ...formError,
                            memberNumber: memberNumberHasError,
                            orderReceipt: formError?.orderReceipt ?? orderReceiptHasError,
                        });
                    })
                } else {
                    onBlurValidation(
                        Object.assign(
                            {
                                mmeberNumber: optionalFormValue.memberNumber,
                            },
                            shouldCheckOrderReceipt ?
                            {
                                orderReceipt: optionalFormValue.orderReceipt,
                            }:{}
                        ),
                        ()=>{
                            if(!shouldCheckOrderReceipt){
                                setFormError({
                                    ...formError,
                                    orderReceipt: false,
                                });

                            }
                        }
                    )
                }
            }
        )
    }


    
    
    return (
        <div>
            <h5 className="text-primaryGold font-medium md:text-[32px] md:leading-[36px] text-center md:text-left md:mb-6 ">
                {t("form.inner.topic")}
            </h5>
            <p className="text-center md:text-left md:mb-12 mb-8 lg:text-lg text-md text-primaryDark">
                {t("form.inner.topicContent")}
            </p>
            <form action="" className="flex w-full flex-col gap-7">
                <div>
                    <Headline title={t("form.inner.title")}/>
                    {width < 768 ? (
                        <CustomSelect
                            items={titleItems}
                            dropdownIcon={dropDown}
                            onChange={(value)=>{
                                setFormValue({
                                    ...formValue,
                                    title: value,
                                });
                                onBlurValidation({
                                    title: value,
                                });
                            }}
                            value={formValue.title}
                            hasError={!!formError?.title}
                            error={formError?.title as string}
                        />
                    ):(
                        <CustomChip
                            items={titleItems}
                            onClick={(value)=>{
                                setFormValue({
                                    ...formValue,
                                    title: value,
                                });
                                onBlurValidation({
                                    title: value,
                                });
                            }}
                            value={formValue.title}
                            hasError={!!formError?.title}
                            error={formError?.title as string}
                        />
                    )}
                </div>
                <div className="ContactFormNameContainer ">
                    <CustomInput
                        labelClasses= "labelText"
                        label={t("form.info.contactName")}
                        type="TEXT"
                        placeholder={t("form.info.givenName")}
                        value={formValue.firstName}
                        handleChange={( event : React.ChangeEvent<HTMLInputElement>)=>{
                            setFormValue({
                                ...formValue,
                                firstName: event.target.value,
                            });
                        }}
                        hasError={!!formError?.firstName}
                        error={formError?.firstName as string}
                        onBlur={async()=>{
                            setFormValue({
                                ...formValue,
                                firstName: formValue.firstName.trim(),
                            });
                            onBlurValidation({
                                firstName: formValue.firstName.trim(),
                            });
                        }}
                        maxLength={25}
                        textClasses="lg:pr-[3.3rem]"
                    />
                    <CustomInput
                        labelClasses= "labelText"
                        remainLabelHeight
                        type="TEXT"
                        placeholder={t("form.info.birthName")}
                        value={formValue.lastName}
                        handleChange={( event : React.ChangeEvent<HTMLInputElement>)=>{
                            setFormValue({
                                ...formValue,
                                lastName: event.target.value,
                            });
                        }}
                        hasError={!!formError?.lastName}
                        error={formError?.lastName as string}
                        onBlur={async()=>{
                            setFormValue({
                                ...formValue,
                                lastName: formValue.lastName.trim(),
                            });
                            onBlurValidation({
                                lastName: formValue.lastName.trim(),
                            });
                        }}
                        maxLength={25}
                        textClasses="lg:pr-[3.3rem]"
                        />
                </div>
                <div className="">
                    <CustomInput
                        labelClasses="labelText"
                        label={t("form.info.emailWithStar") as string}
                        type="TEXT"
                        placeholder={t("form.info.yourEmail")}
                        value={formValue.email}
                        handleChange={(event:React.ChangeEvent<HTMLInputElement>)=>{
                            setFormValue({
                                ...formValue,
                                email: event.target.value,
                            });
                        }}
                        hasError={!!formError?.email}
                        error={formError?.email as string}
                        onBlur={()=>{
                            setFormValue({
                                ...formValue,
                                email: formValue.email.trim(),
                            });
                            onBlurValidation({
                                email: formValue.email,
                            });
                        }}
                    />
                    {/* <div className="mt-1 pl-5 text-[0.85rem] font-medium leading-6 text-primaryDark opacity-60 lg:mt-2 lg:text-primaryGold lg:opacity-100 xl:text-md xl:leading-6">
                        <p className=" flex flex-col gap-2">
                            <span className="block">
                                {t("form.error.emailRemark1")}
                            </span>
                            <span className="block">
                                {t("form.error.emailRemark2")}
                            </span>
                        </p>
                    </div> */}
                </div>
                <CustomInput
                    labelClasses="labelText"
                    containerClasses=""
                    label={t("form.info.mobileNumberWithStar") as string}
                    type="TEL"
                    maxLength={9}
                    placeholder={t("form.info.onlyTWNumberAllowed")}
                    value={formValue.phone}
                    handleChange={(event:React.ChangeEvent<HTMLInputElement>)=>{
                        const value = event.target.value;
                        if(isNaN(Number(value)) || (value.includes(".") && value.split(".")[1].length === 0)){
                            return ;
                        }
                        setFormValue({
                            ...formValue,
                            phone: value,
                        });
                    }}
                    hasError={!!formError?.phone}
                    error={formError?.phone as string}
                    onBlur={()=>{
                        onBlurValidation({
                            phone: formValue.phone,
                        });
                    }}
                    leftComponent={()=>
                        (
                            <div
                                className="absolute -left-2 top-0 flex h-full w-[60px] items-center pl-6 pr-0 text-lg font-semibold md:w-[75px] md:pl-10 md:pr-5 md:text-lg"
                            >
                                +886
                            </div>
                        )
                    }
                />
                <CustomInput
                    id="memberNumber"
                    containerClasses=""
                    labelClasses="labelText"
                    label={`${t("form.inner.memberNo")}${formValue.typeofEnquiry === "MEMBER_ACCOUNT_DELETION" ? "*" : ""}`}
                    type="TEL"
                    maxLength={10}
                    placeholder={t("form.inner.memberNo")}
                    value={optionalFormValue.memberNumber}
                    handleChange={(event:React.ChangeEvent<HTMLInputElement>)=>{

                        const newValue = event.target.value.replace(/\s/g, "");

                        if(newValue === "" || /^\d+$/.test(newValue)){
                            setOptionalFormValue({
                                ...optionalFormValue,
                                memberNumber: newValue,
                            });
                        }
                    }}
                    hasError={!!formError?.memberNumber}
                    error={formError?.memberNumber as string}
                    onBlur={()=>{
                        onBlurValidation({
                            memberNumber: optionalFormValue.memberNumber,
                        });
                    }}
                />
                <div className="">
                    <Headline title={`${t("form.inner.type")}`}/>
                    <CustomSelect
                        items={typeofEnquiryItems}
                        onChange={(value: string) => {
                            onTypeofEnquiryUpdate(value);
                        } }
                        value={formValue.typeofEnquiry}
                        hasError={!!formError?.typeofEnquiry}
                        error={formError?.typeofEnquiry as string}
                        dropdownIcon={dropDown}
                        />
                </div>
                {shouldInputOrderReceipt && (
                    <CustomInput
                        labelClasses="labelText"
                        label={t("form.inner.orderReceiptNumber")}
                        containerClasses=""
                        type={"TEXT"}
                        placeholder={t("form.info.orderReceiptNumberOptional")}
                        value={optionalFormValue.orderReceipt}
                        handleChange={(event:React.ChangeEvent<HTMLInputElement>)=>{

                            const newValue = event.target.value.replace(/\s/g, "");

                            if(newValue === "" || /^\d+$/.test(newValue)){
                                setOptionalFormValue({
                                    ...optionalFormValue,
                                    orderReceipt: newValue,
                                });
                            }
                        }}
                        onBlur={()=>{
                            onBlurValidation({
                                orderReceipt: optionalFormValue.orderReceipt,
                            });
                        }}
                        hasError={!!formError?.orderReceipt}
                        error={formError?.orderReceipt as string}
                        maxLength={10}
                        />
                )}
                {formValue.typeofEnquiry !== undefined && (
                    <>
                        <CustomTextArea
                            labelClasses="labelText"
                            label={t("form.inner.yourMessage")}
                            containerClasses=""
                            name={"message"}
                            id="message"
                            maxLength={2000}
                            minLength={1}
                            rows={4}
                            cols={40}
                            required={true}
                            handleChange={(event:React.ChangeEvent<HTMLTextAreaElement>)=>{
                                setFormValue({
                                    ...formValue,
                                    message: event.target.value,
                                });
                            }}
                            onBlur={()=>{
                                onBlurValidation({
                                    message: formValue.message,
                                });
                            }}
                            hasError={!!formError?.message}
                            error={formError?.message as string}
                            value={formValue.message}
                            placeholder={t("form.info.howToAssistYou")}
                        />
                        <Upload
                            onImageUpload={(file: File | undefined)=>{
                                //might need to use "FormData" for attachment object
                
                                setOptionalFormValue({
                                    ...optionalFormValue,
                                    attachemnt: file,
                                });
                                onBlurValidation({
                                    attachemnt: file,
                                });
                            }}
                            onDelete={()=>{
                                setOptionalFormValue({
                                    ...optionalFormValue,
                                    attachemnt: undefined,
                                });
                                onBlurValidation({
                                    attachemnt: undefined,
                                });
                            }}
                            hasError={!!formError?.attachemnt}
                            error={formError?.attachemnt as string}
                            lang={lang}
                            containerClasses=""
                        />
                    </>
                )}
                <div className="ContactFormReCAPTCHA ">
                    <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                        onChange={(token:string | null)=>{
                            setFormValue({
                                ...formValue,
                                recaptcha: token === null ? undefined : token,
                            });
                            onBlurValidation({
                                recaptcha: token,
                            });
                        }}
                        onExpired={()=>{
                            setFormValue({
                                ...formValue,
                                recaptcha: undefined,
                            });
                            onBlurValidation({
                                recaptcha: undefined,
                            });
                        }}
                        size="normal"
                        badge="inline"
                        hl={`${lang === "en" ? "en" : "zh-HK"}`}
                    />
                    {!!formError.recaptcha && formError.recaptcha?.length && (
                        <p className="text-md font-semibold text-primaryPurple">
                            {formError.recaptcha}
                        </p>
                    )}
                </div>
                 <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className={`ContactFormDesktopSubmitBtn ${
                        !isFormValid || isSubmitting
                        ? "cursor-default bg-[#AF9B7C]"
                        :"cursor-pointer bg-primaryGold hover:bg-[#79684D]"
                    }`}
                 >
                    {t("form.inner.submit")}
                </button>
            </form>
        </div>
    );

}