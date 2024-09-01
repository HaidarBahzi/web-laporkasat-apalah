import type { NextApiRequest, NextApiResponse } from "next";
import {
  CreateUser,
  DeleteUser,
  SendOtp,
} from "@/utils/api/auth/register_utils";
import { StatusCodes } from "http-status-codes";
import { CheckUser } from "@/utils/api/auth/login_utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, nama, alamat, phone, password } = req.body;

    if (!email || !nama || !alamat || !phone || !password) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: "error",
        message: "Tolong masukkan identitas valid anda",
      });
    }

    const numberRegex = /^\d+$/;

    if (phone.length != 12 || !numberRegex.test(phone)) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: "error",
        message: "Nomor HP anda tidak valid",
      });
    }

    const checkUser = await CheckUser(email);

    if (checkUser >= 1) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "error",
        message: "Pengguna ini sudah ada",
      });
    }

    const otpSend = await SendOtp(email);

    const dbCreate = await CreateUser(email, nama, alamat, phone, password);

    if (otpSend.ok && dbCreate != null) {
      return res.status(StatusCodes.CREATED).json({
        status: "success",
        message:
          "Berhasil membuat user baru, silahkan cek Email anda untuk kode aktivasi",
      });
    } else {
      await DeleteUser(email);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Gagal membuat user baru",
      });
    }
  } else {
    return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
      status: "error",
      message: "Method Not Allowed",
    });
  }
}
