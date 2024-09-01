import type { NextApiRequest, NextApiResponse } from "next";
import { CheckUser, decrypt } from "@/utils/api/auth/login_utils";
import { StatusCodes } from "http-status-codes";
import {
  SendPengaduan,
  UploadImage,
} from "@/utils/api/features/pengaduan_utils";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, title, ket, alamat, photo, auth } = req.body;

    if (!email || !title || !ket || !alamat || !photo || !auth) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: "error",
        message: "Tolong masukkan detail pengaduan anda",
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

    const uploadImage = await UploadImage(photo);

    if (uploadImage.type == "failed") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Gagal mengirim pengaduan",
      });
    }

    const dbQuery = await SendPengaduan(
      email,
      title,
      ket,
      alamat,
      uploadImage.file!
    );

    if (dbQuery == null) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Gagal mengirim pengaduan",
      });
    }

    return res
      .status(StatusCodes.CREATED)
      .json({ status: "success", message: "Berhasil mengirim pengaduan" });
  } else {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ status: "error", message: "Method Not Allowed" });
  }
}
