import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { CheckUser, decrypt } from "@/utils/api/auth/login_utils";
import { GetStatistika } from "@/utils/api/features/statistika/statistika_utils";
import { status_laporan } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, auth } = req.body;

    if (!email || !auth) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
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

    const dbQuery = await GetStatistika(email, status_laporan.C);

    if (dbQuery.length == 0) {
      return res
        .status(StatusCodes.OK)
        .json({ status: "success", message: "Tidak ada history pengaduan" });
    }

    return res.status(StatusCodes.OK).json({
      status: "success",
      data: dbQuery,
      message: "Success to get history pengaduan",
    });
  } else {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ status: "error", message: "Method Not Allowed" });
  }
}
