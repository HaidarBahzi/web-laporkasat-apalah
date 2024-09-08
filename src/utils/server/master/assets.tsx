"use server";

import prisma from "@/utils/lib/prisma";
import { getSession } from "@/utils/lib/session";
import { join } from "path";
import { mkdir, stat, writeFile, unlink } from "fs/promises";
import { inputAssetType } from "@/components/options";

export async function GetAllAssets() {
  const query = await prisma.assets_mobile.findMany({
    select: {
      asset_id: true,
      asset_photo: true,
      asset_title: true,
      asset_type: true,
      asset_url: true,
    },
  });

  return query;
}

export async function GetDetailAssets(assetId: number) {
  const query = await prisma.assets_mobile.findUnique({
    where: {
      asset_id: assetId,
    },
    select: {
      asset_photo: true,
      asset_title: true,
      asset_url: true,
      asset_type: true,
    },
  });

  return query;
}

export async function DeleteAsset(assetId: number) {
  await prisma.assets_mobile.delete({
    where: {
      asset_id: assetId,
    },
  });
}

export async function SubmitAsset(formData: FormData) {
  await getSession();

  const date = new Date();

  const asetName = formData.get("asetName")?.toString()!;
  const asetType = formData.get("asetType")?.toString()!;
  const asetUrl = formData.get("asetUrl")?.toString()!;
  const asetImage = formData.get("asetPhoto") as File;

  const image = await UploadImage(asetImage);

  const honeypot = formData.get("userHoneypot")?.toString();

  if (honeypot !== "") {
    return { message: "Terjadi Kesalahan", type: "error" };
  }

  if (image.type == "failed") {
    return { message: "Gagal mengirim data asset", type: "error" };
  }

  const query = await prisma.assets_mobile.create({
    data: {
      asset_title: asetName,
      asset_type: inputAssetType[asetType],
      asset_photo: image.file!,
      asset_url: asetUrl,
      created_at: date.toISOString(),
    },
  });

  if (!query) {
    return { message: "Data asset gagal Di tambahkan", type: "error" };
  }

  return { message: "Data asset Berhasil Di tambahkan", type: "success" };
}

export async function EditAsset(
  formData: FormData,
  assetName: string,
  id: number
) {
  await getSession();

  const date = new Date();

  const asetName = formData.get("asetName")?.toString()!;
  const asetType = formData.get("asetType")?.toString()!;
  const asetUrl = formData.get("asetUrl")?.toString()!;
  const asetImage = formData.get("asetPhoto") as File;
  let image;

  const honeypot = formData.get("userHoneypot")?.toString();

  if (honeypot !== "") {
    return { message: "Terjadi Kesalahan", type: "error" };
  }

  if (asetImage.size != 0) {
    image = await EditImage(asetImage, assetName);

    if (image.type == "failed") {
      return { message: "Gagal mengubah data asset", type: "error" };
    }

    const query = await prisma.assets_mobile.update({
      where: {
        asset_id: id,
      },
      data: {
        asset_title: asetName,
        asset_type: inputAssetType[asetType],
        asset_photo: image.file!,
        asset_url: asetUrl,
        created_at: date.toISOString(),
      },
    });

    if (!query) {
      return { message: "Data asset gagal Di ubah", type: "error" };
    }

    return { message: "Data asset Berhasil Di ubah", type: "success" };
  }

  image = assetName;

  const query = await prisma.assets_mobile.update({
    where: {
      asset_id: id,
    },
    data: {
      asset_title: asetName,
      asset_type: inputAssetType[asetType],
      asset_photo: image,
      asset_url: asetUrl,
      created_at: date.toISOString(),
    },
  });

  if (!query) {
    return { message: "Data asset gagal Di ubah", type: "error" };
  }

  return { message: "Data asset Berhasil Di ubah", type: "success" };
}

async function UploadImage(file: File) {
  const relativeUploadDir = "/foto-aset";
  const buffer = await file.arrayBuffer();
  let filename = `aset-${Date.now()}.${file.type.split("/")[1]}`;

  const uploadDir = join(process.cwd(), "/assets", relativeUploadDir);

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

async function EditImage(file: File, oriFile: string) {
  const relativeUploadDir = "/foto-aset";
  const buffer = await file.arrayBuffer();

  const uploadDir = join(process.cwd(), "/assets", relativeUploadDir);

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
    await writeFile(`${uploadDir}/${oriFile}`, Buffer.from(buffer));

    return {
      message: "Gambar Berhasil Diupload!",
      type: "success",
      file: oriFile,
    };
  } catch (e) {
    console.error("Error while trying to upload a file\n", e);
    return { message: "Gambar Gagal Diupload!", type: "failed" };
  }
}

export async function DeleteImageAsset(filename: string) {
  const relativeUploadDir = "/foto-aset";

  const uploadDir = join(process.cwd(), "/assets", relativeUploadDir);

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
