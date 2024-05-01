import { ContactUsFormInputType } from "@/types/componentTypes";
import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";


interface ResponseData {
    success: boolean;
    payload?: ContactUsFormInputType;
    message?: string;
}

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
){
    if(req.method === "POST") {
        try {
            // analyze the request body
            const payload = req.body;
            // set the cookie
            const cookie = serialize("contactUsForm", JSON.stringify(payload), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/"
            });

            res.setHeader("Set-Cookie", cookie);
            res.status(200).json({ success: true, payload });

        } catch (error) {
            if(error instanceof Error){
                res.status(500).json({ success: false, message: error.message });
            }else {
                res.status(500).json({ success: false, message: "An unknown error occurred." });
            }
        }
    
    }else {
        // not allow other methods
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

}