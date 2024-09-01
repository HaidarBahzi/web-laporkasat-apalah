import type { NextApiRequest, NextApiResponse } from "next";
import { CheckUser, decrypt } from "@/utils/api/auth/login_utils";
import {
  CheckPassword,
  UpdateProfilePassword,
} from "@/utils/api/profile/profile_utils";
import { StatusCodes } from "http-status-codes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, oldpass, newpass, auth } = req.body;

    if (!email || !oldpass || !newpass || !auth) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: "error",
        message: "Tolong masukkan password lama dan baru anda",
      });
    }

    try {
      await decrypt(auth);
    } catch (error) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        type: "INVALID_TOKEN",
        message: "Token tidak valid",
      });
    }

    const checkUser = await CheckUser(email);

    if (checkUser == 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "error", message: "Pengguna ini tidak ada" });
    }

    const passCheck = await CheckPassword(email, oldpass);

    if (!passCheck) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        message: "Password lama anda tidak sesuai",
      });
    }

    const dbQuery = await UpdateProfilePassword(email, newpass);

    if (dbQuery == null) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Gagal mengganti password anda",
      });
    }

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "Berhasil mengganti password anda",
    });
  } else {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ status: "error", message: "Method Not Allowed" });
  }
}
