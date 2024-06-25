import type {NextApiRequest, NextApiResponse} from 'next'
import {CreateUser, DeleteUser, SendOtp} from "@/utils/api/auth/register_utils";
import {StatusCodes} from "http-status-codes";
import {CheckUser} from "@/utils/api/auth/login_utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {ktp, nama, alamat, phone, password} = req.body

        if (!ktp || !nama || !alamat || !phone || !password) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                status: "error",
                message: 'Tolong masukkan identitas valid anda'
            });
        }

        const numberRegex = /^\d+$/;

        if (ktp.length != 16 || !numberRegex.test(ktp)) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                status: "error",
                message: 'KTP anda tidak valid'
            })
        }

        if (phone.length != 12 || !numberRegex.test(phone)) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                status: "error",
                message: 'Nomor HP anda tidak valid'
            })
        }

        const checkUser = await CheckUser(ktp)

        if (checkUser >= 1) {
            return res.status(StatusCodes.CONFLICT).json({
                status: "error",
                message: 'Pengguna ini sudah ada'
            })
        }

        let formatedPhone = phone;

        if (phone.startsWith('0')) {
            formatedPhone = `62${phone.substring(1)}`;
        }

        const otpSend = await SendOtp(formatedPhone, ktp)

        console.log(otpSend.status)

        const dbCreate = await CreateUser(ktp, nama, alamat, phone, password);

        if (otpSend.status == "success" && dbCreate != null) {
            return res.status(StatusCodes.CREATED).json({
                status: "success",
                message: 'Berhasil membuat user baru, silahkan cek WhatsApp anda untuk kode aktivasi'
            })
        } else {
            await DeleteUser(ktp)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: "error",
                message: 'Gagal membuat user baru'
            })
        }

    } else {
        return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
            status: "error",
            message: 'Method Not Allowed'
        });
    }
}