"use server";

import prisma from "@/utils/lib/prisma";
import { type_laporan } from "@prisma/client";

export async function GetAllPermohonanTindak() {
  const query = await prisma.tindak_lanjut.findMany({
    select: {
      tindak_lanjut_id: true,
      pelanggaran_id: true,
      laporan_id: true,
      pegawai_nip: true,
      tindak_lanjut_type: true,
    },
  });

  const withCheckLaporan = await Promise.all(
    query.map(async (laporan) => {
      const queryPelanggaran = await prisma.pelanggaran.findUnique({
        where: {
          laporan_id: laporan.laporan_id!,
        },
        select: {
          laporan_id: true,
        },
      });

      const queryLaporan = await prisma.laporan.findUnique({
        where: {
          laporan_id: queryPelanggaran?.laporan_id!,
          laporan_type: type_laporan.B,
        },
        select: {
          laporan_tgl_send: true,
          laporan_tgl_confirm: true,
          laporan_tgl_progress: true,
          user_mail: true,
          laporan_title: true,
          laporan_location: true,
          laporan_status: true,
        },
      });

      const queryPegawai = await prisma.pegawai.findUnique({
        where: {
          pegawai_nip: laporan.pegawai_nip,
        },
        select: {
          pegawai_nama: true,
        },
      });

      return {
        ...laporan,
        laporan_id: queryPelanggaran?.laporan_id!,
        laporan_tgl_confirm: queryLaporan?.laporan_tgl_confirm!,
        laporan_tgl_progress: queryLaporan?.laporan_tgl_progress!,
        laporan_tgl_send: queryLaporan?.laporan_tgl_send!,
        laporan_title: queryLaporan?.laporan_title!,
        laporan_location: queryLaporan?.laporan_location!,
        laporan_action: queryPegawai?.pegawai_nama!,
        laporan_status: queryLaporan?.laporan_status!,
      };
    })
  );

  return withCheckLaporan;
}
