import type {NextApiRequest, NextApiResponse} from 'next'
import {credentialCheck, LoginProcess} from "@/utils/api/auth/login_utils";
import {user_status} from "@prisma/client";
import {encrypt} from "@/utils/api/auth/login_utils";
import {StatusCodes} from "http-status-codes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {ktp, password} = req.body;

        if (!ktp || !password) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                status: "error",
                message: 'Tolong masukkan KTP dan kata sandi yang valid'
            });
        }

        const dbQuery = await LoginProcess(ktp, password);

        if (dbQuery == null) {
            return res.status(StatusCodes.NOT_FOUND).json({status: "error", message: 'Pengguna ini tidak ada'});
        }

        if (dbQuery.user_status == user_status.S) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "error",
                message: 'Pengguna ini belum diverifikasi'
            });
        }

        if (dbQuery.user_status == user_status.B) {
            return res.status(StatusCodes.FORBIDDEN).json({status: "error", message: 'Pengguna ini telah diblokir'});
        }

        const checkPass = await credentialCheck(password, dbQuery.user_password);

        if (!checkPass) {
            return res.status(StatusCodes.UNAUTHORIZED).json({status: "error", message: 'Kredensial tidak benar'});
        }

        return res.status(StatusCodes.OK).json({
            status: "success",
            message: 'Berhasil login',
            data: {
                id: dbQuery.user_ktp,
                token: await encrypt({userKtp: dbQuery.user_ktp, userName: dbQuery.user_fullname})
            }
        });

    } else {
        return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({status: "error", message: 'Method Not Allowed'});
    }
}