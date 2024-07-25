import {
  PrismaClient,
  setup_kelamin,
  setup_role,
  setup_status_aktif,
} from "@prisma/client";

const prisma = new PrismaClient();
const date = new Date();

async function main() {
  const seedSetupAgama = await prisma.setup_agama.createMany({
    data: [
      {
        agama_nama: "Islam",
        created_at: date.toISOString(),
      },
      {
        agama_nama: "Kristen",
        created_at: date.toISOString(),
      },
      {
        agama_nama: "Katholik",
        created_at: date.toISOString(),
      },
      {
        agama_nama: "Hindu",
        created_at: date.toISOString(),
      },
      {
        agama_nama: "Budha",
        created_at: date.toISOString(),
      },
      {
        agama_nama: "Konghucu",
        created_at: date.toISOString(),
      },
      {
        agama_nama: "Kepercayaan",
        created_at: date.toISOString(),
      },
    ],
    skipDuplicates: true,
  });

  const seedSetupKawin = await prisma.setup_kawin.createMany({
    data: [
      {
        status_kawin_nama: "Belum Kawin",
        created_at: date.toISOString(),
      },
      {
        status_kawin_nama: "Kawin",
        created_at: date.toISOString(),
      },
      {
        status_kawin_nama: "Cerai Hidup",
        created_at: date.toISOString(),
      },
      {
        status_kawin_nama: "Cerai Mati",
        created_at: date.toISOString(),
      },
    ],
    skipDuplicates: true,
  });

  const seedSetupPegawai = await prisma.setup_status_pegawai.createMany({
    data: [
      {
        status_pegawai_nama: "PNS",
        created_at: date.toISOString(),
      },
      {
        status_pegawai_nama: "CPNS",
        created_at: date.toISOString(),
      },
      {
        status_pegawai_nama: "P3K",
        created_at: date.toISOString(),
      },
      {
        status_pegawai_nama: "PHD",
        created_at: date.toISOString(),
      },
      {
        status_pegawai_nama: "NON PNS",
        created_at: date.toISOString(),
      },
    ],
    skipDuplicates: true,
  });

  const seedBidangPegawai = await prisma.setup_bidang.createMany({
    data: [
      {
        bidang_nama: "BIDANG PENEGAKAN PERATURAN DAERAH",
        bidang_singkatan: "GAKDA",
        created_at: date.toISOString(),
      },
      {
        bidang_nama: "BIDANG KETERTIBAN UMUM DAN KETENTRAMAN MASYARAKAT",
        bidang_singkatan: "TIBUN TRANMAS",
        created_at: date.toISOString(),
      },
      {
        bidang_nama: "BIDANG PERLINDUNGAN MASYARAKAT DAN PEMADAM KEBAKARAN",
        bidang_singkatan: "LINMAS DAN DAMKAR",
        created_at: date.toISOString(),
      },
      {
        bidang_nama: "SEKRETARIAT",
        bidang_singkatan: "SEKRETARIAT",
        created_at: date.toISOString(),
      },
    ],
    skipDuplicates: true,
  });

  const seedPendidikan = await prisma.setup_pendidikan.createMany({
    data: [
      {
        pendidikan_nama: "Sekolah Dasar",

        created_at: date.toISOString(),
      },
      {
        pendidikan_nama: "SLTP",

        created_at: date.toISOString(),
      },
      {
        pendidikan_nama: "SLTP Kejuruan",

        created_at: date.toISOString(),
      },
      {
        pendidikan_nama: "SLTA",

        created_at: date.toISOString(),
      },
      {
        pendidikan_nama: "SLTA Kejuruan",

        created_at: date.toISOString(),
      },
      {
        pendidikan_nama: "Diploma I",

        created_at: date.toISOString(),
      },
      {
        pendidikan_nama: "Diploma II",

        created_at: date.toISOString(),
      },
      {
        pendidikan_nama: "SGLBP",

        created_at: date.toISOString(),
      },
      {
        pendidikan_nama: "Diploma III / Sarjana Muda",

        created_at: date.toISOString(),
      },
      {
        pendidikan_nama: "Diploma IV",

        created_at: date.toISOString(),
      },
      {
        pendidikan_nama: "S-1 / Sarjana",

        created_at: date.toISOString(),
      },
      {
        pendidikan_nama: "S-2",

        created_at: date.toISOString(),
      },
      {
        pendidikan_nama: "S-3 / Doktor",

        created_at: date.toISOString(),
      },
      {
        pendidikan_nama: "SLTA Keguruan",

        created_at: date.toISOString(),
      },
      {
        pendidikan_nama: "Tidak Sekolah",

        created_at: date.toISOString(),
      },
    ],
    skipDuplicates: true,
  });

  const bcrypt = require("bcrypt");
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync("akuganteng", salt);

  const seedUserPegawai = await prisma.pegawai.create({
    data: {
      pegawai_nik: "1234567890123456",
      pegawai_nip: "123456789012345678",
      pegawai_password: passwordHash,
      pegawai_nama: "Haidar Bahzi",
      pegawai_jk: setup_kelamin.L,
      pegawai_tempat_lahir: "Jl. Ganesha Barat No. 41",
      pegawai_tanggal_lahir: date.toISOString(),
      pegawai_phone: "081226226318",
      pegawai_email: "biglamp.gang@gmail.com",
      pegawai_alamat: "Jl. Ganesha Barat No. 41",
      pegawai_foto: "imagesucok.jpeg",
      pegawai_jabatan: "KEPALA BIDANG",
      agama_id: 1,
      pendidikan_id: 1,
      status_pegawai_id: 1,
      status_kawin_id: 1,
      pegawai_kewarganegaraan: "WNI",
      pegawai_status: setup_status_aktif.A,
      pegawai_role: setup_role.A,
      bidang_id: 1,

      created_at: date.toISOString(),
    },
  });

  console.log({
    seedSetupAgama,
    seedSetupKawin,
    seedSetupPegawai,
    seedBidangPegawai,
    seedPendidikan,
  });

  console.log(seedUserPegawai);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
