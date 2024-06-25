import {
  setup_kelamin,
  setup_role,
  asset_status,
  status_laporan,
} from "@prisma/client";

const assetType = {
  C: "Carausel",
  S: "Stats Icons",
  I: "Icons",
};

const inputAssetType: any = {
  C: asset_status.C,
  S: asset_status.S,
  I: asset_status.I,
};

const inputDataType: any = {
  all: "all",
  S: status_laporan.S,
  C: status_laporan.C,
  P: status_laporan.P,
  R: status_laporan.R,
  D: status_laporan.D,
};

const roleType: any = {
  A: "Admin",
  K: "Kasat",
  B: "Bupati",
  J: "Jadwal",
  G: "Gakda",
  L: "Lindam",
  T: "Tibum",
  S: "Sekretariat",
  O: "Operator",
};

const inputRoleType: any = {
  A: setup_role.A,
  K: setup_role.K,
  B: setup_role.B,
  G: setup_role.G,
  L: setup_role.L,
  T: setup_role.T,
  S: setup_role.S,
  O: setup_role.O,
};

const inputJkType: any = {
  L: setup_kelamin.L,
  P: setup_kelamin.P,
};

const jkType: any = {
  L: "Laki-laki",
  P: "Perempuan",
};

const userStatus = {
  A: "Aktif",
  S: "Suspended",
  B: "Banned",
};

const pegawaiStatusType = {
  A: "Aktif",
  TA: "Tidak Aktif",
};

const laporanStatus: any = {
  S: "Terkirim",
  C: "Terkonfirmasi",
  R: "Ditolak",
  P: "Sedang Ditindak",
  D: "Selesai",
};

const formatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export {
  assetType,
  inputAssetType,
  inputJkType,
  inputRoleType,
  roleType,
  jkType,
  userStatus,
  laporanStatus,
  pegawaiStatusType,
  formatter,
  inputDataType,
};
