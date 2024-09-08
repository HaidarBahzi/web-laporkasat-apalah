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
  FaNetworkWired,
  FaBookOpen,
  FaBalanceScale,
} from "react-icons/fa";

import { IoDocumentTextSharp } from "react-icons/io5";
import { IoMdPhonePortrait } from "react-icons/io";
import { GoDatabase } from "react-icons/go";
import { useEffect, useState } from "react";
import { getDataSession, updateSession } from "@/utils/lib/session";
import { LuDot } from "react-icons/lu";
import { PiDetective } from "react-icons/pi";

export function NavbarAdmin({ link }: { link: string }) {
  const [detailNavbar, setDetailNavbar] = useState({
    imgUser: "",
    namaUser: "",
    userId: "",
  });

  useEffect(() => {
    async function fetchDetailNavbar() {
      await updateSession();

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
              <NavbarComponentDropdownLink
                link={`/${link}/menu_user/penyidik`}
                title={"Penyidik"}
                icon={<PiDetective />}
              />
            </NavbarComponentDropdownSingle>
          </li>

          <li>
            <NavbarComponentDropdownSingle
              link={`/${link}/menu_tindak`}
              title={"Menu Tindak Lajut"}
              icon={<FaBalanceScale />}
            >
              <NavbarComponentDropdownLink
                link={`/${link}/menu_tindak/pengaduan`}
                title={"Pengaduan Masyarakat"}
                icon={<FaHeadSideCough />}
              />

              <NavbarComponentDropdownLink
                link={`/${link}/menu_tindak/permohonan_bantuan`}
                title={"Permohonan Bantuan"}
                icon={<FaHandsHelping />}
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
        </ul>
      </div>
    </nav>
  );
}

export function NavbarBidang({ link }: { link: string }) {
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
              link={`/${link}/menu_tindak`}
              title={"Menu Tindak Lajut"}
              icon={<FaBalanceScale />}
            >
              <NavbarComponentDropdownLink
                link={`/${link}/menu_tindak/pengaduan`}
                title={"Pengaduan Masyarakat"}
                icon={<FaHeadSideCough />}
              />

              <NavbarComponentDropdownLink
                link={`/${link}/menu_tindak/permohonan_bantuan`}
                title={"Permohonan Bantuan"}
                icon={<FaHandsHelping />}
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
      className={`hover:bg-transparent font-medium hover:!text-blue-400 text-sm !bg-transparent ${
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
    <a
      href={link}
      className="hover:bg-transparent hover:!text-blue-400 text-gray-500 text-sm font-medium flex w-64 items-center !bg-transparent"
    >
      <i>{icon}</i> {title}
    </a>
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
      <button
        tabIndex={0}
        type="button"
        className={`btn p-0 btn-ghost font-medium hover:!bg-white text-sm !bg-white ${
          pathname?.includes(link)
            ? "!text-blue-400 !bg-gray-100"
            : "!text-gray-500"
        }`}
      >
        <i>{icon}</i> {title}
        <i>
          <FaAngleDown />
        </i>
      </button>

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
        <img src={imageLogo} alt="Logo Navbar" className="max-h-8 w-full" />
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
  return (
    <Link href={link} className="flex items-center gap-5">
      <h2 className="text-white text-sm">
        <span className="text-gray-100 font-medium">Halo, </span>
        <span className="font-bold">{username}</span>
      </h2>

      <img
        className="h-10 w-10 rounded"
        alt="User Profile Image"
        src={`http://103.30.180.221/web-laporkasat-apalah/assets/foto-pegawai/${userImage}`}
      />
    </Link>
  );
}
