import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { CheckUser, decrypt } from "@/utils/api/auth/login_utils";
import {
  SubmitPermohonan,
  UploadPDF,
} from "@/utils/api/features/permohonan_utils";

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
    const { email, title, ket, alamat, document, auth } = req.body;

    if (!email || !title || !ket || !alamat || !document || !auth) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: "error",
        message: "Tolong masukkan detail permohonan anda",
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

    const UploadPdf = await UploadPDF(document);

    if (UploadPdf.type == "failed") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Gagal mengirim permohonan",
      });
    }

    const dbQuery = await SubmitPermohonan(
      email,
      title,
      ket,
      alamat,
      UploadPdf.file!
    );

    if (dbQuery == null) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Gagal mengirim permohonan",
      });
    }

    return res
      .status(StatusCodes.CREATED)
      .json({ status: "success", message: "Berhasil mengirim permohonan" });
  } else {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ status: "error", message: "Method Not Allowed" });
  }
}
