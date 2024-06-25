"use server";

import { verify_status } from "@prisma/client";
import { addMinutes } from "date-fns";
import { jwtVerify, SignJWT } from "jose";
import prisma from "@/utils/lib/prisma";

export async function EditUser(userKtp: string, userNewPass: string) {
  const bcrypt = require("bcrypt");
  const salt = bcrypt.genSaltSync(10);
  const finalPassword = bcrypt.hashSync(userNewPass, salt);

  const date = new Date();

  const query = await prisma.users.update({
    where: {
      user_ktp: userKtp,
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
      user_ktp: userKtp,
    },
  });
}

export async function SaveOtp(userKtp: string, userCode: string) {
  const date = new Date();

  const newDate = addMinutes(date, 2);

  const query = await prisma.reset_pass_verification.create({
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

  const query = await prisma.reset_pass_verification.update({
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

  const query = await prisma.reset_pass_verification.findUnique({
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

export async function SendOtp(phoneDes: string, ktpDes: string) {
  const otpGenerator = require("otp-generator");

  const otpCode = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  let otpMessage = `
Halo! Berikut adalah kode OTP Anda untuk mereset kata sandi akun LAPOR KASAT:

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
      return {
        message: "Successfuly send a OTP Verification SMS",
        status: "success",
      };
    } else {
      await DeleteOtp(ktpDes);
      return {
        message: "Failed to send a OTP Verification SMS",
        status: "error",
      };
    }
  } catch (e: any) {
    return { message: "Something Went Wrong", status: "error" };
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
