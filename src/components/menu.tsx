import Link from "next/link";

import { FaPlusCircle } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { MouseEventHandler } from "react";

export default function MenuContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto bg-white rounded flex flex-col gap-5 shadow-xl p-5 min-h-96">
      {children}
    </div>
  );
}

export function MenuAddTitle({
  title,
  titleIcon,
  linkButton,
}: {
  title: string;
  titleIcon: React.ReactNode;
  linkButton: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 font-bold">
        <i className="text-2xl">{titleIcon}</i>
        {title}
      </div>
      <div className="flex gap-2">
        <Link
          className="btn btn-primary btn-sm h-9 rounded-md text-white font-thin"
          href={linkButton}
        >
          <i>
            <FaPlusCircle />
          </i>
          Tambah Data
        </Link>
      </div>
    </div>
  );
}

export function MenuNothing({
  title,
  titleIcon,
}: {
  title: string;
  titleIcon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 font-bold">
        <i className="text-2xl">{titleIcon}</i>
        {title}
      </div>
    </div>
  );
}

export function MenuEditTitle({
  title,
  titleIcon,
  linkButton,
}: {
  title: string;
  titleIcon: React.ReactNode;
  linkButton: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 font-bold">
        <i className="text-xl">{titleIcon}</i>
        {title}
      </div>
      <Link
        className="btn !bg-gray-300 btn-sm h-9 rounded-md text-black font-thin"
        href={linkButton}
      >
        <i>
          <IoMdArrowBack />
        </i>
        Kembali
      </Link>
    </div>
  );
}

export function MenuBreadCrumbs({
  title,
  linkArray,
  titleLinkArray,
  endTitle,
}: {
  title: string;
  linkArray: string[];
  titleLinkArray: string[];
  endTitle: string;
}) {
  return (
    <div className="py-5 text-sm breadcrumbs">
      <ul>
        <p className="pr-5 text-base font-bold">{title}</p>

        {linkArray.map((link, index) => (
          <li key={index}>
            <Link
              className="text-gray-500 font-semibold text-xs"
              href={titleLinkArray[index] || "#"}
            >
              {link}
            </Link>
          </li>
        ))}

        <li className="text-gray-500 font-semibold text-xs">{endTitle}</li>
      </ul>
    </div>
  );
}

export function ButtonActionLinkMenu({
  link,
  btnType,
  icon,
}: {
  link: string;
  btnType: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={link}
      className={`btn btn-sm ${btnType} min-h-6 min-w-6 w-6 h-6 rounded`}
    >
      <i className="text-white text-xs">{icon} </i>
    </Link>
  );
}

export function ButtonActionFunctionMenu({
  btnFunction,
  btnType,
  icon,
}: {
  btnFunction: MouseEventHandler<HTMLButtonElement>;
  btnType: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={btnFunction}
      className={`btn btn-sm ${btnType} min-h-6 min-w-6 w-6 h-6 rounded`}
    >
      <i className="text-white text-base">{icon} </i>
    </button>
  );
}
