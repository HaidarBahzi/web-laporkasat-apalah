"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { defaultSession, SessionData, sessionOptions } from "@/lib";
import { redirect } from "next/navigation";
import prisma from "@/utils/lib/prisma";

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  return session;
}

export async function getDataSession() {
  const session = await getSession();

  return {
    imgUser: session.img,
    namaUser: session.username,
    idUser: session.userId,
    roleUser: session.role,
  };
}

export async function updateSession() {
  const session = await getSession();

  const expire = new Date(session.expires!);

  const date = new Date();

  if (!session.isLoggedIn) {
    return await logout();
  }

  if (expire < date) {
    return await logout();
  }

  const query = await prisma.pegawai.findUnique({
    where: {
      pegawai_nip: session.userId,
    },
    select: {
      pegawai_nip: true,
      pegawai_nama: true,
      pegawai_foto: true,
      pegawai_role: true,
    },
  });

  if (query == null) {
    return await logout();
  }

  session.userId = query?.pegawai_nip;
  session.username = query?.pegawai_nama;
  session.img = query?.pegawai_foto;
  session.role = query?.pegawai_role;

  return await session.save();
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/");
}
