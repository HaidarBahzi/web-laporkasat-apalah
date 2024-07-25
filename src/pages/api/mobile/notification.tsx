import { CheckUser, decrypt } from "@/utils/api/auth/login_utils";
import { GetNotification } from "@/utils/api/notification/notification_utils";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { ktp, auth } = req.body;

    if (!ktp || !auth) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: "error",
        message: "Tolong masukkan KTP dan token anda",
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

    const numberRegex = /^\d+$/;

    if (ktp.length != 16 || !numberRegex.test(ktp)) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ status: "error", message: "KTP anda tidak valid" });
    }

    const checkUser = await CheckUser(ktp);

    if (checkUser == 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "error", message: "Pengguna ini tidak ada" });
    }

    const dbQuery = await GetNotification(ktp);

    return res.status(StatusCodes.OK).json({
      status: "success",
      data: dbQuery,
      message: "Berhasil mengakses notifikasi",
    });
  } else {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ status: "error", message: "Method Not Allowed" });
  }
}
