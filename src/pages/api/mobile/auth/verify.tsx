import type { NextApiRequest, NextApiResponse } from "next";
import { VerifyOtp } from "@/utils/api/auth/register_utils";
import { StatusCodes } from "http-status-codes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: "error",
        message: `Tolong masukkan email dan kode OTP yang valid`,
      });
    }

    const dbQuery = await VerifyOtp(email, otp);

    if (dbQuery.status == "error") {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: dbQuery.message,
      });
    }

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: dbQuery.message,
    });
  } else {
    return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
      status: "error",
      message: "Method Not Allowed",
    });
  }
}
