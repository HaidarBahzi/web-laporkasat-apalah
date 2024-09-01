"use server";

import prisma from "@/utils/lib/prisma";

export async function GetProfile(userKtp: string) {
  const query = await prisma.users.findUnique({
    where: {
      user_mail: userKtp,
    },
    select: {
      user_mail: true,
      user_fullname: true,
      user_phone: true,
      user_alamat: true,
    },
  });

  return query;
}

export async function UpdateProfile(
  userKtpSource: string,
  userKtpNew: string,
  userNameNew: string,
  userPhoneNew: string,
  userAlamatNew: string
) {
  const query = await prisma.users.update({
    where: {
      user_mail: userKtpSource,
    },
    data: {
      user_mail: userKtpNew,
      user_fullname: userNameNew,
      user_phone: userPhoneNew,
      user_alamat: userAlamatNew,
    },
  });

  return query;
}

export async function CheckPassword(userKtp: string, userPasswordOld: string) {
  const bcrypt = require("bcrypt");

  const query = await prisma.users.findUnique({
    where: {
      user_mail: userKtp,
    },
    select: {
      user_password: true,
    },
  });

  return await bcrypt.compare(userPasswordOld, query?.user_password);
}

export async function UpdateProfilePassword(
  userKtpSource: string,
  userPasswordNew: string
) {
  const bcrypt = require("bcrypt");

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(userPasswordNew, salt);

  const query = await prisma.users.update({
    where: {
      user_mail: userKtpSource,
    },
    data: {
      user_password: passwordHash,
    },
  });

  return query;
}
