"use server";

import { user_status } from "@prisma/client";
import prisma from "@/utils/lib/prisma";

export async function GetAllUsers() {
  const query = await prisma.users.findMany({
    select: {
      user_mail: true,
      user_fullname: true,
      user_alamat: true,
      user_phone: true,
      user_status: true,
    },
  });

  return query;
}

export async function GetDetailUser(userKtp: string) {
  const query = await prisma.users.findUnique({
    where: {
      user_mail: userKtp,
    },
    select: {
      user_mail: true,
      user_fullname: true,
      user_alamat: true,
      user_phone: true,
      user_password: true,
    },
  });

  return query;
}

export async function SubmitUserData(formData: FormData) {
  const bcrypt = require("bcrypt");

  const date = new Date();

  const userKtp = formData.get("userKtp")?.toString();
  const userPassword = formData.get("userPassword")?.toString();
  const userName = formData.get("userNama")?.toString();
  const userPhone = formData.get("userPhone")?.toString();
  const userAlamat = formData.get("userAlamat")?.toString();
  const honeypot = formData.get("userHoneypot")?.toString();

  if (honeypot !== "") {
    return { message: "Terjadi Kesalahan", type: "error" };
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(userPassword, salt);

  const submitData = await prisma.users.create({
    data: {
      user_mail: userKtp!,
      user_password: passwordHash,
      user_fullname: userName!,
      user_phone: userPhone!,
      user_alamat: userAlamat!,
      user_status: user_status.A,

      created_at: date.toISOString(),
    },
  });

  if (!submitData) {
    return { message: "User Gagal Ditambahkan", type: "error" };
  }

  return { message: "User Berhasil Ditambahkan", type: "success" };
}

export async function SubmitUserEdit(
  formData: FormData,
  userKtpSource: string,
  userPasswordSource: string
) {
  const bcrypt = require("bcrypt");

  const date = new Date();

  const userKtp = formData.get("userKtp")?.toString();
  const userPassword = formData.get("userPassword")?.toString();
  const userName = formData.get("userNama")?.toString();
  const userPhone = formData.get("userPhone")?.toString();
  const userAlamat = formData.get("userAlamat")?.toString();

  const honeypot = formData.get("userHoneypot")?.toString();

  if (honeypot !== "") {
    return { message: "Terjadi Kesalahan", type: "error" };
  }

  let finalPassword = userPasswordSource;

  if (userPassword !== "") {
    const salt = bcrypt.genSaltSync(10);
    finalPassword = bcrypt.hashSync(userPassword, salt);
  }

  const submitData = await prisma.users.update({
    where: {
      user_mail: userKtpSource,
    },
    data: {
      user_mail: userKtp!,
      user_password: finalPassword,
      user_fullname: userName!,
      user_phone: userPhone!,
      user_alamat: userAlamat!,
      user_status: user_status.A,

      updated_at: date.toISOString(),
    },
  });

  if (!submitData) {
    return { message: "User Gagal Di edit!", type: "error" };
  }

  return { message: "User Berhasil Di edit!", type: "success" };
}
