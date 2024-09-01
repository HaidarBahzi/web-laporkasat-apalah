"use server";

import { status_laporan, type_laporan } from "@prisma/client";
import { join } from "path";
import { mkdir, stat, unlink, writeFile } from "fs/promises";
import prisma from "@/utils/lib/prisma";
import { getSession, updateSession } from "@/utils/lib/session";

export async function GetAllPengaduan() {
  const queryPengaduan = await prisma.laporan.findMany({
    where: {
      laporan_type: type_laporan.P,
    },
    select: {
      laporan_id: true,
      laporan_tgl_send: true,
      user_mail: true,
      laporan_title: true,
      laporan_description: true,
      laporan_location: true,
      pegawai_nip: true,
      laporan_status: true,
      laporan_document: true,
    },
  });

  const pengaduanWithUser = await Promise.all(
    queryPengaduan.map(async (pengaduan) => {
      const queryUser = await prisma.users.findUnique({
        where: {
          user_mail: pengaduan.user_mail,
        },
        select: {
          user_fullname: true,
          user_alamat: true,
          user_phone: true,
        },
      });

      const queryPegawai = await prisma.pegawai.findUnique({
        where: {
          pegawai_nip: pengaduan.pegawai_nip,
        },
        select: {
          pegawai_nama: true,
        },
      });

      return {
        ...pengaduan,
        user_fullname: queryUser ? queryUser.user_fullname : null,
        user_alamat: queryUser ? queryUser.user_alamat : null,
        user_phone: queryUser ? queryUser.user_phone : null,
        pegawai_nama: queryPegawai ? queryPegawai.pegawai_nama : null,
      };
    })
  );

  return pengaduanWithUser;
}

export async function GetAllPengaduanBidang(pegawaiNip: string) {
  const queryPengaduan = await prisma.laporan.findMany({
    where: {
      laporan_type: type_laporan.P,
      pegawai_nip: pegawaiNip,
    },
    select: {
      laporan_id: true,
      laporan_tgl_send: true,
      user_mail: true,
      laporan_title: true,
      laporan_description: true,
      laporan_location: true,
      pegawai_nip: true,
      laporan_status: true,
      laporan_document: true,
    },
  });

  const pengaduanWithUser = await Promise.all(
    queryPengaduan.map(async (pengaduan) => {
      const queryUser = await prisma.users.findUnique({
        where: {
          user_mail: pengaduan.user_mail,
        },
        select: {
          user_fullname: true,
          user_alamat: true,
          user_phone: true,
        },
      });

      const queryPegawai = await prisma.pegawai.findUnique({
        where: {
          pegawai_nip: pengaduan.pegawai_nip,
        },
        select: {
          pegawai_nama: true,
        },
      });

      return {
        ...pengaduan,
        user_fullname: queryUser ? queryUser.user_fullname : null,
        user_alamat: queryUser ? queryUser.user_alamat : null,
        user_phone: queryUser ? queryUser.user_phone : null,
        pegawai_nama: queryPegawai ? queryPegawai.pegawai_nama : null,
      };
    })
  );

  return pengaduanWithUser;
}

export async function DeletePengaduan(id: string) {
  await prisma.laporan.delete({
    where: {
      laporan_id: id,
    },
  });
}

export async function GetDetailPengaduan(pengaduanId: string) {
  const queryPengaduan = await prisma.laporan.findUnique({
    where: {
      laporan_id: pengaduanId,
    },
    select: {
      user_mail: true,
      laporan_title: true,
      laporan_location: true,
      laporan_description: true,
      laporan_document: true,
      laporan_status: true,
    },
  });

  const queryUser = await prisma.users.findUnique({
    where: {
      user_mail: queryPengaduan?.user_mail,
    },
    select: {
      user_mail: true,
      user_fullname: true,
      user_alamat: true,
      user_phone: true,
    },
  });

  return { pelapor: queryUser, pengaduan: queryPengaduan };
}

export async function ApproveLaporan(
  pengaduanId: string,
  status: status_laporan
) {
  await updateSession();

  const session = await getSession();

  const date = new Date();

  const query = await prisma.laporan.update({
    where: {
      laporan_id: pengaduanId,
    },
    data: {
      laporan_status: status,
      pegawai_nip: session.userId,
      laporan_tgl_confirm: date.toISOString(),
      updated_at: date.toISOString(),
    },
  });

  return query;
}

export async function ApproveLaporanKasat(
  pengaduanId: string,
  pegawaiNip: string
) {
  await updateSession();

  const date = new Date();

  const query = await prisma.laporan.update({
    where: {
      laporan_id: pengaduanId,
    },
    data: {
      pegawai_nip: pegawaiNip,
      laporan_status: status_laporan.P,
      updated_at: date.toISOString(),
    },
  });

  return query;
}

export async function DoneLaporan(pengaduanId: string) {
  await updateSession();

  const date = new Date();

  const query = await prisma.laporan.update({
    where: {
      laporan_id: pengaduanId,
    },
    data: {
      laporan_status: status_laporan.D,
      laporan_tgl_done: date.toISOString(),
      updated_at: date.toISOString(),
    },
  });

  return query;
}

export async function RejectLaporan(pengaduanId: string) {
  await updateSession();

  const date = new Date();

  const query = await prisma.laporan.update({
    where: {
      laporan_id: pengaduanId,
    },
    data: {
      laporan_status: status_laporan.D,
      laporan_tgl_reject: date.toISOString(),
      updated_at: date.toISOString(),
    },
  });

  return query;
}

export async function UploadImage(formData: FormData) {
  const pengaduanFoto = formData.get("pengaduanFoto") as File;

  const relativeUploadDir = "/foto-pengaduan";
  const buffer = await pengaduanFoto.arrayBuffer();
  let filename = `pengaduan-${Date.now()}.${pengaduanFoto.type.split("/")[1]}`;

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
    await writeFile(`${uploadDir}/${filename}`, Buffer.from(buffer));

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

export async function DeleteImagePengaduan(filename: string) {
  const relativeUploadDir = "/foto-pengaduan";

  const uploadDir = join(process.cwd(), "public", relativeUploadDir);

  try {
    await unlink(`${uploadDir}/${filename}`);

    return {
      message: "Gambar Gagal Dihapus!",
      type: "success",
    };
  } catch (e) {
    return { message: "Gambar Gagal Dihapus!", type: "failed" };
  }
}
