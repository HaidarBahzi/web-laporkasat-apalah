"use server";

import { join } from "path";
import { mkdir, stat, writeFile } from "fs/promises";
import prisma from "@/utils/lib/prisma";
import { status_laporan, type_laporan } from "@prisma/client";

export async function SendPengaduan(
  userKtp: string,
  pengaduanTitle: string,
  pengaduanKet: string,
  pengaduanAlamat: string,
  pengaduanPhoto: string
) {
  const { v4: uuidv4 } = require("uuid");
  const date = new Date();

  const query = await prisma.laporan.create({
    data: {
      laporan_id: uuidv4(),
      user_ktp: userKtp,
      laporan_title: pengaduanTitle,
      laporan_description: pengaduanKet,
      laporan_location: pengaduanAlamat,
      laporan_document: pengaduanPhoto,
      laporan_type: type_laporan.P,
      laporan_status: status_laporan.S,
      laporan_tgl_send: date.toISOString(),

      created_at: date.toISOString(),
    },
  });

  return query;
}

export async function UploadImage(
  base64Image: string
): Promise<{ message: string; type: string; file?: string }> {
  const buffer = Buffer.from(base64Image, "base64");
  const relativeUploadDir = "/foto-pengaduan";
  const filename = `pengaduan-${Date.now()}.jpg`;
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
    await writeFile(`${uploadDir}/${filename}`, buffer);
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
