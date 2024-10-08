"use server";

import prisma from "@/utils/lib/prisma";

export async function GetAllHistory(userKtp: string) {
  const query = await prisma.laporan.findMany({
    where: {
      user_mail: userKtp,
    },
    select: {
      laporan_id: true,
      laporan_title: true,
      laporan_description: true,
      laporan_document: true,
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
      user_mail: userKtp,
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
      laporan_tgl_progress: true,
      laporan_tgl_reject: true,
      laporan_tgl_done: true,
    },
  });

  const queryBukti = await prisma.pelanggaran.findUnique({
    where: {
      laporan_id: query?.laporan_id,
    },
    select: {
      bukti_penyegelan: true,
      bukti_kejadian: true,
    },
  });

  return { query, queryBukti };
}
