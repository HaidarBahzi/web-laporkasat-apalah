"use server";

import prisma from "@/utils/lib/prisma";
import { format, parseISO } from "date-fns";

export async function GetAllPenyidik() {
  const query = await prisma.penyidik.findMany({
    select: {
      penyidik_id: true,
      pegawai_nip: true,
      penyidik_sk: true,
      penyidik_tgl_sk: true,
    },
  });

  const pengaduanWithUser = await Promise.all(
    query.map(async (penyidik) => {
      const queryUser = await prisma.pegawai.findUnique({
        where: {
          pegawai_nip: penyidik.pegawai_nip,
        },
        select: {
          pegawai_nama: true,
          pegawai_jabatan: true,
        },
      });

      return {
        ...penyidik,
        pegawai_nama: queryUser ? queryUser.pegawai_nama : null,
        pegawai_jabatan: queryUser ? queryUser.pegawai_jabatan : null,
      };
    })
  );

  return pengaduanWithUser;
}

export async function GetDetailPenyidik(penyidikId: string) {
  const query = await prisma.penyidik.findUnique({
    where: {
      penyidik_id: penyidikId,
    },
    select: {
      penyidik_id: true,
      pegawai_nip: true,
      penyidik_sk: true,
      penyidik_tgl_sk: true,
    },
  });

  return query;
}

export async function AddPenyidik(formData: FormData) {
  const { v4: uuidv4 } = require("uuid");

  const penyidikNip = formData.get("penyidikNip")?.toString()!;
  const penyidikSk = formData.get("penyidikSk")?.toString()!;
  const penyidikTglSk = formData.get("penyidikTglSk")?.toString()!;

  const parsedTglSk = parseISO(penyidikTglSk);

  const query = await prisma.penyidik.create({
    data: {
      penyidik_id: uuidv4(),
      pegawai_nip: penyidikNip,
      penyidik_sk: penyidikSk,
      penyidik_tgl_sk: format(parsedTglSk, "yyyy-MM-dd'T'HH:mm:ssXXX"),

      created_at: new Date().toISOString(),
    },
  });

  if (!query) {
    return { message: "Gagal menambah data penyidik", type: "error" };
  }

  return { message: "Berhasil menambah data penyidik", type: "success" };
}

export async function EditPenyidik(formData: FormData, id: string) {
  const penyidikNip = formData.get("penyidikNip")?.toString()!;
  const penyidikSk = formData.get("penyidikSk")?.toString()!;
  const penyidikTglSk = formData.get("penyidikTglSk")?.toString()!;

  const parsedTglSk = parseISO(penyidikTglSk);

  const query = await prisma.penyidik.update({
    where: {
      penyidik_id: id,
    },
    data: {
      pegawai_nip: penyidikNip,
      penyidik_sk: penyidikSk,
      penyidik_tgl_sk: format(parsedTglSk, "yyyy-MM-dd'T'HH:mm:ssXXX"),

      updated_at: new Date().toISOString(),
    },
  });

  if (!query) {
    return { message: "Gagal menambah data penyidik", type: "error" };
  }

  return { message: "Berhasil menambah data penyidik", type: "success" };
}

export async function DeletePenyidik(penyidikId: string) {
  await prisma.penyidik.delete({
    where: {
      penyidik_id: penyidikId,
    },
  });
}
