import type {NextApiRequest, NextApiResponse} from 'next'
import {EditUser, decrypt} from "@/utils/api/auth/reset_password_utils";
import {StatusCodes} from "http-status-codes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {ktp, token, password} = req.body

        if (!ktp || !token || !password) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                status: "error",
                message: 'Tolong masukkan KTP, password baru dan token anda'
            });
        }

        const numberRegex = /^\d+$/;

        if (ktp.length != 16 || !numberRegex.test(ktp)) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({status: "error", message: 'KTP anda tidak valid'})
        }

        try {
            await decrypt(token)
        } catch (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "error",
                type: "INVALID_TOKEN",
                message: "Token tidak valid"
            });
        }

        const dbQuery = await EditUser(ktp, password)

        if (dbQuery == null) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: "error",
                message: 'Gagal mengganti password anda'
            })
        }

        return res.status(200).json({status: "success", message: 'Berhasil mengganti password anda'})

    } else {
        return res.status(405).json({status: "error", message: 'Method Not Allowed'});
    }
}