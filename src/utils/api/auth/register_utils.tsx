"use server";

import { user_status, verify_status } from "@prisma/client";
import { addMinutes } from "date-fns";
import prisma from "@/utils/lib/prisma";

import nodemailer from "nodemailer";
import { EmailVerifyTemplate } from "@/utils/lib/email/email-verification-template";
import { renderToString } from "react-dom/server";
import { StatusCodes } from "http-status-codes";

export async function CreateUser(
  userKtp: string,
  userNama: string,
  userAlamat: string,
  userPhone: string,
  userPassword: string
) {
  const date = new Date();

  const bcrypt = require("bcrypt");
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(userPassword, salt);

  const query = await prisma.users.create({
    data: {
      user_mail: userKtp,
      user_fullname: userNama,
      user_alamat: userAlamat,
      user_phone: userPhone,
      user_password: passwordHash,
      user_status: user_status.S,

      created_at: date.toISOString(),
    },
  });

  return query;
}

export async function EditUser(userKtp: string) {
  const date = new Date();

  const query = await prisma.users.update({
    where: {
      user_mail: userKtp,
    },
    data: {
      user_status: user_status.A,
      updated_at: date.toISOString(),
    },
  });

  return query;
}

export async function DeleteUser(userKtp: string) {
  await prisma.users.delete({
    where: {
      user_mail: userKtp,
    },
  });
}

export async function DeleteOtp(userKtp: string) {
  await prisma.user_verification.delete({
    where: {
      user_mail: userKtp,
    },
  });
}

export async function SaveOtp(userKtp: string, userCode: string) {
  const date = new Date();

  const newDate = addMinutes(date, 5);

  const query = await prisma.user_verification.create({
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

  const query = await prisma.user_verification.update({
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

  const query = await prisma.user_verification.findUnique({
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
    return { message: "Pengguna ini sudah di verifikasi", status: "error" };
  }

  if (query?.user_expired! < date) {
    return { message: "Kode OTP sudah hangus", status: "error" };
  }

  if (query?.user_code! != userOtp) {
    return { message: "Kode OTP tidak valid", status: "error" };
  }

  const updateVerify = await EditOtp(userKtp);
  const updateUser = await EditUser(userKtp);

  if (updateVerify != null && updateUser != null) {
    return { message: "Berhasil memverifikasi pengguna", status: "success" };
  } else {
    return { message: "Gagal memverifikasi pengguna", status: "error" };
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
    const emailHtml = renderToString(<EmailVerifyTemplate code={otpCode} />);

    transporter.sendMail({
      from: '"Satpol PP Kudus" <haidarbahzi07@gmail.com>',
      to: emailDes,
      subject: "Konfirmasi Alamat Email - Lapor Kasat",
      html: emailHtml,
    });

    await SaveOtp(emailDes, otpCode);
    console.log("ok");

    return Response.json(
      { status: "success", message: `Berhasil mengirim email ke ${emailDes}` },
      { status: StatusCodes.OK }
    );
  } catch (e) {
    console.log(e);

    return Response.json(
      {
        status: "error",
        message: `Sepertinya ada yang salah, silahkan coba lagi`,
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
