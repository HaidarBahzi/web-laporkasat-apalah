"use server";

import prisma from "@/utils/lib/prisma";
import { status_laporan, type_laporan } from "@prisma/client";
import { getSession, updateSession } from "@/utils/lib/session";
import { join } from "path";
import { mkdir, stat, unlink, writeFile } from "fs/promises";
import { inputRoleType } from "@/components/options";

export async function GetAllPermohonanBantuan() {
  const queryPermohonan = await prisma.laporan.findMany({
    where: {
      laporan_type: type_laporan.B,
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

  const permohonanWithUser = await Promise.all(
    queryPermohonan.map(async (permohonan) => {
      const queryUser = await prisma.users.findUnique({
        where: {
          user_ktp: permohonan.user_ktp,
        },
        select: {
          user_fullname: true,
          user_alamat: true,
          user_phone: true,
        },
      });

      return {
        ...permohonan,
        user_fullname: queryUser ? queryUser.user_fullname : null,
        user_alamat: queryUser ? queryUser.user_alamat : null,
        user_phone: queryUser ? queryUser.user_phone : null,
      };
    })
  );

  return permohonanWithUser;
}

export async function GetDetailPermohonanBantuan(permohonanId: string) {
  const queryPermohonan = await prisma.laporan.findUnique({
    where: {
      laporan_id: permohonanId,
    },
    select: {
      user_ktp: true,
      laporan_title: true,
      laporan_description: true,
      laporan_location: true,
      laporan_document: true,
      laporan_status: true,
    },
  });

  const queryUser = await prisma.users.findUnique({
    where: {
      user_ktp: queryPermohonan?.user_ktp,
    },
    select: {
      user_ktp: true,
      user_fullname: true,
      user_alamat: true,
      user_phone: true,
    },
  });

  return { permohonan: queryPermohonan, user: queryUser };
}

export async function ApprovePermohonan(
  permohonanId: string,
  status: status_laporan
) {
  await updateSession();

  const session = await getSession();

  const date = new Date();

  const query = await prisma.laporan.update({
    where: {
      laporan_id: permohonanId,
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

export async function DeletePermohonanBantuan(id: string) {
  await prisma.laporan.delete({
    where: {
      laporan_id: id,
    },
  });
}

export async function SubmitPermohonanBantuan(formData: FormData) {
  await getSession();

  const { v4: uuidv4 } = require("uuid");
  const date = new Date();

  const userKtp = formData.get("permohonanKtp")?.toString();
  const judul = formData.get("permohonanJudul")?.toString();
  const alamat = formData.get("permohonanAlamat")?.toString();
  const keterangan = formData.get("permohonanKeterangan")?.toString();
  const document = formData.get("permohonanDocument") as File;
  const pdf = await UploadPDF(document);

  const honeypot = formData.get("userHoneypot")?.toString();

  if (honeypot !== "") {
    return { message: "Terjadi Kesalahan", type: "error" };
  }

  const checkUser = await prisma.users.count({
    where: {
      user_ktp: userKtp,
    },
  });

  if (checkUser == 0) {
    return { message: "User dengan Ktp ini tidak ada", type: "error" };
  }

  if (pdf.type == "failed") {
    return { message: "Gagal mengirim data permohonan", type: "error" };
  }

  const query = await prisma.laporan.create({
    data: {
      laporan_id: uuidv4(),
      user_ktp: userKtp!,
      laporan_title: judul!,
      laporan_description: keterangan!,
      laporan_location: alamat!,
      laporan_document: pdf.file!,
      laporan_type: type_laporan.B,
      laporan_status: status_laporan.S,
      laporan_tgl_send: date.toISOString(),

      created_at: date.toISOString(),
    },
  });

  if (!query) {
    return { message: "Data permohonan gagal Di tambahkan", type: "error" };
  }

  return { message: "Data permohonan Berhasil Di tambahkan", type: "success" };
}

export async function UploadPDF(
  file: File
): Promise<{ message: string; type: string; file?: string }> {
  const buffer = await file.arrayBuffer();
  const relativeUploadDir = "/pdf-uploads";
  const filename = `surat_permohonan-${Date.now()}.pdf`;
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
      return { message: "PDF Gagal Diupload!", type: "failed" };
    }
  }

  try {
    await writeFile(`${uploadDir}/${filename}`, Buffer.from(buffer));
    return {
      message: "PDF Berhasil Diupload!",
      type: "success",
      file: filename,
    };
  } catch (e) {
    console.error("Error while trying to upload a file\n", e);
    return { message: "PDF Gagal Diupload!", type: "failed" };
  }
}

export async function DeleteDokumenPermohonan(filename: string) {
  const relativeUploadDir = "/pdf-uploads";

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
