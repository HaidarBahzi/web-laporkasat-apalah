"use server";

import { inputDataType } from "@/components/options";
import prisma from "@/utils/lib/prisma";
import { status_laporan, type_laporan } from "@prisma/client";

export async function PrintLaporanPengaduanAll(formData: FormData) {
  const dateFirst = new Date(formData.get("dateFirst")?.toString()!);
  const dateSec = new Date(formData.get("dateSec")?.toString()!);
  const dataType = formData.get("dataType")?.toString()!;

  if (inputDataType[dataType] == status_laporan.S) {
    const queryPengaduan = await prisma.laporan.findMany({
      where: {
        laporan_type: type_laporan.P,
        laporan_status: status_laporan.S,
        created_at: {
          gte: dateFirst.toISOString(),
          lte: dateSec.toISOString(),
        },
      },
      select: {
        laporan_tgl_send: true,
        user_mail: true,
        laporan_title: true,
        laporan_description: true,
        laporan_location: true,
        laporan_status: true,
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

  if (inputDataType[dataType] == status_laporan.C) {
    const queryPengaduan = await prisma.laporan.findMany({
      where: {
        laporan_type: type_laporan.P,
        laporan_status: status_laporan.C,
        created_at: {
          gte: dateFirst.toISOString(),
          lte: dateSec.toISOString(),
        },
      },
      select: {
        laporan_tgl_send: true,
        user_mail: true,
        laporan_title: true,
        laporan_description: true,
        laporan_location: true,
        laporan_status: true,
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

  if (inputDataType[dataType] == status_laporan.P) {
    const queryPengaduan = await prisma.laporan.findMany({
      where: {
        laporan_type: type_laporan.P,
        laporan_status: status_laporan.P,
        created_at: {
          gte: dateFirst.toISOString(),
          lte: dateSec.toISOString(),
        },
      },
      select: {
        laporan_tgl_send: true,
        user_mail: true,
        laporan_title: true,
        laporan_description: true,
        laporan_location: true,
        laporan_status: true,
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

  if (inputDataType[dataType] == status_laporan.R) {
    const queryPengaduan = await prisma.laporan.findMany({
      where: {
        laporan_type: type_laporan.P,
        laporan_status: status_laporan.R,
        created_at: {
          gte: dateFirst.toISOString(),
          lte: dateSec.toISOString(),
        },
      },
      select: {
        laporan_tgl_send: true,
        user_mail: true,
        laporan_title: true,
        laporan_description: true,
        laporan_location: true,
        laporan_status: true,
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

  if (inputDataType[dataType] == status_laporan.D) {
    const queryPengaduan = await prisma.laporan.findMany({
      where: {
        laporan_type: type_laporan.P,
        laporan_status: status_laporan.D,
        created_at: {
          gte: dateFirst.toISOString(),
          lte: dateSec.toISOString(),
        },
      },
      select: {
        laporan_tgl_send: true,
        user_mail: true,
        laporan_title: true,
        laporan_description: true,
        laporan_location: true,
        laporan_status: true,
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

  const queryPengaduan = await prisma.laporan.findMany({
    where: {
      laporan_type: type_laporan.P,
      created_at: {
        gte: dateFirst.toISOString(),
        lte: dateSec.toISOString(),
      },
    },
    select: {
      laporan_tgl_send: true,
      user_mail: true,
      laporan_title: true,
      laporan_description: true,
      laporan_location: true,
      laporan_status: true,
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

export async function PrintLaporanPermohonanAll(formData: FormData) {
  const dateFirst = new Date(formData.get("dateFirst")?.toString()!);
  const dateSec = new Date(formData.get("dateSec")?.toString()!);
  const dataType = formData.get("dataType")?.toString()!;

  if (inputDataType[dataType] == status_laporan.S) {
    const queryPengaduan = await prisma.laporan.findMany({
      where: {
        laporan_type: type_laporan.B,
        laporan_status: status_laporan.S,
        created_at: {
          gte: dateFirst.toISOString(),
          lte: dateSec.toISOString(),
        },
      },
      select: {
        laporan_tgl_send: true,
        user_mail: true,
        laporan_title: true,
        laporan_description: true,
        laporan_location: true,
        laporan_status: true,
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

  if (inputDataType[dataType] == status_laporan.C) {
    const queryPengaduan = await prisma.laporan.findMany({
      where: {
        laporan_type: type_laporan.B,
        laporan_status: status_laporan.C,
        created_at: {
          gte: dateFirst.toISOString(),
          lte: dateSec.toISOString(),
        },
      },
      select: {
        laporan_tgl_send: true,
        user_mail: true,
        laporan_title: true,
        laporan_description: true,
        laporan_location: true,
        laporan_status: true,
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

  if (inputDataType[dataType] == status_laporan.P) {
    const queryPengaduan = await prisma.laporan.findMany({
      where: {
        laporan_type: type_laporan.B,
        laporan_status: status_laporan.P,
        created_at: {
          gte: dateFirst.toISOString(),
          lte: dateSec.toISOString(),
        },
      },
      select: {
        laporan_tgl_send: true,
        user_mail: true,
        laporan_title: true,
        laporan_description: true,
        laporan_location: true,
        laporan_status: true,
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

  if (inputDataType[dataType] == status_laporan.R) {
    const queryPengaduan = await prisma.laporan.findMany({
      where: {
        laporan_type: type_laporan.B,
        laporan_status: status_laporan.R,
        created_at: {
          gte: dateFirst.toISOString(),
          lte: dateSec.toISOString(),
        },
      },
      select: {
        laporan_tgl_send: true,
        user_mail: true,
        laporan_title: true,
        laporan_description: true,
        laporan_location: true,
        laporan_status: true,
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

  if (inputDataType[dataType] == status_laporan.D) {
    const queryPengaduan = await prisma.laporan.findMany({
      where: {
        laporan_type: type_laporan.B,
        laporan_status: status_laporan.D,
        created_at: {
          gte: dateFirst.toISOString(),
          lte: dateSec.toISOString(),
        },
      },
      select: {
        laporan_tgl_send: true,
        user_mail: true,
        laporan_title: true,
        laporan_description: true,
        laporan_location: true,
        laporan_status: true,
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

  const queryPengaduan = await prisma.laporan.findMany({
    where: {
      laporan_type: type_laporan.B,
      created_at: {
        gte: dateFirst.toISOString(),
        lte: dateSec.toISOString(),
      },
    },
    select: {
      laporan_tgl_send: true,
      user_mail: true,
      laporan_title: true,
      laporan_description: true,
      laporan_location: true,
      laporan_status: true,
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
