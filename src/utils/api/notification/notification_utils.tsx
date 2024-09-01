"use server";

import prisma from "@/utils/lib/prisma";

export async function GetNotification(userKtp: string) {
  const query = await prisma.notification.findMany({
    where: {
      user_mail: userKtp,
    },
    select: {
      notif_id: true,
      user_mail: true,
      notif_title: true,
      notif_description: true,
      notif_status: true,
      notif_tgl_send: true,
    },
  });

  return query;
}

export async function DeleteNotification(userKtp: string, notifId: string) {
  const query = await prisma.notification.findMany({
    where: {
      user_mail: userKtp,
      notif_id: notifId,
    },
  });

  return query;
}
