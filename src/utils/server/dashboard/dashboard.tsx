"use server";

import prisma from "@/utils/lib/prisma";
import { getDataSession } from "@/utils/lib/session";
import {
  setup_status_aktif,
  status_laporan,
  type_laporan,
  user_status,
} from "@prisma/client";

export async function GetDashboard() {
  const session = await getDataSession();

  const queryPengaduan = await prisma.laporan.count({
    where: {
      laporan_type: type_laporan.P,
    },
  });

  const queryPermohonan = await prisma.laporan.count({
    where: {
      laporan_type: type_laporan.B,
    },
  });

  const queryPegawai = await prisma.pegawai.count({
    where: {
      pegawai_status: setup_status_aktif.A,
    },
  });

  const queryUser = await prisma.users.count({
    where: {
      user_status: user_status.A,
    },
  });

  const currentYear = new Date().getFullYear();

  const queryCountsSend = await Promise.all(
    Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const startDate = new Date(
        `${currentYear}-${String(month).padStart(2, "0")}-01`
      );
      const endDate = new Date(currentYear, month, 0);

      return prisma.laporan
        .count({
          where: {
            laporan_status: status_laporan.S,
            laporan_tgl_send: {
              gte: startDate,
              lte: endDate,
            },
          },
        })
        .then((count) => ({ month, count }));
    })
  );

  const queryCountsDone = await Promise.all(
    Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const startDate = new Date(
        `${currentYear}-${String(month).padStart(2, "0")}-01`
      );
      const endDate = new Date(currentYear, month, 0);

      return prisma.laporan
        .count({
          where: {
            laporan_status: status_laporan.D,
            laporan_tgl_done: {
              gte: startDate,
              lte: endDate,
            },
          },
        })
        .then((count) => ({ month, count }));
    })
  );

  return {
    pengaduan: queryPengaduan,
    pegawai: queryPegawai,
    user: queryUser,
    permohonan: queryPermohonan,
    statistkSend: queryCountsSend,
    statistkDone: queryCountsDone,
    session: session,
  };
}
