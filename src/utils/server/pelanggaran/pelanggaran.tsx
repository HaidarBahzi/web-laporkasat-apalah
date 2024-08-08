"use server";

import {
  PelanggaranTindakForm,
  inputJkType,
  inputTindakStatus,
} from "@/components/options";
import prisma from "@/utils/lib/prisma";
import { join } from "path";
import { mkdir, stat, unlink, writeFile } from "fs/promises";
import { status_laporan } from "@prisma/client";

export async function CheckPelanggaran(laporanId: string) {
  const query = await prisma.pelanggaran.count({
    where: {
      laporan_id: laporanId,
    },
  });

  return query;
}

export async function CheckLaporan(
  laporanId: string,
  laporanStatus: status_laporan
) {
  const query = await prisma.laporan.count({
    where: {
      laporan_id: laporanId,
      laporan_status: laporanStatus,
    },
  });

  return query;
}

export async function GetDetailPelanggaran(tindakId: string) {
  const queryTindak = await prisma.tindak_lanjut.findUnique({
    where: {
      tindak_lanjut_id: tindakId,
    },
    select: {
      pelanggaran_id: true,
    },
  });

  const queryPelanggaran = await prisma.pelanggaran.findUnique({
    where: {
      pelanggaran_id: queryTindak?.pelanggaran_id!,
    },
    select: {
      pelanggar_fullname: true,
      pelanggar_ayah: true,
      pelanggar_tempat_lahir: true,
      pelanggar_tanggal_lahir: true,
      pelanggar_jk: true,
      pelanggar_agama: true,
      pelanggar_pendidikan: true,
      pelanggar_kewarnegaraan: true,
      pelanggar_kawin: true,
      pelanggar_phone: true,
      pelanggar_alamat: true,

      saksi_1_fullname: true,
      saksi_1_tempat_lahir: true,
      saksi_1_tanggal_lahir: true,
      saksi_1_jk: true,
      saksi_1_agama: true,
      saksi_1_pendidikan: true,
      saksi_1_kewarnegaraan: true,
      saksi_1_kawin: true,
      saksi_1_phone: true,
      saksi_1_alamat: true,

      saksi_2_fullname: true,
      saksi_2_tempat_lahir: true,
      saksi_2_tanggal_lahir: true,
      saksi_2_jk: true,
      saksi_2_agama: true,
      saksi_2_pendidikan: true,
      saksi_2_kewarnegaraan: true,
      saksi_2_kawin: true,
      saksi_2_phone: true,
      saksi_2_alamat: true,

      penyidik_id: true,
      tindakan_detail: true,
      tindakan_pelaksanaan: true,

      bukti_kejadian: true,
      bukti_barang: true,
      bukti_penyegelan: true,

      dokumen_ktp: true,
      dokumen_sp: true,
      dokumen_sp1: true,
      dokumen_sp2: true,
      dokumen_sp3: true,
      dokumen_lk: true,
      dokumen_spp: true,
      dokumen_bap: true,
      dokumen_p3bb: true,
      dokumen_psk: true,
      dokumen_bapc: true,
      dokumen_pst: true,
    },
  });

  const queryPelanggaranInclude = await prisma.pelanggaran.findUnique({
    where: {
      pelanggaran_id: queryTindak?.pelanggaran_id!,
    },
  });

  const queryPengaduan = await prisma.laporan.findUnique({
    where: {
      laporan_id: queryPelanggaranInclude?.laporan_id,
    },
  });

  const queryUser = await prisma.users.findUnique({
    where: {
      user_ktp: queryPelanggaranInclude?.user_ktp,
    },
  });

  return {
    pelanggaran: queryPelanggaran,
    pengaduan: queryPengaduan,
    user: queryUser,
  };
}

export async function DeleteTindakPelanggaran(
  pelanggaranId: string,
  tindakId: string,
  laporanId: string
) {
  await prisma.tindak_lanjut.delete({
    where: {
      tindak_lanjut_id: tindakId,
    },
  });

  await prisma.pelanggaran.delete({
    where: {
      pelanggaran_id: pelanggaranId,
    },
  });

  await unlink(`/foto-pelanggaran/${laporanId}`);
}

export async function SubmitPelanggaran(
  data: PelanggaranTindakForm,
  userKtp: string,
  pegawaiNip: string,
  tindakType: string,
  laporanId: string
) {
  const { v4: uuid } = require("uuid");

  const pelanggarId = uuid();
  const tindakId = uuid();

  const date = new Date();

  const uploadKtp = await UploadDocument(
    data.bukti.dokumen_ktp,
    laporanId,
    "Ktp"
  );

  const uploadSp = await UploadDocument(
    data.bukti.dokumen_sp,
    laporanId,
    "Surat-Pernyataan"
  );

  const uploadSp1 = await UploadDocument(
    data.bukti.dokumen_sp1,
    laporanId,
    "Surat-Peringatan-1"
  );

  const uploadSp2 = await UploadDocument(
    data.bukti.dokumen_sp2,
    laporanId,
    "Surat-Peringatan-2"
  );

  const uploadSp3 = await UploadDocument(
    data.bukti.dokumen_sp3,
    laporanId,
    "Surat-Peringatan-3"
  );

  const uploadLk = await UploadDocument(
    data.bukti.dokumen_lk,
    laporanId,
    "Laporan-Kejadian"
  );

  const uploadSpp = await UploadDocument(
    data.bukti.dokumen_spp,
    laporanId,
    "Surat-Perintah-Penyitaan"
  );

  const uploadBap = await UploadDocument(
    data.bukti.dokumen_bap,
    laporanId,
    "Berita-Acara-Penyitaan"
  );

  const uploadP3bb = await UploadDocument(
    data.bukti.dokumen_p3bb,
    laporanId,
    "Permohonan-Persetujuan"
  );

  const uploadPsk = await UploadDocument(
    data.bukti.dokumen_psk,
    laporanId,
    "Surat-Kuasa"
  );

  const uploadBapc = await UploadDocument(
    data.bukti.dokumen_bapc,
    laporanId,
    "Berita-Acara-Pemeriksaan"
  );

  const uploadPst = await UploadDocument(
    data.bukti.dokumen_pst,
    laporanId,
    "Permohonan-Sidang"
  );

  const uploadKejadian = await UploadDocument(
    data.bukti.bukti_kejadian,
    laporanId,
    "Bukti-Kejadian"
  );

  const uploadBarang = await UploadDocument(
    data.bukti.bukti_barang,
    laporanId,
    "Bukti-Barang"
  );

  const uploadPenyegelan = await UploadDocument(
    data.bukti.bukti_penyegelan,
    laporanId,
    "Bukti-Penyegelan"
  );

  const queryPelanggaran = await prisma.pelanggaran.create({
    data: {
      pelanggaran_id: pelanggarId,
      user_ktp: userKtp,
      laporan_id: laporanId,

      pelanggar_fullname: data.pelanggar.nama,
      pelanggar_ayah: data.pelanggar.ayah,
      pelanggar_tempat_lahir: data.pelanggar.tempat_lahir,
      pelanggar_tanggal_lahir: new Date(data.pelanggar.tanggal_lahir),
      pelanggar_jk: inputJkType[data.pelanggar.pelanggarJk],
      pelanggar_agama: Number(data.pelanggar.agama),
      pelanggar_pendidikan: Number(data.pelanggar.pendidikan),
      pelanggar_kewarnegaraan: data.pelanggar.kewarganegaraan,
      pelanggar_kawin: Number(data.pelanggar.status_kawin),
      pelanggar_phone: data.pelanggar.phone,
      pelanggar_alamat: data.pelanggar.alamat,

      saksi_1_fullname: data.saksi1.nama,
      saksi_1_tempat_lahir: data.saksi1.tempat_lahir,
      saksi_1_tanggal_lahir: new Date(data.saksi1.tanggal_lahir),
      saksi_1_jk: inputJkType[data.saksi1.jenis_kelamin],
      saksi_1_agama: Number(data.saksi1.agama),
      saksi_1_pendidikan: Number(data.saksi1.pendidikan),
      saksi_1_kewarnegaraan: data.saksi1.kewarganegaraan,
      saksi_1_kawin: Number(data.saksi1.status_kawin),
      saksi_1_phone: data.saksi1.phone,
      saksi_1_alamat: data.saksi1.alamat,

      saksi_2_fullname: data.saksi2.nama,
      saksi_2_tempat_lahir: data.saksi2.tempat_lahir,
      saksi_2_tanggal_lahir: new Date(data.saksi2.tanggal_lahir),
      saksi_2_jk: inputJkType[data.saksi2.jenis_kelamin],
      saksi_2_agama: Number(data.saksi2.agama),
      saksi_2_pendidikan: Number(data.saksi2.pendidikan),
      saksi_2_kewarnegaraan: data.saksi2.kewarganegaraan,
      saksi_2_kawin: Number(data.saksi2.status_kawin),
      saksi_2_phone: data.saksi2.phone,
      saksi_2_alamat: data.saksi2.alamat,

      penyidik_id: data.tindakan.penyidik,
      tindakan_detail: data.tindakan.tindak,
      tindakan_pelaksanaan: data.tindakan.pelaksanaan,

      bukti_barang: uploadBarang.file!,
      bukti_kejadian: uploadKejadian.file!,
      bukti_penyegelan: uploadPenyegelan.file!,

      dokumen_ktp: uploadKtp.file!,
      dokumen_sp: uploadSp.file!,
      dokumen_sp1: uploadSp1.file!,
      dokumen_sp2: uploadSp2.file!,
      dokumen_sp3: uploadSp3.file!,
      dokumen_lk: uploadLk.file!,
      dokumen_spp: uploadSpp.file!,
      dokumen_bap: uploadBap.file!,
      dokumen_p3bb: uploadP3bb.file!,
      dokumen_psk: uploadPsk.file!,
      dokumen_bapc: uploadBapc.file!,
      dokumen_pst: uploadPst.file!,

      created_at: date.toISOString(),
    },
  });

  const queryTindak = await prisma.tindak_lanjut.create({
    data: {
      tindak_lanjut_id: tindakId,
      tindak_lanjut_type: inputTindakStatus[tindakType],
      pelanggaran_id: pelanggarId,
      pegawai_nip: pegawaiNip,

      created_at: date.toISOString(),
    },
  });

  if (!queryPelanggaran || !queryTindak) {
    return { message: "Pengaduan Gagal Di tindaklanjut", type: "error" };
  }

  return { message: "Pengaduan Berhasil Di tindaklanjut", type: "success" };
}

async function UploadDocument(
  file: string,
  laporanId: string,
  typeDoc: string
) {
  const relativeUploadDir = `/foto-pelanggaran/${laporanId}/${typeDoc}`;
  let filename = `dokumen-${typeDoc}.jpg`;

  const uploadDir = join(process.cwd(), "public", relativeUploadDir);

  try {
    await stat(uploadDir);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error(
        "Error while trying to create directory when uploading a file\n",
        e
      );
      return { message: "Gambar Gagal Diupload!", type: "failed" };
    }
  }

  try {
    await writeFile(`${uploadDir}/${filename}`, Buffer.from(file));

    return {
      message: "Gambar Berhasil Diupload!",
      type: "success",
      file: filename,
    };
  } catch (e) {
    console.error("Error while trying to upload a file\n", e);
    return { message: "Gambar Gagal Diupload!", type: "failed" };
  }
}
