"use server";

import prisma from "@/utils/lib/prisma";

export async function GetNotification(userKtp: string) {
  const query = await prisma.notification.findMany({
    where: {
      user_ktp: userKtp,
    },
    select: {
      notif_id: true,
      user_ktp: true,
      notif_title: true,
      notif_description: true,
      notif_status: true,
      notif_tgl_send: true,
    },
  });

  return query;
}
