"use server";

import { verify_status } from "@prisma/client";
import { addMinutes } from "date-fns";
import { jwtVerify, SignJWT } from "jose";
import prisma from "@/utils/lib/prisma";
import { StatusCodes } from "http-status-codes";
import { renderToString } from "react-dom/server";
import { ResetVerifyTemplate } from "@/utils/lib/email/reset-verification-template";
import nodemailer from "nodemailer";

export async function EditUser(userKtp: string, userNewPass: string) {
  const bcrypt = require("bcrypt");
  const salt = bcrypt.genSaltSync(10);
  const finalPassword = bcrypt.hashSync(userNewPass, salt);

  const date = new Date();

  const query = await prisma.users.update({
    where: {
      user_mail: userKtp,
    },
    data: {
      user_password: finalPassword,
      updated_at: date.toISOString(),
    },
  });

  return query;
}

export async function DeleteOtp(userKtp: string) {
  await prisma.reset_pass_verification.delete({
    where: {
      user_mail: userKtp,
    },
  });
}

export async function SaveOtp(userKtp: string, userCode: string) {
  const date = new Date();

  const newDate = addMinutes(date, 2);

  const query = await prisma.reset_pass_verification.create({
    data: {
      user_mail: userKtp,
      user_code: userCode,
      user_expired: newDate,

      created_at: date.toISOString(),
    },
  });

  return query;
}

export async function EditOtp(userKtp: string) {
  const date = new Date();

  const query = await prisma.reset_pass_verification.update({
    where: {
      user_mail: userKtp,
    },
    data: {
      user_verify_status: verify_status.V,
      updated_at: date.toISOString(),
    },
  });

  return query;
}

export async function VerifyOtp(userKtp: string, userOtp: string) {
  const date = new Date();

  const query = await prisma.reset_pass_verification.findUnique({
    where: {
      user_mail: userKtp,
    },
    select: {
      user_verify_status: true,
      user_expired: true,
      user_code: true,
    },
  });

  if (query?.user_verify_status != verify_status.NV) {
    return { message: "Kode OTP sudah di verifikasi", status: "error" };
  }

  if (query?.user_expired! < date) {
    return { message: "Kode OTP sudah hangus", status: "error" };
  }

  if (query?.user_code! != userOtp) {
    return { message: "Kode OTP salah", status: "error" };
  }

  const updateVerify = await EditOtp(userKtp);

  if (updateVerify != null) {
    return { message: "Berhasil memverifikasi kode OTP", status: "success" };
  } else {
    return { message: "Gagal memverifikasi kode OTP", status: "error" };
  }
}

export async function SendOtp(emailDes: string) {
  const otpGenerator = require("otp-generator");

  const otpCode = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.BOT_EMAIL_SENDER,
      pass: process.env.BOT_EMAIL_PASS,
    },
  });

  try {
    const emailHtml = renderToString(<ResetVerifyTemplate code={otpCode} />);

    transporter.sendMail({
      from: '"Satpol PP Kudus" <haidarbahzi07@gmail.com>',
      to: emailDes,
      subject: "Konfirmasi Reset Password - Lapor Kasat",
      html: emailHtml,
    });

    await SaveOtp(emailDes, otpCode);

    return Response.json(
      { status: "success", message: `Berhasil mengirim email ke ${emailDes}` },
      { status: StatusCodes.OK }
    );
  } catch (e) {
    return Response.json(
      {
        status: "error",
        message: `Sepertinya ada yang salah, silahkan coba lagi`,
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

const secretKey = process.env.JWT_VERIFY_SECRET;
const key = secretKey ? new TextEncoder().encode(secretKey) : undefined;

export async function encrypt(payload: any) {
  if (!key) {
    throw new Error("JWT secret key not provided.");
  }

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2 minute")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  if (!key) {
    throw new Error("JWT secret key not provided.");
  }

  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function createToken(userKtp: string, userOtp: string) {
  if (!key) {
    throw new Error("JWT secret key not provided.");
  }

  const user = { ktp: userKtp, code: userOtp };
  const expires = new Date(Date.now() + 2 * 60 * 1000);
  return await encrypt({ user, expires });
}
