import type {NextApiRequest, NextApiResponse} from 'next'
import {DeleteOtp, SendOtp} from "@/utils/api/auth/reset_password_utils";
import {CheckUser} from "@/utils/api/auth/login_utils";
import {StatusCodes} from "http-status-codes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {ktp, phone} = req.body

        if (!ktp || !phone) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                status: "error",
                message: 'Tolong masukkan KTP dan No HP anda'
            });
        }

        const numberRegex = /^\d+$/;

        if (ktp.length != 16 || !numberRegex.test(ktp)) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({status: "error", message: 'KTP anda tidak valid'})
        }

        if (phone.length != 12 || !numberRegex.test(phone)) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                status: "error",
                message: 'No HP anda tidak valid'
            })
        }
        const dbQuery = await CheckUser(ktp);

        if (dbQuery == null) {
            return res.status(StatusCodes.NOT_FOUND).json({status: "error", message: 'Pengguna ini tidak ada'});
        }

        let formatedPhone = phone;

        if (phone.startsWith('0')) {
            formatedPhone = `62${phone.substring(1)}`;
        }

        const otpSend = await SendOtp(formatedPhone, ktp)

        if (otpSend.status == "error") {
            await DeleteOtp(ktp)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: "error",
                message: 'Gagal mengirim kode OTP'
            })
        }

        return res.status(StatusCodes.CREATED).json({
            status: "success",
            message: 'Berhasil mengirim kode OTP'
        })


    } else {
        return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({status: "error", message: 'Method Not Allowed'});
    }
}