"use server";

import prisma from "@/utils/lib/prisma";

export async function GetProfile(userNip: string) {
  const query = await prisma.pegawai.findUnique({
    where: {
      pegawai_nip: userNip,
    },
  });

  return query;
}
