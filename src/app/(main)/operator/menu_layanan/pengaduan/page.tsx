"use client";

import MenuContainer, {
  ButtonActionFunctionMenu,
  ButtonActionLinkMenu,
  MenuBreadCrumbs,
  MenuNothing,
} from "@/components/menu";
import { CiViewList } from "react-icons/ci";
import { IoMdInformationCircle } from "react-icons/io";
import { useEffect, useState } from "react";
import { GetAllPengaduan } from "@/utils/server/pengaduan/pengaduan";

import { status_laporan } from "@prisma/client";
import { MdLocalPrintshop } from "react-icons/md";
import { formatter, laporanStatus, roleType } from "@/components/options";
import { PrintLaporanPengaduanDetail } from "@/utils/server/print_laporan/print_detail";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

type Pengaduan = {
  user_fullname: string | null;
  user_alamat: string | null;
  user_phone: string | null;
  laporan_id: string;
  laporan_tgl_send: Date;
  laporan_title: string;
  laporan_description: string;
  laporan_location: string;
  laporan_action: string | null;
  laporan_document: string;
  laporan_status: status_laporan;
};

type SortKey = keyof Pengaduan;

export default function Page() {
  const [pengaduan, setPengaduan] = useState<Pengaduan[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>(null);

  async function FetchAllData() {
    try {
      const callAllPengaduan = await GetAllPengaduan();
      setPengaduan(callAllPengaduan!);
    } catch (e) {
      console.error(e);
    }
  }

  async function PrintData(
    idPengaduan: string,
    tanggalPengaduan: string,
    namaPelapor: string,
    alamatPelapor: string,
    noHandphone: string,
    judul: string,
    alamatLokasi: string,
    keterangan: string,
    foto: string
  ) {
    try {
      let Data = {
        idPengaduan: idPengaduan,
        tanggalPengaduan: tanggalPengaduan,
        namaPelapor: namaPelapor,
        alamatPelapor: alamatPelapor,
        noHandphone: noHandphone,
        judul: judul,
        alamatLokasi: alamatLokasi,
        keterangan: keterangan,
        foto: foto,
      };

      await PrintLaporanPengaduanDetail(Data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    FetchAllData();
  }, []);

  const sortData = (key: SortKey) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedPengaduan = () => {
    let sortableItems = [...pengaduan];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key]! < b[sortConfig.key]!) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key]! > b[sortConfig.key]!) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  };

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort />;
    }
    if (sortConfig.direction === "ascending") {
      return <FaSortUp />;
    }
    return <FaSortDown />;
  };

  return (
    <section className="container mx-auto px-16">
      <MenuBreadCrumbs
        title={"Pengaduan Masyarakat"}
        linkArray={["Dashboard", "Menu Layanan"]}
        titleLinkArray={[
          "/operator/dashboard",
          "/operator/menu_layanan/pengaduan",
        ]}
        endTitle={"Pengaduan Masyarakat"}
      />

      <MenuContainer>
        <MenuNothing
          title="Daftar Pengaduan Masyarakat"
          titleIcon={<CiViewList />}
        />

        <hr />

        <div className="overflow-x-hidden">
          {sortedPengaduan().length > 0 ? (
            <table className="table table-sm">
              <thead>
                <tr>
                  <th></th>
                  <th>NO</th>
                  <th>
                    <button
                      className="flex items-center gap-2"
                      onClick={() => sortData("laporan_tgl_send")}
                    >
                      TANGGAL {getSortIcon("laporan_tgl_send")}
                    </button>
                  </th>
                  <th>
                    <button
                      className="flex items-center gap-2"
                      onClick={() => sortData("user_fullname")}
                    >
                      NAMA PELAPOR {getSortIcon("user_fullname")}
                    </button>
                  </th>
                  <th>
                    <button
                      className="flex items-center gap-2"
                      onClick={() => sortData("laporan_title")}
                    >
                      JUDUL {getSortIcon("laporan_title")}
                    </button>
                  </th>
                  <th>
                    <button
                      className="flex items-center gap-2"
                      onClick={() => sortData("laporan_location")}
                    >
                      LOKASI {getSortIcon("laporan_location")}
                    </button>
                  </th>
                  <th>
                    <button
                      className="flex items-center gap-2"
                      onClick={() => sortData("laporan_action")}
                    >
                      ACTION {getSortIcon("laporan_action")}
                    </button>
                  </th>
                  <th>
                    <button
                      className="flex items-center gap-2"
                      onClick={() => sortData("laporan_status")}
                    >
                      STATUS {getSortIcon("laporan_status")}
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                {pengaduan.map((value, index) => (
                  <tr key={index}>
                    <td>
                      <div className={"flex gap-2 justify-center"}>
                        <ButtonActionLinkMenu
                          link={`/operator/menu_layanan/pengaduan/detaildata/${value.laporan_id}`}
                          btnType={"btn-warning"}
                          icon={<IoMdInformationCircle />}
                        />

                        <ButtonActionFunctionMenu
                          btnFunction={() =>
                            PrintData(
                              value.laporan_id,
                              String(value.laporan_tgl_send),
                              value.user_fullname!,
                              value.user_alamat!,
                              value.user_phone!,
                              value.laporan_title,
                              value.laporan_location,
                              value.laporan_description,
                              `${window.location.origin}/foto-pengaduan/${value.laporan_document}`
                            )
                          }
                          btnType={"btn-info"}
                          icon={<MdLocalPrintshop />}
                        />
                      </div>
                    </td>
                    <td>{index + 1}</td>
                    <td>{formatter.format(value.laporan_tgl_send)}</td>
                    <td>{value.user_fullname}</td>
                    <td>{value.laporan_title}</td>
                    <td>{value.laporan_location}</td>
                    <td>
                      {value.laporan_action == null
                        ? "Belum ditindak"
                        : roleType[value.laporan_action]}
                    </td>
                    <td>{laporanStatus[value.laporan_status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center">Tidak ada Data Pengaduan</div>
          )}
        </div>
      </MenuContainer>
    </section>
  );
}
