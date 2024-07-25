"use client";

import MenuContainer, {
  ButtonActionFunctionMenu,
  ButtonActionLinkMenu,
  MenuAddTitle,
  MenuBreadCrumbs,
} from "@/components/menu";
import { CiViewList } from "react-icons/ci";
import { useEffect, useState } from "react";
import { status_laporan } from "@prisma/client";
import {
  DeleteDokumenPermohonan,
  DeletePermohonanBantuan,
  GetAllPermohonanBantuan,
} from "@/utils/server/permohonan_bantuan/permohonan_bantuan";
import { IoMdInformationCircle } from "react-icons/io";
import { MdDelete, MdLocalPrintshop } from "react-icons/md";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { formatter, laporanStatus, roleType } from "@/components/options";
import { ModalAlertDelete } from "@/components/form";
import { PrintLaporanPermohonanDetail } from "@/utils/server/print_laporan/print_detail";

type Permohonan = {
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

export default function Page() {
  const [permohonan, setPermohonan] = useState<Permohonan[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Permohonan;
    direction: "ascending" | "descending";
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function FetchAllData() {
    try {
      const callAllPermohonan = await GetAllPermohonanBantuan();
      setPermohonan(callAllPermohonan!);
    } catch (e) {
      console.error(e);
    }
  }

  async function DeleteData(permohonanId: string, permohonanDokumen: string) {
    try {
      await DeletePermohonanBantuan(permohonanId);
      await DeleteDokumenPermohonan(permohonanDokumen);
      await FetchAllData();
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

  const sortData = (key: keyof Permohonan) => {
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

  const getSortIcon = (key: keyof Permohonan) => {
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
          "/admin/dashboard",
          "/admin/menu_layanan/permohonan_bantuan",
        ]}
        endTitle={"Permohonan Bantuan"}
      />

      <MenuContainer>
        <MenuAddTitle
          title="Daftar Permohonan Bantuan"
          titleIcon={<CiViewList />}
          linkButton={"/admin/menu_layanan/permohonan_bantuan/adddata"}
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
                          link={`/admin/menu_layanan/permohonan_bantuan/detaildata/${value.laporan_id}`}
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

                        <ButtonActionFunctionMenu
                          btnFunction={() => setIsModalOpen(true)}
                          btnType={"btn-error"}
                          icon={<MdDelete />}
                        />

                        <ModalAlertDelete
                          isOpen={isModalOpen}
                          onClose={() => setIsModalOpen(false)}
                          onSubmit={() =>
                            DeleteData(value.laporan_id, value.laporan_document)
                          }
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
