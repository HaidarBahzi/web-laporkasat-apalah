"use server";

import { status_laporan, type_laporan } from "@prisma/client";
import { join } from "path";
import { mkdir, stat, unlink, writeFile } from "fs/promises";
import prisma from "@/utils/lib/prisma";
import { getSession, updateSession } from "@/utils/lib/session";
import { inputRoleType } from "@/components/options";

export async function GetAllPengaduan() {
  const queryPengaduan = await prisma.laporan.findMany({
    where: {
      laporan_type: type_laporan.P,
    },
    select: {
      laporan_id: true,
      laporan_tgl_send: true,
      user_ktp: true,
      laporan_title: true,
      laporan_description: true,
      laporan_location: true,
      laporan_action: true,
      laporan_status: true,
      laporan_document: true,
    },
  });

  const pengaduanWithUser = await Promise.all(
    queryPengaduan.map(async (pengaduan) => {
      const queryUser = await prisma.users.findUnique({
        where: {
          user_ktp: pengaduan.user_ktp,
        },
        select: {
          user_fullname: true,
          user_alamat: true,
          user_phone: true,
        },
      });

      return {
        ...pengaduan,
        user_fullname: queryUser ? queryUser.user_fullname : null,
        user_alamat: queryUser ? queryUser.user_alamat : null,
        user_phone: queryUser ? queryUser.user_phone : null,
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

export async function SubmitPengaduan(formData: FormData) {
  const { v4: uuidv4 } = require("uuid");
  const date = new Date();

  const pengaduanKtp = formData.get("pengaduanKtp")?.toString();
  const pengaduanJudul = formData.get("pengaduanJudul")?.toString();
  const pengaduanAlamat = formData.get("pengaduanAlamat")?.toString();
  const pengaduanKeterangan = formData.get("pengaduanKeterangan")?.toString();
  const pengaduanFoto = await UploadImage(formData);

  const honeypot = formData.get("userHoneypot")?.toString();

  if (honeypot !== "") {
    return { message: "Terjadi Kesalahan", type: "error" };
  }

  const checkUser = await prisma.users.count({
    where: {
      user_ktp: pengaduanKtp,
    },
  });

  if (checkUser == 0) {
    return { message: "User dengan Ktp ini tidak ada", type: "error" };
  }

  const query = await prisma.laporan.create({
    data: {
      laporan_id: uuidv4(),
      user_ktp: pengaduanKtp!,
      laporan_title: pengaduanJudul!,
      laporan_location: pengaduanAlamat!,
      laporan_tgl_send: date.toISOString(),
      laporan_status: status_laporan.S,
      laporan_document: pengaduanFoto?.file!,
      laporan_description: pengaduanKeterangan!,
      laporan_type: type_laporan.P,
      created_at: date.toISOString(),
    },
  });

  if (!query) {
    return { message: "Pengaduan Gagal Di tambah", type: "error" };
  }

  return { message: "Pengaduan Berhasil Di tambah", type: "success" };
}

export async function GetDetailPengaduan(pengaduanId: string) {
  const queryPengaduan = await prisma.laporan.findUnique({
    where: {
      laporan_id: pengaduanId,
    },
    select: {
      user_ktp: true,
      laporan_title: true,
      laporan_location: true,
      laporan_description: true,
      laporan_document: true,
      laporan_status: true,
    },
  });

  const queryUser = await prisma.users.findUnique({
    where: {
      user_ktp: queryPengaduan?.user_ktp,
    },
    select: {
      user_ktp: true,
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
      laporan_action: inputRoleType[session.role!],
      laporan_tgl_confirm: date.toISOString(),
      updated_at: date.toISOString(),
    },
  });

  return query;
}

export async function ApproveLaporanKasat(pengaduanId: string, role: string) {
  await updateSession();

  const date = new Date();

  const query = await prisma.laporan.update({
    where: {
      laporan_id: pengaduanId,
    },
    data: {
      laporan_action: inputRoleType[role!],
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
