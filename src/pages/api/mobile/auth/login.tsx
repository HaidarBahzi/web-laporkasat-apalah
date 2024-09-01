import type { NextApiRequest, NextApiResponse } from "next";
import { credentialCheck, LoginProcess } from "@/utils/api/auth/login_utils";
import { user_status } from "@prisma/client";
import { encrypt } from "@/utils/api/auth/login_utils";
import { StatusCodes } from "http-status-codes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: "error",
        message: "Tolong masukkan email dan kata sandi yang valid",
      });
    }

    const dbQuery = await LoginProcess(email, password);

    if (dbQuery == null) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "error", message: "Pengguna ini tidak ada" });
    }

    if (dbQuery.user_status == user_status.S) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        message: "Pengguna ini belum diverifikasi",
      });
    }

    if (dbQuery.user_status == user_status.B) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ status: "error", message: "Pengguna ini telah diblokir" });
    }

    const checkPass = await credentialCheck(password, dbQuery.user_password);

    if (!checkPass) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ status: "error", message: "Kredensial tidak benar" });
    }

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "Berhasil login",
      data: {
        id: dbQuery.user_mail,
        token: await encrypt({
          useremail: dbQuery.user_mail,
          userName: dbQuery.user_fullname,
        }),
      },
    });
  } else {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ status: "error", message: "Method Not Allowed" });
  }
}
