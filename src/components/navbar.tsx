"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { IoGrid } from "react-icons/io5";
import {
  FaAngleDown,
  FaUsersCog,
  FaUser,
  FaUserFriends,
  FaRegNewspaper,
  FaHeadSideCough,
  FaHandsHelping,
  FaWindowRestore,
} from "react-icons/fa";

import { IoDocumentTextSharp } from "react-icons/io5";
import { IoMdPhonePortrait } from "react-icons/io";
import { GoDatabase } from "react-icons/go";
import { useEffect, useState } from "react";
import { getDataSession } from "@/utils/lib/session";
import Image from "next/image";

export function NavbarAdmin({ link }: { link: string }) {
  const [detailNavbar, setDetailNavbar] = useState({
    imgUser: "",
    namaUser: "",
    userId: "",
  });

  useEffect(() => {
    async function fetchDetailNavbar() {
      const session = await getDataSession();

      setDetailNavbar({
        imgUser: session.imgUser!,
        namaUser: session.namaUser!,
        userId: session.idUser!,
      });
    }

    fetchDetailNavbar();
  }, []);

  return (
    <nav className="shadow-lg">
      <div className="navbar bg-blue-600 justify-between px-20">
        <NavbarComponentLogo imageLogo={"/images/logo/logo-header.webp"} />

        <NavbarComponentProfile
          username={detailNavbar?.namaUser!}
          userImage={detailNavbar?.imgUser!}
          link={`/${link}/profile/${detailNavbar?.userId!}`}
        />
      </div>

      <div className="navbar justify-center h-16 bg-white">
        <ul className="menu menu-horizontal gap-4">
          <li>
            <NavbarComponentLink
              link={`/${link}/dashboard`}
              title={"Dashboard"}
              icon={<IoGrid />}
            />
          </li>

          <li>
            <NavbarComponentDropdownSingle
              link={`/${link}/master`}
              title={"Master"}
              icon={<GoDatabase />}
            >
              <NavbarComponentDropdownLink
                link={`/${link}/master/assets`}
                title={"Aset Mobile"}
                icon={<IoMdPhonePortrait />}
              />
            </NavbarComponentDropdownSingle>
          </li>

          <li>
            <NavbarComponentDropdownSingle
              link={`/${link}/menu_layanan`}
              title={"Menu Layanan"}
              icon={<FaRegNewspaper />}
            >
              <NavbarComponentDropdownLink
                link={`/${link}/menu_layanan/pengaduan`}
                title={"Pengaduan Masyarakat"}
                icon={<FaHeadSideCough />}
              />

              <NavbarComponentDropdownLink
                link={`/${link}/menu_layanan/permohonan_bantuan`}
                title={"Permohonan Bantuan"}
                icon={<FaHandsHelping />}
              />
            </NavbarComponentDropdownSingle>
          </li>

          <li>
            <NavbarComponentDropdownSingle
              link={`/${link}/menu_user`}
              title={"Menu User"}
              icon={<FaUsersCog />}
            >
              <NavbarComponentDropdownLink
                link={`/${link}/menu_user/users`}
                title={"Users"}
                icon={<FaUser />}
              />
              <NavbarComponentDropdownLink
                link={`/${link}/menu_user/pegawai`}
                title={"Pegawai"}
                icon={<FaUserFriends />}
              />
            </NavbarComponentDropdownSingle>
          </li>

          <li>
            <NavbarComponentDropdownSingle
              link={`/${link}/menu_laporan`}
              title={"Menu Laporan"}
              icon={<FaWindowRestore />}
            >
              <NavbarComponentDropdownLink
                link={`/${link}/menu_laporan/lap_pengaduan`}
                title={"Lap. Pengaduan"}
                icon={<IoDocumentTextSharp />}
              />
              <NavbarComponentDropdownLink
                link={`/${link}/menu_laporan/lap_permohonan`}
                title={"Lap. Permohonan"}
                icon={<IoDocumentTextSharp />}
              />
            </NavbarComponentDropdownSingle>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export function NavbarOperator({ link }: { link: string }) {
  const [detailNavbar, setDetailNavbar] = useState({
    imgUser: "",
    namaUser: "",
    userId: "",
  });

  useEffect(() => {
    async function fetchDetailNavbar() {
      const session = await getDataSession();

      setDetailNavbar({
        imgUser: session.imgUser!,
        namaUser: session.namaUser!,
        userId: session.idUser!,
      });
    }

    fetchDetailNavbar();
  }, []);

  return (
    <nav className="shadow-lg">
      <div className="navbar bg-blue-600 justify-between px-20">
        <NavbarComponentLogo imageLogo={"/images/logo/logo-header.webp"} />

        <NavbarComponentProfile
          username={detailNavbar?.namaUser!}
          userImage={detailNavbar?.imgUser!}
          link={`/${link}/profile/${detailNavbar?.userId!}`}
        />
      </div>

      <div className="navbar justify-center h-16 bg-white">
        <ul className="menu menu-horizontal gap-4">
          <li>
            <NavbarComponentLink
              link={`/${link}/dashboard`}
              title={"Dashboard"}
              icon={<IoGrid />}
            />
          </li>

          <li>
            <NavbarComponentDropdownSingle
              link={`/${link}/menu_layanan`}
              title={"Menu Layanan"}
              icon={<FaRegNewspaper />}
            >
              <NavbarComponentDropdownLink
                link={`/${link}/menu_layanan/pengaduan`}
                title={"Pengaduan Masyarakat"}
                icon={<FaHeadSideCough />}
              />

              <NavbarComponentDropdownLink
                link={`/${link}/menu_layanan/permohonan_bantuan`}
                title={"Permohonan Bantuan"}
                icon={<FaHandsHelping />}
              />
            </NavbarComponentDropdownSingle>
          </li>

          <li>
            <NavbarComponentDropdownSingle
              link={`/${link}/menu_laporan`}
              title={"Menu Laporan"}
              icon={<FaWindowRestore />}
            >
              <NavbarComponentDropdownLink
                link={`/${link}/menu_laporan/lap_pengaduan`}
                title={"Lap. Pengaduan"}
                icon={<IoDocumentTextSharp />}
              />
              <NavbarComponentDropdownLink
                link={`/${link}/menu_laporan/lap_permohonan`}
                title={"Lap. Permohonan"}
                icon={<IoDocumentTextSharp />}
              />
            </NavbarComponentDropdownSingle>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function NavbarComponentLink({
  link,
  title,
  icon,
}: {
  link: string;
  title: string;
  icon: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={link}
      className={`hover:bg-transparent font-bold hover:!text-blue-400 text-sm !bg-transparent ${
        pathname == link ? "!text-blue-400 !bg-gray-100" : "!text-gray-500"
      }`}
    >
      <i>{icon}</i> {title}
    </Link>
  );
}

function NavbarComponentDropdownLink({
  link,
  title,
  icon,
}: {
  link: string;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={link}
      className="hover:bg-transparent hover:!text-blue-400 text-gray-500 text-sm flex w-64 items-center !bg-transparent"
    >
      <i>{icon}</i> {title}
    </Link>
  );
}

function NavbarComponentDropdownMultiple({
  link,
  linkSecond,
  title,
  icon,
  children,
}: {
  link: string;
  linkSecond: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode[];
}) {
  const pathname = usePathname();

  return (
    <div className="dropdown !bg-white">
      <div
        tabIndex={0}
        role="button"
        className={`btn p-0 btn-ghost hover:!bg-white text-sm !bg-white ${
          pathname?.includes(link) || pathname?.includes(linkSecond)
            ? "!text-blue-400 !bg-gray-100"
            : "!text-gray-500"
        }`}
      >
        <i>{icon}</i>

        {title}

        <i>
          <FaAngleDown />
        </i>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 bg-white rounded flex flex-col gap-1 shadow-lg"
      >
        <li>{children}</li>
      </ul>
    </div>
  );
}

function NavbarComponentDropdownSingle({
  link,
  title,
  icon,
  children,
}: {
  link: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode[] | React.ReactNode;
}) {
  const pathname = usePathname();

  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <div className="dropdown dropdown-bottom !bg-white">
      <div
        tabIndex={0}
        role="button"
        className={`btn p-0 btn-ghost hover:!bg-white text-sm !bg-white ${
          pathname?.includes(link)
            ? "!text-blue-400 !bg-gray-100"
            : "!text-gray-500"
        }`}
      >
        <i>{icon}</i> {title}
        <i>
          <FaAngleDown />
        </i>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 bg-white rounded rounded-t-none flex flex-col gap-1 shadow-lg"
      >
        {childrenArray.map((child, index) => (
          <li key={index}>{child}</li>
        ))}
      </ul>
    </div>
  );
}

function NavbarComponentLogo({ imageLogo }: { imageLogo: string }) {
  return (
    <div>
      <Link href="">
        <Image
          width={0}
          height={0}
          sizes="100vw"
          src={imageLogo}
          alt="Logo Navbar"
          className="max-h-8"
        />
      </Link>
    </div>
  );
}

function NavbarComponentProfile({
  username,
  userImage,
  link,
}: {
  username: string;
  userImage: string;
  link: string;
}) {
  const [origin, setOrigin] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  if (!origin) {
    return null;
  }

  return (
    <Link href={link} className="flex items-center gap-5">
      <h2 className="text-white text-sm">
        <span className="text-gray-100 font-extralight">Halo, </span>
        <span className="font-extrabold">{username}</span>
      </h2>

      <Image
        width={0}
        height={0}
        sizes="100vw"
        className="h-10 w-10 rounded"
        alt="User Profile Image"
        src={`${origin}/foto-pegawai/${userImage}`}
      />
    </Link>
  );
}
