"use server";

import prisma from "@/utils/lib/prisma";

export async function GetAllHistory(userKtp: string) {
  const query = await prisma.laporan.findMany({
    where: {
      user_ktp: userKtp,
    },
    select: {
      laporan_id: true,
      laporan_title: true,
      laporan_description: true,
      laporan_location: true,
      laporan_status: true,
      laporan_type: true,
      laporan_tgl_send: true,
      laporan_tgl_confirm: true,
      laporan_tgl_done: true,
    },
  });

  return query;
}

export async function GetDetailHistory(userKtp: string, id: string) {
  const query = await prisma.laporan.findUnique({
    where: {
      user_ktp: userKtp,
      laporan_id: id,
    },
    select: {
      laporan_id: true,
      laporan_title: true,
      laporan_description: true,
      laporan_document: true,
      laporan_location: true,
      laporan_status: true,
      laporan_tgl_send: true,
      laporan_tgl_confirm: true,
      laporan_tgl_done: true,
    },
  });

  return query;
}
