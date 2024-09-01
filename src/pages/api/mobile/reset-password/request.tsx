import type { NextApiRequest, NextApiResponse } from "next";
import { DeleteOtp, SendOtp } from "@/utils/api/auth/reset_password_utils";
import { CheckUser } from "@/utils/api/auth/login_utils";
import { StatusCodes } from "http-status-codes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: "error",
        message: "Tolong masukkan email anda",
      });
    }

    const dbQuery = await CheckUser(email);

    if (dbQuery == null) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "error", message: "Pengguna ini tidak ada" });
    }

    const otpSend = await SendOtp(email);

    if (!otpSend.ok) {
      await DeleteOtp(email);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Gagal mengirim kode OTP",
      });
    }

    return res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Berhasil mengirim kode OTP",
    });
  } else {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ status: "error", message: "Method Not Allowed" });
  }
}
