"use client";

import MenuContainer, {
  ButtonActionFunctionMenu,
  ButtonActionLinkMenu,
  MenuBreadCrumbs,
  MenuNothing,
} from "@/components/menu";
import { CiViewList } from "react-icons/ci";
import { useEffect, useState } from "react";
import { status_laporan } from "@prisma/client";
import { GetAllPermohonanBantuan } from "@/utils/server/permohonan_bantuan/permohonan_bantuan";
import { IoMdInformationCircle } from "react-icons/io";
import { MdLocalPrintshop } from "react-icons/md";
import {
  formatter,
  laporanStatus,
  PermohonanType,
  roleType,
} from "@/components/options";
import { PrintLaporanPermohonanDetail } from "@/utils/server/print_laporan/print_detail";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

type SortKey = keyof PermohonanType;

export default function Page() {
  const [permohonan, setPermohonan] = useState<PermohonanType[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>(null);

  async function FetchAllData() {
    try {
      const callAllPermohonan = await GetAllPermohonanBantuan();
      setPermohonan(callAllPermohonan!);
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
    dokumen: string
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
        dokumen: dokumen,
      };

      await PrintLaporanPermohonanDetail(Data);
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

  const sortedPermohonan = () => {
    let sortableItems = [...permohonan];
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
        title={"Permohonan Bantuan"}
        linkArray={["Dashboard", "Menu Layanan"]}
        titleLinkArray={[
          "/kasat/dashboard",
          "/kasat/menu_layanan/permohonan_bantuan",
        ]}
        endTitle={"Permohonan Bantuan"}
      />

      <MenuContainer>
        <MenuNothing
          title="Daftar Permohonan Bantuan"
          titleIcon={<CiViewList />}
        />

        <hr />

        <div className="overflow-x-hidden">
          {sortedPermohonan().length > 0 ? (
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
                {sortedPermohonan().map((value, index) => (
                  <tr key={index}>
                    <td>
                      <div className={"flex gap-2 justify-center"}>
                        <ButtonActionLinkMenu
                          link={`/kasat/menu_layanan/permohonan_bantuan/detaildata/${value.laporan_id}`}
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
                              `${window.location.origin}/pdf-uploads/${value.laporan_document}`
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
            <div className="flex justify-center">Tidak ada Data Permohonan</div>
          )}
        </div>
      </MenuContainer>
    </section>
  );
}
