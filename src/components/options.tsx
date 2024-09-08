import {
  setup_kelamin,
  setup_role,
  asset_status,
  status_laporan,
  setup_status_aktif,
  user_status,
  type_laporan,
  tindak_lanjut_status,
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
  O: "Operator",
  U: "User",
  KB: "Kepala Bidang",
};

const bidangType: any = {
  1: "Gakda",
  2: "Tibum",
  3: "Lindam",
};

const inputRoleType: any = {
  A: setup_role.A,
  K: setup_role.K,
  U: setup_role.U,
  KB: setup_role.KB,
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

const userStatus: any = {
  A: "Aktif",
  S: "Suspended",
  B: "Banned",
};

const pegawaiStatusType: any = {
  A: "Aktif",
  TA: "Tidak Aktif",
};

const laporanStatus: any = {
  S: "Belum Dikonfirmasi",
  C: "Sudah Dikonfirmasi",
  R: "Ditolak",
  P: "Sedang Ditindak",
  D: "Selesai",
};

const tindakStatus: any = {
  NJ: "Non Justitia",
  PJ: "Pro Justitia",
};

const inputTindakStatus: any = {
  NJ: tindak_lanjut_status.NJ,
  PJ: tindak_lanjut_status.PJ,
};

const formatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

interface PelanggaranTindakForm {
  pelanggar: {
    nama: string;
    ayah: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    pelanggarJk: string;
    agama: number;
    pendidikan: number;
    kewarganegaraan: string;
    status_kawin: number;
    phone: string;
    alamat: string;
  };
  saksi1: {
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    agama: number;
    pendidikan: number;
    kewarganegaraan: string;
    status_kawin: number;
    phone: string;
    alamat: string;
  };
  saksi2: {
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    agama: number;
    pendidikan: number;
    kewarganegaraan: string;
    status_kawin: number;
    phone: string;
    alamat: string;
  };
  tindakan: {
    penyidik: string;
    tindak: string;
    pelaksanaan: string;
  };
  bukti: {
    bukti_kejadian: string;
    bukti_barang: string;
    bukti_penyegelan: string;
    dokumen_ktp: string;
    dokumen_sp: string;
    dokumen_sp1: string;
    dokumen_sp2: string;
    dokumen_sp3: string;
    dokumen_lk: string;
    dokumen_spp: string;
    dokumen_bap: string;
    dokumen_p3bb: string;
    dokumen_psk: string;
    dokumen_bapc: string;
    dokumen_pst: string;
  };
}

type PelanggaranType = {
  pelanggaran_id: string;
  laporan_tgl_send: Date | undefined;
  laporan_title: string | undefined;
  laporan_location: string | undefined;
  laporan_status: status_laporan | undefined;
  user_fullname: string | undefined;
  laporan_id: string;
};

type PengaduanType = {
  user_fullname: string | null;
  user_alamat: string | null;
  user_phone: string | null;
  laporan_id: string;
  laporan_tgl_send: Date;
  laporan_title: string;
  laporan_description: string;
  laporan_location: string;
  pegawai_nip: string | null;
  pegawai_nama: string | null;
  laporan_document: string;
  laporan_status: status_laporan;
};

type TindakLaporanType = {
  tindak_lanjut_id: string;
  pelanggaran_id: string | null;
  laporan_id: string;
  pegawai_nip: string;
  tindak_lanjut_type: tindak_lanjut_status;
  laporan_tgl_confirm: Date;
  laporan_tgl_progress: Date;
  laporan_tgl_send: Date;
  laporan_title: string;
  laporan_location: string;
  laporan_action: string;
  laporan_status: status_laporan;
};

type AssetType = {
  asset_id: number;
  asset_photo: string;
  asset_title: string;
  asset_url: string | null;
  asset_type: asset_status;
};

type PermohonanType = {
  user_fullname: string | null;
  user_alamat: string | null;
  user_phone: string | null;
  laporan_id: string;
  laporan_tgl_send: Date;
  laporan_title: string;
  laporan_description: string;
  laporan_location: string;
  pegawai_nip: string | null;
  pegawai_nama: string | null;
  laporan_document: string;
  laporan_status: status_laporan;
};

type PegawaiType = {
  pegawai_nip: string;
  pegawai_nama: string;
  pegawai_jk: setup_kelamin;
  pegawai_jabatan: string;
  pendidikan_id: number;
  status_pegawai_id: number;
  pegawai_status: setup_status_aktif;
  pegawai_role: setup_role;
  bidang_id: number;
  pegawai_foto: string;
};

type PenyidikType = {
  penyidik_id: string;
  pegawai_nip: string;
  pegawai_nama: string | null;
  pegawai_jabatan: string | null;
  penyidik_sk: string;
  penyidik_tgl_sk: Date;
};

type UsersType = {
  user_mail: string;
  user_fullname: string;
  user_phone: string;
  user_alamat: string;
  user_status: user_status;
};

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
  tindakStatus,
  inputTindakStatus,
  bidangType,
};
export type {
  PelanggaranTindakForm,
  PengaduanType,
  AssetType,
  PermohonanType,
  PegawaiType,
  PenyidikType,
  UsersType,
  PelanggaranType,
  TindakLaporanType,
};
