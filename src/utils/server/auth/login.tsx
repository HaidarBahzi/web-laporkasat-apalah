"use server";

import { setup_status_aktif } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/utils/lib/session";
import prisma from "@/utils/lib/prisma";
import { addHours } from "date-fns/addHours";

export async function WebLoginProcess(formData: FormData) {
  const session = await getSession();

  const bcrypt = require("bcrypt");

  const pegawaiNip = formData.get("pegawaiNip")?.toString();
  const pegawaiPassword = formData.get("pegawaiPassword")?.toString();
  const honeypot = formData.get("userHoneypot")?.toString();

  if (honeypot !== "") {
    return { message: "Bot Terdeteksi" };
  }

  const checkLogin = await prisma.pegawai.findUnique({
    where: {
      pegawai_nip: pegawaiNip,
    },
    select: {
      pegawai_nip: true,
      pegawai_nama: true,
      pegawai_foto: true,
      pegawai_status: true,
      pegawai_role: true,
      pegawai_password: true,
    },
  });

  if (!checkLogin) {
    return { message: "Pegawai tidak terdaftar" };
  }

  if (checkLogin.pegawai_status == setup_status_aktif.TA) {
    return { message: "Pegawai tidak aktif" };
  }

  const checkPass = await bcrypt.compare(
    pegawaiPassword,
    checkLogin.pegawai_password
  );

  if (!checkPass) {
    return { message: "Password salah" };
  }

  const date = new Date();

  const newDate = addHours(date, 1);

  session.isLoggedIn = true;
  session.userId = checkLogin.pegawai_nip;
  session.username = checkLogin.pegawai_nama;
  session.img = checkLogin.pegawai_foto;
  session.role = checkLogin.pegawai_role;
  session.expires = newDate;

  await session.save();

  const rolePath: any = {
    A: "/admin/", // Admin
    U: "/user/", // User
    K: "/kasat/", // Kasat
    O: "/operator/", // Operator
  };

  redirect(`${rolePath[session.role!]}dashboard`);
}
