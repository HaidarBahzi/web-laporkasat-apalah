"use server";

import { user_status, verify_status } from "@prisma/client";
import { addMinutes } from "date-fns";
import prisma from "@/utils/lib/prisma";

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
      user_ktp: userKtp,
      user_fullname: userNama,
      user_alamat: userAlamat,
      user_phone: userPhone,
      user_password: passwordHash,
      user_warning: 0,
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
      user_ktp: userKtp,
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
      user_ktp: userKtp,
    },
  });
}

export async function DeleteOtp(userKtp: string) {
  await prisma.user_verification.delete({
    where: {
      user_ktp: userKtp,
    },
  });
}

export async function SaveOtp(userKtp: string, userCode: string) {
  const date = new Date();

  const newDate = addMinutes(date, 2);

  const query = await prisma.user_verification.create({
    data: {
      user_ktp: userKtp,
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
      user_ktp: userKtp,
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
      user_ktp: userKtp,
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

export async function SendOtp(phoneDes: string, ktpDes: string) {
  const otpGenerator = require("otp-generator");

  const otpCode = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  let otpMessage = `
Halo! Berikut adalah kode OTP Anda untuk verifikasi akun LAPOR KASAT:

*${otpCode}*

Kode ini berlaku selama 2 (dua) menit.

Mohon untuk tidak memberikan kode ini kepada siapapun.

Terima kasih!`;

  const data = {
    target: phoneDes,
    message: otpMessage,
  };

  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: process.env.WHATSAPP_BOT_TOKEN!,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data),
    });

    const dbResponse = await SaveOtp(ktpDes, otpCode);

    if (response.ok && dbResponse != null) {
      return { message: "Berhasil mengirim kode OTP", status: "success" };
    } else {
      await DeleteOtp(ktpDes);
      return { message: "Gagal mengirim kode OTP", status: "error" };
    }
  } catch (e) {
    return { message: "Something Went Wrong", status: "error" };
  }
}
