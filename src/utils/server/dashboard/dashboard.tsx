"use server";

import { inputRoleType } from "@/components/options";
import prisma from "@/utils/lib/prisma";
import {
  setup_status_aktif,
  status_laporan,
  type_laporan,
  user_status,
} from "@prisma/client";

function getMonthDateRange(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  return {
    startDate: new Date(startDate.getTime() - 24 * 60 * 60 * 1000),
    endDate,
  };
}

export async function GetDashboardAdmin() {
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

  const queryCountsUnconfirm = await Promise.all(
    Array.from({ length: 12 }, async (_, i) => {
      const month = i + 1;
      const { startDate, endDate } = getMonthDateRange(currentYear, month);

      const count = await prisma.laporan.count({
        where: {
          laporan_status: status_laporan.S,
          laporan_tgl_send: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      return { month, count };
    })
  );

  const queryCountsConfirmed = await Promise.all(
    Array.from({ length: 12 }, async (_, i) => {
      const month = i + 1;
      const { startDate, endDate } = getMonthDateRange(currentYear, month);

      const count = await prisma.laporan.count({
        where: {
          laporan_status: status_laporan.C,
          laporan_tgl_send: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      return { month, count };
    })
  );

  const queryCountsProgress = await Promise.all(
    Array.from({ length: 12 }, async (_, i) => {
      const month = i + 1;
      const { startDate, endDate } = getMonthDateRange(currentYear, month);

      const count = await prisma.laporan.count({
        where: {
          laporan_status: status_laporan.P,
          laporan_tgl_send: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      return { month, count };
    })
  );

  const queryCountsRejected = await Promise.all(
    Array.from({ length: 12 }, async (_, i) => {
      const month = i + 1;
      const { startDate, endDate } = getMonthDateRange(currentYear, month);

      const count = await prisma.laporan.count({
        where: {
          laporan_status: status_laporan.R,
          laporan_tgl_send: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      return { month, count };
    })
  );

  const queryCountsDone = await Promise.all(
    Array.from({ length: 12 }, async (_, i) => {
      const month = i + 1;
      const { startDate, endDate } = getMonthDateRange(currentYear, month);

      const count = await prisma.laporan.count({
        where: {
          laporan_status: status_laporan.D,
          laporan_tgl_send: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      return { month, count };
    })
  );

  return {
    pengaduan: queryPengaduan,
    pegawai: queryPegawai,
    user: queryUser,
    permohonan: queryPermohonan,
    statistkUnconfirm: queryCountsUnconfirm,
    statistikConfirmed: queryCountsConfirmed,
    statistikProgress: queryCountsProgress,
    statistikRejected: queryCountsRejected,
    statistkDone: queryCountsDone,
  };
}

export async function GetDashboardBidang(userRole: string) {
  const queryPengaduan = await prisma.laporan.count({
    where: {
      laporan_type: type_laporan.P,
      laporan_action: inputRoleType[userRole],
    },
  });

  const queryPermohonan = await prisma.laporan.count({
    where: {
      laporan_type: type_laporan.B,
      laporan_action: inputRoleType[userRole],
    },
  });

  const currentYear = new Date().getFullYear();

  const queryCountsUnconfirm = await Promise.all(
    Array.from({ length: 12 }, async (_, i) => {
      const month = i + 1;
      const { startDate, endDate } = getMonthDateRange(currentYear, month);

      const count = await prisma.laporan.count({
        where: {
          laporan_status: status_laporan.S,
          laporan_action: inputRoleType[userRole],
          laporan_tgl_send: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      return { month, count };
    })
  );

  const queryCountsConfirmed = await Promise.all(
    Array.from({ length: 12 }, async (_, i) => {
      const month = i + 1;
      const { startDate, endDate } = getMonthDateRange(currentYear, month);

      const count = await prisma.laporan.count({
        where: {
          laporan_status: status_laporan.C,
          laporan_action: inputRoleType[userRole],
          laporan_tgl_send: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      return { month, count };
    })
  );

  const queryCountsProgress = await Promise.all(
    Array.from({ length: 12 }, async (_, i) => {
      const month = i + 1;
      const { startDate, endDate } = getMonthDateRange(currentYear, month);

      const count = await prisma.laporan.count({
        where: {
          laporan_status: status_laporan.P,
          laporan_action: inputRoleType[userRole],
          laporan_tgl_send: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      return { month, count };
    })
  );

  const queryCountsRejected = await Promise.all(
    Array.from({ length: 12 }, async (_, i) => {
      const month = i + 1;
      const { startDate, endDate } = getMonthDateRange(currentYear, month);

      const count = await prisma.laporan.count({
        where: {
          laporan_status: status_laporan.R,
          laporan_action: inputRoleType[userRole],
          laporan_tgl_send: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      return { month, count };
    })
  );

  const queryCountsDone = await Promise.all(
    Array.from({ length: 12 }, async (_, i) => {
      const month = i + 1;
      const { startDate, endDate } = getMonthDateRange(currentYear, month);

      const count = await prisma.laporan.count({
        where: {
          laporan_status: status_laporan.D,
          laporan_action: inputRoleType[userRole],
          laporan_tgl_send: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      return { month, count };
    })
  );

  return {
    pengaduan: queryPengaduan,
    permohonan: queryPermohonan,
    statistkUnconfirm: queryCountsUnconfirm,
    statistikConfirmed: queryCountsConfirmed,
    statistikProgress: queryCountsProgress,
    statistikRejected: queryCountsRejected,
    statistkDone: queryCountsDone,
  };
}
