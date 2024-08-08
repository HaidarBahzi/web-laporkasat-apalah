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

import { MdDelete } from "react-icons/md";
import {
  FaSortUp,
  FaSortDown,
  FaSort,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import {
  formatter,
  PengaduanType,
  roleType,
  TindakLaporanType,
  tindakStatus,
} from "@/components/options";
import { ModalAlertDelete } from "@/components/modal";
import { GetAllPermohonanTindak } from "@/utils/server/tindak_lanjut/Permohonan";
import { CheckLaporan } from "@/utils/server/pelanggaran/pelanggaran";
import { status_laporan } from "@prisma/client";
import {
  GetAllPermohonanBantuan,
  GetAllPermohonanBantuanTindak,
} from "@/utils/server/permohonan_bantuan/permohonan_bantuan";

type SortKey = keyof PengaduanType;

export default function Page() {
  const [permohonan, setPermohonan] = useState<PengaduanType[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState({
    tindakId: "",
    bolean: false,
  });

  const [tindak, setTindak] = useState<{ [key: string]: number }>({});

  async function FetchAllData() {
    try {
      const callAllpermohonan = await GetAllPermohonanBantuanTindak();
      setPermohonan(callAllpermohonan!);

      const violationsData: { [key: string]: number } = {};
      for (const item of callAllpermohonan!) {
        const result = await CheckLaporan(
          item.laporan_id,
          status_laporan.D || status_laporan.R
        );
        violationsData[item.laporan_id] = result;
      }
      setTindak(violationsData);
    } catch (e) {
      console.error(e);
    }
  }

  async function DeleteData(tindakId: string) {
    try {
      await FetchAllData();
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

  const sortedpermohonan = () => {
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

  const totalPages = Math.ceil(sortedpermohonan().length / RESULTS_PER_PAGE);
  const displayedpermohonan = sortedpermohonan().slice(
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
        title={"Tindak Lanjut Permohonan Bantuan"}
        linkArray={["Dashboard", "Menu Tindak Lanjut"]}
        titleLinkArray={["/gakda/dashboard", "/gakda/menu_tindak/permohonan"]}
        endTitle={"Permohonan Masyarakat"}
      />

      <MenuContainer>
        <MenuNothing
          title="Daftar Permohonan Masyarakat"
          titleIcon={<CiViewList />}
        />

        <hr />

        <div className="overflow-x-hidden form-control justify-between min-h-96">
          {sortedpermohonan().length > 0 ? (
            <>
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th></th>
                    <th className="font-semibold">NO</th>
                    <th className="font-semibold">
                      <button
                        className="flex items-center gap-2"
                        onClick={() => sortData("laporan_tgl_send")}
                      >
                        TANGGAL {getSortIcon("laporan_tgl_send")}
                      </button>
                    </th>
                    <th className="font-semibold">
                      <button
                        className="flex items-center gap-2"
                        onClick={() => sortData("laporan_action")}
                      >
                        BIDANG PENINDAK {getSortIcon("laporan_action")}
                      </button>
                    </th>
                    <th className="font-semibold">
                      <button
                        className="flex items-center gap-2"
                        onClick={() => sortData("laporan_title")}
                      >
                        JUDUL {getSortIcon("laporan_title")}
                      </button>
                    </th>
                    <th className="font-semibold">
                      <button
                        className="flex items-center gap-2"
                        onClick={() => sortData("laporan_location")}
                      >
                        LOKASI {getSortIcon("laporan_location")}
                      </button>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {displayedpermohonan.map((value, index) => (
                    <tr key={index}>
                      <td>
                        <div className={"flex gap-2 justify-center"}>
                          {tindak[value.laporan_id] === 0 ? (
                            <ButtonActionLinkMenu
                              link={`/gakda/menu_tindak/permohonan_bantuan/detaildata/${value.laporan_id}`}
                              btnType={"btn-warning"}
                              icon={<IoMdInformationCircle />}
                            />
                          ) : (
                            <></>
                          )}

                          {/* <ButtonActionFunctionMenu
                            btnFunction={() =>
                              setIsModalOpen({
                                tindakId: value.tindak_lanjut_id,
                                bolean: true,
                              })
                            }
                            btnType={"btn-error"}
                            icon={<MdDelete />}
                          /> */}

                          <ModalAlertDelete
                            isOpen={isModalOpen.bolean}
                            onClose={() =>
                              setIsModalOpen({
                                tindakId: "",
                                bolean: false,
                              })
                            }
                            onSubmit={() => DeleteData(isModalOpen.tindakId)}
                          />
                        </div>
                      </td>
                      <td>
                        {(currentPage - 1) * RESULTS_PER_PAGE + index + 1}
                      </td>
                      <td>{formatter.format(value.laporan_tgl_send)}</td>
                      <td>{roleType[value.laporan_action!]}</td>
                      <td>{value.laporan_title}</td>
                      <td>{value.laporan_location}</td>
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
            <div className="flex justify-center">Tidak ada Data permohonan</div>
          )}
        </div>
      </MenuContainer>
    </section>
  );
}
