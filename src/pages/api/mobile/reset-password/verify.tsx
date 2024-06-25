import type {NextApiRequest, NextApiResponse} from 'next'
import {createToken, DeleteOtp, VerifyOtp} from "@/utils/api/auth/reset_password_utils";
import {StatusCodes} from "http-status-codes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {ktp, otp} = req.body

        if (!ktp || !otp) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                status: "error",
                message: 'Tolong masukkan KTP dan Kode OTP anda'
            })
        }

        const numberRegex = /^\d+$/;

        if (ktp.length != 16 || !numberRegex.test(ktp)) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                status: "error",
                message: 'KTP anda tidak valid'
            })
        }

        const dbQuery = await VerifyOtp(ktp, otp)

        if (dbQuery.status == "error") {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({status: "error", message: dbQuery.message})
        }

        return res.status(StatusCodes.CREATED).json({
            status: "success",
            data: {
                token: await createToken(ktp, otp)
            },
            message: dbQuery.message
        })


    } else {
        return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({status: "error", message: 'Method Not Allowed'});
    }
}