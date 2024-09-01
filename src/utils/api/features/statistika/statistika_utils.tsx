"use server";

import { status_laporan } from "@prisma/client";
import prisma from "@/utils/lib/prisma";

export async function GetStatistika(userKtp: string, option: status_laporan) {
  const query = await prisma.laporan.findMany({
    where: {
      user_mail: userKtp,
      laporan_status: option,
    },
    select: {
      laporan_id: true,
      laporan_status: true,
      laporan_title: true,
      laporan_description: true,
      laporan_location: true,
      laporan_tgl_send: true,
      laporan_tgl_confirm: true,
      laporan_tgl_done: true,
    },
  });

  return query;
}
