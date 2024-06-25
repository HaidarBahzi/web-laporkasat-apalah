"use server";

import prisma from "@/utils/lib/prisma";
import { asset_status, status_laporan } from "@prisma/client";

export async function GetDashboard(userKtp: string) {
  const fetchCarausel = await prisma.assets_mobile.findMany({
    where: {
      asset_type: asset_status.C,
    },
    select: {
      asset_photo: true,
    },
  });

  const carausel = fetchCarausel.map((value) => value.asset_photo);

  const fetchStatisticSendCount = await prisma.laporan.count({
    where: {
      user_ktp: userKtp,
      laporan_status: status_laporan.S,
    },
  });

  const fetchStatisticConfirmCount = await prisma.laporan.count({
    where: {
      laporan_status: status_laporan.C,
    },
  });

  const fetchStatisticProgressCount = await prisma.laporan.count({
    where: {
      laporan_status: status_laporan.P,
    },
  });

  const fetchStatisticDoneCount = await prisma.laporan.count({
    where: {
      laporan_status: status_laporan.D,
    },
  });

  const fetchStatistic = await prisma.assets_mobile.findMany({
    where: {
      asset_type: asset_status.I,
      asset_url: {
        startsWith: "/statistik-",
      },
    },
    select: {
      asset_photo: true,
      asset_title: true,
      asset_url: true,
    },
  });

  const fetchBoxes = await prisma.assets_mobile.findMany({
    where: {
      asset_type: asset_status.I,
    },
    select: {
      asset_photo: true,
      asset_title: true,
      asset_url: true,
    },
  });

  return {
    carausel: carausel,
    statistic: fetchStatistic,
    statistic_count: {
      statistic_send: fetchStatisticSendCount,
      statistic_confirm: fetchStatisticConfirmCount,
      statistic_progress: fetchStatisticProgressCount,
      statistic_done: fetchStatisticDoneCount,
    },
    layanan: fetchBoxes,
  };
}
