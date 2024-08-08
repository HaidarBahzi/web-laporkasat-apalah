"use client";

import MenuContainer, {
  ButtonActionFunctionMenu,
  ButtonActionLinkMenu,
  MenuAddTitle,
  MenuBreadCrumbs,
} from "@/components/menu";
import { CiViewList } from "react-icons/ci";
import { useEffect, useState } from "react";
import {
  DeleteDokumenPermohonan,
  DeletePermohonanBantuan,
  GetAllPermohonanBantuan,
} from "@/utils/server/permohonan_bantuan/permohonan_bantuan";
import { IoMdInformationCircle } from "react-icons/io";
import { MdDelete, MdLocalPrintshop } from "react-icons/md";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import {
  formatter,
  laporanStatus,
  PermohonanType,
  roleType,
} from "@/components/options";
import { ModalAlertDelete } from "@/components/modal";
import { PrintLaporanPermohonanDetail } from "@/utils/server/print_laporan/print_detail";

type SortKey = keyof PermohonanType;

export default function Page() {
  const [permohonan, setPermohonan] = useState<PermohonanType[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState({
    laporanId: "",
    laporanImage: "",
    bolean: false,
  });

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

  const RESULTS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(sortedPermohonan().length / RESULTS_PER_PAGE);
  const displayedPermohonan = sortedPermohonan().slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
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

        <div className="overflow-x-hidden form-control justify-between min-h-96">
          {sortedPermohonan().length > 0 ? (
            <>
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
                  {displayedPermohonan.map((value, index) => (
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
                            btnFunction={() =>
                              setIsModalOpen({
                                laporanId: value.laporan_id,
                                laporanImage: value.laporan_document,
                                bolean: true,
                              })
                            }
                            btnType={"btn-error"}
                            icon={<MdDelete />}
                          />

                          <ModalAlertDelete
                            isOpen={isModalOpen.bolean}
                            onClose={() =>
                              setIsModalOpen({
                                laporanId: "",
                                laporanImage: "",
                                bolean: false,
                              })
                            }
                            onSubmit={() =>
                              DeleteData(
                                isModalOpen.laporanId,
                                isModalOpen.laporanImage
                              )
                            }
                          />
                        </div>
                      </td>
                      <td>
                        {(currentPage - 1) * RESULTS_PER_PAGE + index + 1}
                      </td>
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

              <div className="join flex items-center justify-center gap-8">
                <button
                  className={`join-item ${
                    currentPage === 1 ? "hidden" : "flex"
                  }`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <i>
                    <FaAngleDoubleLeft />
                  </i>
                </button>
                <div className="join-item text-sm font-normal">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  className={`join-item ${
                    currentPage === totalPages ? "hidden" : "flex"
                  }`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <i>
                    <FaAngleDoubleRight />
                  </i>
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center">Tidak ada Data Permohonan</div>
          )}
        </div>
      </MenuContainer>
    </section>
  );
}
