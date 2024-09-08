"use server";

import prisma from "@/utils/lib/prisma";
import { status_laporan, type_laporan } from "@prisma/client";
import { getSession, updateSession } from "@/utils/lib/session";

export async function GetAllPermohonanBantuan() {
  const queryPermohonan = await prisma.laporan.findMany({
    where: {
      laporan_type: type_laporan.B,
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

  const permohonanWithUser = await Promise.all(
    queryPermohonan.map(async (permohonan) => {
      const queryUser = await prisma.users.findUnique({
        where: {
          user_mail: permohonan.user_mail,
        },
        select: {
          user_fullname: true,
          user_alamat: true,
          user_phone: true,
        },
      });

      const queryPegawai = await prisma.pegawai.findUnique({
        where: {
          pegawai_nip: permohonan.pegawai_nip,
        },
        select: {
          pegawai_nama: true,
        },
      });

      return {
        ...permohonan,
        user_fullname: queryUser ? queryUser.user_fullname : null,
        user_alamat: queryUser ? queryUser.user_alamat : null,
        user_phone: queryUser ? queryUser.user_phone : null,
        pegawai_nama: queryPegawai ? queryPegawai.pegawai_nama : null,
      };
    })
  );

  return permohonanWithUser;
}

export async function GetAllPermohonanBantuanDate(
  dateFirst: Date,
  dateSec: Date
) {
  const queryPermohonan = await prisma.laporan.findMany({
    where: {
      laporan_type: type_laporan.B,
      created_at: {
        gte: dateFirst,
        lte: dateSec,
      },
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

  const permohonanWithUser = await Promise.all(
    queryPermohonan.map(async (permohonan) => {
      const queryUser = await prisma.users.findUnique({
        where: {
          user_mail: permohonan.user_mail,
        },
        select: {
          user_fullname: true,
          user_alamat: true,
          user_phone: true,
        },
      });

      const queryPegawai = await prisma.pegawai.findUnique({
        where: {
          pegawai_nip: permohonan.pegawai_nip,
        },
        select: {
          pegawai_nama: true,
        },
      });

      return {
        ...permohonan,
        user_fullname: queryUser ? queryUser.user_fullname : null,
        user_alamat: queryUser ? queryUser.user_alamat : null,
        user_phone: queryUser ? queryUser.user_phone : null,
        pegawai_nama: queryPegawai ? queryPegawai.pegawai_nama : null,
      };
    })
  );

  return permohonanWithUser;
}

export async function GetAllPermohonanKepalaBidang(bidangId: number) {
  const queryPengaduan = await prisma.laporan.findMany({
    where: {
      laporan_type: type_laporan.B,
      bidang_id: bidangId,
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

export async function GetAllPermohonanKepalaBidangDate(
  bidangId: number,
  dateFirst: Date,
  dateSec: Date
) {
  const queryPengaduan = await prisma.laporan.findMany({
    where: {
      laporan_type: type_laporan.B,
      bidang_id: bidangId,
      created_at: {
        gte: dateFirst,
        lte: dateSec,
      },
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

export async function GetAllPermohonanBidang(pegawaiNip: string) {
  const queryPengaduan = await prisma.laporan.findMany({
    where: {
      laporan_type: type_laporan.B,
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

export async function GetAllPermohonanBidangDate(
  pegawaiNip: string,
  dateFirst: Date,
  dateSec: Date
) {
  const queryPengaduan = await prisma.laporan.findMany({
    where: {
      laporan_type: type_laporan.B,
      pegawai_nip: pegawaiNip,
      created_at: {
        gte: dateFirst,
        lte: dateSec,
      },
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

export async function GetAllPermohonanBantuanTindak() {
  const queryPermohonan = await prisma.laporan.findMany({
    where: {
      laporan_type: type_laporan.B,
      laporan_status: status_laporan.P,
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

  const permohonanWithUser = await Promise.all(
    queryPermohonan.map(async (permohonan) => {
      const queryUser = await prisma.users.findUnique({
        where: {
          user_mail: permohonan.user_mail,
        },
        select: {
          user_fullname: true,
          user_alamat: true,
          user_phone: true,
        },
      });

      const queryPegawai = await prisma.pegawai.findUnique({
        where: {
          pegawai_nip: permohonan.pegawai_nip,
        },
        select: {
          pegawai_nama: true,
        },
      });

      return {
        ...permohonan,
        user_fullname: queryUser ? queryUser.user_fullname : null,
        user_alamat: queryUser ? queryUser.user_alamat : null,
        user_phone: queryUser ? queryUser.user_phone : null,
        pegawai_nama: queryPegawai ? queryPegawai.pegawai_nama : null,
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
      laporan_id: true,
      user_mail: true,
      laporan_title: true,
      laporan_description: true,
      laporan_location: true,
      laporan_document: true,
      laporan_status: true,
    },
  });

  const queryUser = await prisma.users.findUnique({
    where: {
      user_mail: queryPermohonan?.user_mail,
    },
    select: {
      user_mail: true,
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
      pegawai_nip: session.userId,
      laporan_tgl_confirm: date.toISOString(),
      updated_at: date.toISOString(),
    },
  });

  return query;
}
