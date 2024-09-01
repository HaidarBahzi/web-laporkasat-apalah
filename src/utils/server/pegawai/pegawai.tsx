"use server";

import { setup_status_aktif } from "@prisma/client";

import { mkdir, stat, unlink, writeFile } from "fs/promises";
import { join } from "path";
import { updateSession } from "@/utils/lib/session";
import prisma from "@/utils/lib/prisma";
import { inputJkType, inputRoleType } from "@/components/options";
import Client from "node-scp";

export async function GetAllPegawai() {
  const queryPegawai = await prisma.pegawai.findMany({
    select: {
      pegawai_nip: true,
      pegawai_nama: true,
      bidang_id: true,
      pegawai_jabatan: true,
      pegawai_jk: true,
      pendidikan_id: true,
      status_pegawai_id: true,
      pegawai_role: true,
      pegawai_status: true,
      pegawai_foto: true,
    },
  });

  const bidangDetails = await Promise.all(
    queryPegawai.map(async (pegawai) => {
      const bidang = await prisma.setup_bidang.findUnique({
        where: { bidang_id: pegawai.bidang_id },
        select: { bidang_nama: true },
      });
      return {
        [pegawai.bidang_id]: { bidang_nama: bidang?.bidang_nama || null },
      };
    })
  );

  const pendidikanDetails = await Promise.all(
    queryPegawai.map(async (pegawai) => {
      const pendidikan = await prisma.setup_pendidikan.findUnique({
        where: { pendidikan_id: pegawai.pendidikan_id },
        select: { pendidikan_nama: true },
      });
      return {
        [pegawai.pendidikan_id]: {
          pendidikan_nama: pendidikan?.pendidikan_nama || null,
        },
      };
    })
  );

  const statusPegawaiDetails = await Promise.all(
    queryPegawai.map(async (pegawai) => {
      const status = await prisma.setup_status_pegawai.findUnique({
        where: { status_pegawai_id: pegawai.status_pegawai_id },
        select: { status_pegawai_nama: true },
      });
      return {
        [pegawai.status_pegawai_id]: {
          status_pegawai_nama: status?.status_pegawai_nama || null,
        },
      };
    })
  );

  return {
    pegawai: queryPegawai,
    bidang: Object.assign({}, ...bidangDetails),
    pendidikan: Object.assign({}, ...pendidikanDetails),
    status: Object.assign({}, ...statusPegawaiDetails),
  };
}

export async function GetDetailPegawai(pegawaiNip: string) {
  const query = await prisma.pegawai.findUnique({
    where: {
      pegawai_nip: pegawaiNip,
    },
    select: {
      pegawai_nip: true,
      pegawai_nik: true,
      pegawai_password: true,
      pegawai_nama: true,
      pegawai_jk: true,
      pegawai_tempat_lahir: true,
      pegawai_tanggal_lahir: true,
      pegawai_phone: true,
      pegawai_email: true,
      pegawai_alamat: true,
      pegawai_foto: true,
      pegawai_jabatan: true,

      agama_id: true,
      pendidikan_id: true,
      status_pegawai_id: true,
      status_kawin_id: true,

      pegawai_kewarganegaraan: true,
      pegawai_status: true,
      pegawai_role: true,
      bidang_id: true,
    },
  });

  return query;
}

export async function DeletePegawai(pegawaiNip: string) {
  await updateSession();

  await prisma.pegawai.delete({
    where: {
      pegawai_nip: pegawaiNip,
    },
  });
}

export async function FetchInputPegawai() {
  const queryBidang = await prisma.setup_bidang.findMany({
    select: {
      bidang_id: true,
      bidang_singkatan: true,
      bidang_nama: true,
    },
  });

  const queryPendidikan = await prisma.setup_pendidikan.findMany({
    select: {
      pendidikan_id: true,
      pendidikan_nama: true,
    },
  });

  const queryStatusPegawai = await prisma.setup_status_pegawai.findMany({
    select: {
      status_pegawai_id: true,
      status_pegawai_nama: true,
    },
  });

  const queryKawin = await prisma.setup_kawin.findMany({
    select: {
      status_kawin_id: true,
      status_kawin_nama: true,
    },
  });

  const queryAgama = await prisma.setup_agama.findMany({
    select: {
      agama_id: true,
      agama_nama: true,
    },
  });

  return {
    bidang: queryBidang,
    pendidikan: queryPendidikan,
    status: queryStatusPegawai,
    kawin: queryKawin,
    agama: queryAgama,
  };
}

export async function SubmitPegawaiData(formData: FormData) {
  await updateSession();

  const bcrypt = require("bcrypt");

  const date = new Date();

  const pegawaiNip = formData.get("pegawaiNip")?.toString();
  const pegawaiNik = formData.get("pegawaiNik")?.toString();
  const pegawaiNama = formData.get("pegawaiNama")?.toString();
  const pegawaiAlamat = formData.get("pegawaiAlamat")?.toString();
  const pegawaiTptLahir = formData.get("pegawaiTptLahir")?.toString();
  const pegawaiTglLahir = formData.get("pegawaiTglLahir")?.toString();
  const pegawaiJk = formData.get("pegawaiJk")?.toString();
  const pegawaiAgama = formData.get("pegawaiAgama")?.toString();
  const pegawaiHp = formData.get("pegawaiPhone")?.toString();
  const pegawaiEmail = formData.get("pegawaiEmail")?.toString();
  const pegawaiJabatan = formData.get("pegawaiJabatan")?.toString();
  const pegawaiStatus = formData.get("pegawaiStatus")?.toString();
  const pegawaiRole = formData.get("pegawaiRole")?.toString();
  const pegawaiPendidikan = formData.get("pegawaiPendidikan")?.toString();
  const pegawaiStatusKawin = formData.get("pegawaiStatusKawin")?.toString();
  const pegawaiKewarganegaraan = formData
    .get("pegawaiKewarganegaraan")
    ?.toString();
  const pegawaiBidang = formData.get("pegawaiBidang")?.toString();
  const pegawaiFoto = await UploadImage(formData);

  const pegawaiPass = formData.get("pegawaiPass")?.toString();

  const kelamin = inputJkType[pegawaiJk!];
  const role = inputRoleType[pegawaiRole!];

  const honeypot = formData.get("userHoneypot")?.toString();

  if (honeypot !== "") {
    return { message: "Terjadi Kesalahan", type: "error" };
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(pegawaiPass, salt);

  const submitData = await prisma.pegawai.create({
    data: {
      pegawai_nip: pegawaiNip!,
      pegawai_nik: pegawaiNik!,
      pegawai_password: passwordHash,
      pegawai_nama: pegawaiNama!,
      pegawai_jk: kelamin,
      pegawai_tempat_lahir: pegawaiTptLahir!,
      pegawai_tanggal_lahir: new Date(pegawaiTglLahir!).toISOString(),
      pegawai_phone: pegawaiHp!,
      pegawai_email: pegawaiEmail!,
      pegawai_alamat: pegawaiAlamat!,
      pegawai_foto: pegawaiFoto.file!,
      pegawai_jabatan: pegawaiJabatan!,

      agama_id: Number(pegawaiAgama),
      pendidikan_id: Number(pegawaiPendidikan),
      status_pegawai_id: Number(pegawaiStatus),
      status_kawin_id: Number(pegawaiStatusKawin),

      pegawai_kewarganegaraan: pegawaiKewarganegaraan!,
      pegawai_status: setup_status_aktif.A,
      pegawai_role: role,
      bidang_id: Number(pegawaiBidang),

      created_at: date.toISOString(),
    },
  });

  if (!submitData) {
    return { message: "Pegawai Gagal Ditambahkan", type: "error" };
  }

  return { message: "Pegawai Berhasil Ditambahkan", type: "success" };
}

export async function SubmitEditPegawai(
  formData: FormData,
  pegawaiNipSource: string,
  pegawaiPasswordSource: string,
  pegawaiPhotoSource: string
) {
  await updateSession();

  const bcrypt = require("bcrypt");

  const date = new Date();

  const pegawaiNip = formData.get("pegawaiNip")?.toString();
  const pegawaiNik = formData.get("pegawaiNik")?.toString();
  const pegawaiNama = formData.get("pegawaiNama")?.toString();
  const pegawaiAlamat = formData.get("pegawaiAlamat")?.toString();
  const pegawaiTptLahir = formData.get("pegawaiTptLahir")?.toString();
  const pegawaiTglLahir = formData.get("pegawaiTglLahir")?.toString();
  const pegawaiJk = formData.get("pegawaiJk")?.toString();
  const pegawaiAgama = formData.get("pegawaiAgama")?.toString();
  const pegawaiHp = formData.get("pegawaiPhone")?.toString();
  const pegawaiEmail = formData.get("pegawaiEmail")?.toString();
  const pegawaiJabatan = formData.get("pegawaiJabatan")?.toString();
  const pegawaiStatus = formData.get("pegawaiStatus")?.toString();
  const pegawaiRole = formData.get("pegawaiRole")?.toString();
  const pegawaiPendidikan = formData.get("pegawaiPendidikan")?.toString();
  const pegawaiStatusKawin = formData.get("pegawaiStatusKawin")?.toString();
  const pegawaiKewarganegaraan = formData
    .get("pegawaiKewarganegaraan")
    ?.toString();
  const pegawaiBidang = formData.get("pegawaiBidang")?.toString();
  const pegawaiFoto = formData.get("pegawaiFoto") as File;
  const pegawaiPass = formData.get("pegawaiPass")?.toString();

  let image;

  const kelamin = inputJkType[pegawaiJk!];
  const role = inputRoleType[pegawaiRole!];

  const honeypot = formData.get("userHoneypot")?.toString();

  if (honeypot !== "") {
    return { message: "Terjadi Kesalahan", type: "error" };
  }

  let finalPassword = pegawaiPasswordSource;

  if (pegawaiPass !== "") {
    const salt = bcrypt.genSaltSync(10);
    finalPassword = bcrypt.hashSync(pegawaiPass, salt);
  }

  if (pegawaiFoto.size != 0) {
    image = await EditImage(pegawaiFoto, pegawaiPhotoSource);

    if (image.type == "failed") {
      return { message: "Gagal mengubah data pegawai", type: "error" };
    }

    const submitData = await prisma.pegawai.update({
      where: {
        pegawai_nip: pegawaiNipSource,
      },
      data: {
        pegawai_nip: pegawaiNip!,
        pegawai_nik: pegawaiNik!,
        pegawai_password: finalPassword,
        pegawai_nama: pegawaiNama!,
        pegawai_jk: kelamin,
        pegawai_tempat_lahir: pegawaiTptLahir!,
        pegawai_tanggal_lahir: new Date(pegawaiTglLahir!).toISOString(),
        pegawai_phone: pegawaiHp!,
        pegawai_email: pegawaiEmail!,
        pegawai_alamat: pegawaiAlamat!,
        pegawai_foto: image.file!,
        pegawai_jabatan: pegawaiJabatan!,

        agama_id: Number(pegawaiAgama),
        pendidikan_id: Number(pegawaiPendidikan),
        status_pegawai_id: Number(pegawaiStatus),
        status_kawin_id: Number(pegawaiStatusKawin),

        pegawai_kewarganegaraan: pegawaiKewarganegaraan!,
        pegawai_status: setup_status_aktif.A,
        pegawai_role: role,
        bidang_id: Number(pegawaiBidang),

        updated_at: date.toISOString(),
      },
    });

    if (!submitData) {
      return { message: "Gagal mengubah data pegawai", type: "error" };
    }

    return { message: "Berhasil mengubah data pegawai", type: "success" };
  }

  image = pegawaiPhotoSource;

  const submitData = await prisma.pegawai.update({
    where: {
      pegawai_nip: pegawaiNipSource,
    },
    data: {
      pegawai_nip: pegawaiNip!,
      pegawai_nik: pegawaiNik!,
      pegawai_password: finalPassword,
      pegawai_nama: pegawaiNama!,
      pegawai_jk: kelamin,
      pegawai_tempat_lahir: pegawaiTptLahir!,
      pegawai_tanggal_lahir: new Date(pegawaiTglLahir!).toISOString(),
      pegawai_phone: pegawaiHp!,
      pegawai_email: pegawaiEmail!,
      pegawai_alamat: pegawaiAlamat!,
      pegawai_foto: image!,
      pegawai_jabatan: pegawaiJabatan!,

      agama_id: Number(pegawaiAgama),
      pendidikan_id: Number(pegawaiPendidikan),
      status_pegawai_id: Number(pegawaiStatus),
      status_kawin_id: Number(pegawaiStatusKawin),

      pegawai_kewarganegaraan: pegawaiKewarganegaraan!,
      pegawai_status: setup_status_aktif.A,
      pegawai_role: role,
      bidang_id: Number(pegawaiBidang),

      updated_at: date.toISOString(),
    },
  });

  if (!submitData) {
    return { message: "Pegawai Gagal Di edit", type: "error" };
  }

  return { message: "Pegawai Berhasil Di edit", type: "success" };
}

async function UploadImage(formData: FormData) {
  const image = formData.get("pegawaiFoto") as File;
  const pegawaiNama = formData.get("pegawaiNama")?.toString();

  const relativeUploadDir = "/foto-pegawai";
  const buffer = await image.arrayBuffer();
  let filename = `profile-${pegawaiNama?.replace(
    /\.[^/.]+$/,
    ""
  )}-${Date.now()}.${image.type.split("/")[1]}`;

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
    const localFilePath = `${uploadDir}/${filename}`;
    await writeFile(localFilePath, Buffer.from(buffer));

    try {
      const client = await Client({
        host: "103.30.180.221",
        port: 2233,
        username: "vps2-bkpsdm",
        password: "vps2BkpSdm-KUDu5!!",
      });

      const check = await client.exists("www/foto-pegawai");

      if (check == false) {
        await client.mkdir("www/foto-pegawai");
      }

      await client.uploadFile(localFilePath, `www/foto-pegawai/${filename}`);
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

async function EditImage(file: File, imgOri: string) {
  const relativeUploadDir = "/foto-pegawai";
  const buffer = await file.arrayBuffer();

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
    await writeFile(`${uploadDir}/${imgOri}`, Buffer.from(buffer));

    return {
      message: "Gambar Berhasil Diupload!",
      type: "success",
      file: imgOri,
    };
  } catch (e) {
    console.error("Error while trying to upload a file\n", e);
    return { message: "Gambar Gagal Diupload!", type: "failed" };
  }
}

export async function DeleteImagePegawai(filename: string) {
  const relativeUploadDir = "/foto-pegawai";

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
