
import { AnyObject, MixedSchema, NumberSchema, StringSchema } from "yup"

export type ContactFromYupType<T> = {
    [field in keyof T] :
    | StringSchema<string | undefined, AnyObject,undefined, "">
    | NumberSchema<number | undefined, AnyObject,undefined, "">
    | MixedSchema<File | undefined, AnyObject, undefined, "">;
}
