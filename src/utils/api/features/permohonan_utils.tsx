"use server";

import { join } from "path";
import { mkdir, stat, writeFile } from "fs/promises";
import prisma from "@/utils/lib/prisma";
import { type_laporan } from "@prisma/client";
import Client from "node-scp";

export async function SubmitPermohonan(
  userKtp: string,
  permohonanTitle: string,
  permohonanDescription: string,
  permohonanLocation: string,
  permohonanDocument: string
) {
  const { v4: uuidv4 } = require("uuid");
  const date = new Date();

  const query = await prisma.laporan.create({
    data: {
      laporan_id: uuidv4(),
      user_mail: userKtp,
      laporan_title: permohonanTitle,
      laporan_description: permohonanDescription,
      laporan_location: permohonanLocation,
      laporan_document: permohonanDocument,
      laporan_type: type_laporan.B,
      pegawai_nip: "",
      laporan_tgl_send: date.toISOString(),

      created_at: date.toISOString(),
    },
  });

  return query;
}

export async function UploadPDF(
  base64PDF: string
): Promise<{ message: string; type: string; file?: string }> {
  const buffer = Buffer.from(base64PDF, "base64");
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
    const localFilePath = `${uploadDir}/${filename}`;
    await writeFile(localFilePath, buffer);

    try {
      const client = await Client({
        host: "103.30.180.221",
        port: 2233,
        username: "vps2-bkpsdm",
        password: "vps2BkpSdm-KUDu5!!",
      });

      const check = await client.exists("www/pdf-uploads");

      if (check == false) {
        await client.mkdir("www/pdf-uploads");
      }

      await client.uploadFile(localFilePath, `www/pdf-uploads/${filename}`);
      client.close();

      return {
        message: "Gambar Berhasil Diupload dan Dikirim ke Server!",
        type: "success",
        file: filename,
      };
    } catch (scpError) {
      console.error("SCP Upload Error\n", scpError);
      return {
        message: "Gambar Diupload Lokal, tetapi Gagal Dikirim ke Server!",
        type: "failed",
      };
    }
  } catch (e) {
    console.error("Error while trying to upload a file\n", e);
    return { message: "Gambar Gagal Diupload!", type: "failed" };
  }
}
