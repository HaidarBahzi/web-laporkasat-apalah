import type { NextApiRequest, NextApiResponse } from "next";
import { CheckUser, decrypt } from "@/utils/api/auth/login_utils";
import { GetDashboard } from "@/utils/api/dashboard/dashboard_utils";
import { StatusCodes } from "http-status-codes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, auth } = req.body;

    if (!email || !auth) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: "error",
        message: "Tolong masukkan email dan token anda",
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

    const dbQuery = await GetDashboard(email);

    return res.status(StatusCodes.OK).json({
      status: "success",
      data: dbQuery,
      message: "Berhasil mengakses dashboard",
    });
  } else {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ status: "error", message: "Method Not Allowed" });
  }
}
