"use server";

import { jwtVerify, SignJWT } from "jose";
import prisma from "@/utils/lib/prisma";

export async function LoginProcess(userKtp: string, userPassword: string) {
  const query = await prisma.users.findUnique({
    where: {
      user_ktp: userKtp,
    },
    select: {
      user_ktp: true,
      user_password: true,
      user_status: true,
      user_phone: true,
      user_fullname: true,
      user_alamat: true,
    },
  });

  return query;
}

export async function CheckUser(userKtp: string) {
  const query = await prisma.users.count({
    where: {
      user_ktp: userKtp,
    },
  });

  return query;
}

export async function credentialCheck(
  userPassword: string,
  passwordSource: string
) {
  const bcrypt = require("bcrypt");

  return bcrypt.compare(userPassword, passwordSource);
}

const secretKey = process.env.JWT_SECRET;
const key = secretKey ? new TextEncoder().encode(secretKey) : undefined;

export async function encrypt(payload: any) {
  if (!key) {
    throw new Error("JWT secret key not provided.");
  }

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 hour")
    .sign(key);
}

export async function decrypt(input: any) {
  if (!key) {
    throw new Error("JWT secret key not provided.");
  }

  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });

  return payload;
}
