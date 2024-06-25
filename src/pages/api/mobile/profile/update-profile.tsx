import type {NextApiRequest, NextApiResponse} from 'next'
import {CheckUser, decrypt} from "@/utils/api/auth/login_utils";
import {UpdateProfile} from "@/utils/api/profile/profile_utils";
import {StatusCodes} from "http-status-codes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {ktp, newktp, newname, newphone, newalamat, auth} = req.body;

        if (!ktp || !newktp || !newname || !newphone || !newalamat || !auth) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({message: 'Please insert valid identity and auth token'});
        }

        try {
            await decrypt(auth);
        } catch (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: "error",
                type: "INVALID_TOKEN",
                message: "Token tidak valid"
            });
        }

        const numberRegex = /^\d+$/;

        if (ktp.length != 16 || !numberRegex.test(ktp)) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({status: "error", message: 'KTP anda tidak valid'})
        }

        if (newphone.length != 12 || !numberRegex.test(newphone)) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                status: "error",
                message: 'No HP anda tidak valid'
            })
        }

        const checkUser = await CheckUser(ktp)

        if (checkUser == 0) {
            return res.status(StatusCodes.NOT_FOUND).json({status: "error", message: 'Pengguna ini tidak ada'})
        }

        const dbQuery = await UpdateProfile(ktp, newktp, newname, newphone, newalamat);

        if (dbQuery == null) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: "error",
                message: 'Gagal mengganti profil user'
            })
        }

        return res.status(StatusCodes.OK).json({status: "success", message: 'Berhasil mengganti profil user'})


    } else {
        return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({status: "error", message: 'Method Not Allowed'});
    }
}