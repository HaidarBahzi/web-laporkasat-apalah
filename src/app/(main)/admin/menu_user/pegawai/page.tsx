"use client";

import MenuContainer, {
  ButtonActionFunctionMenu,
  ButtonActionLinkMenu,
  MenuAddTitle,
  MenuBreadCrumbs,
} from "@/components/menu";

import {
  DeleteImagePegawai,
  DeletePegawai,
  GetAllPegawai,
} from "@/utils/server/pegawai/pegawai";

import { useEffect, useState } from "react";
import { CiViewList } from "react-icons/ci";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaPencilAlt,
  FaSort,
  FaSortDown,
  FaSortUp,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import {
  jkType,
  pegawaiStatusType,
  PegawaiType,
  roleType,
} from "@/components/options";
import { ModalAlertCantDelete, ModalAlertDelete } from "@/components/modal";
import { getDataSession } from "@/utils/lib/session";

type SortKey = keyof PegawaiType;

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState({
    pegawaiId: "",
    image: "",
    bolean: false,
  });

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const [pegawai, setPegawai] = useState<PegawaiType[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>(null);

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

  const sortedPegawai = () => {
    let sortableItems = [...pegawai];
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

  const RESULTS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(sortedPegawai().length / RESULTS_PER_PAGE);
  const displayedPegawai = sortedPegawai().slice(
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

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort />;
    }
    if (sortConfig.direction === "ascending") {
      return <FaSortUp />;
    }
    return <FaSortDown />;
  };

  const [pegawaiPendidikan, setPegawaiPendidikan] = useState<{
    [key: number]: { pendidikan_nama: string };
  }>({});
  const [pegawaiStatus, setPegawaiStatus] = useState<{
    [key: number]: { status_pegawai_nama: string };
  }>({});
  const [pegawaiBidang, setPegawaiBidang] = useState<{
    [key: number]: { bidang_nama: string };
  }>({});

  const fetchUser = async () => {
    try {
      const callAllPegawai = await GetAllPegawai();
      setPegawai(callAllPegawai.pegawai);
      setPegawaiBidang(callAllPegawai.bidang);
      setPegawaiPendidikan(callAllPegawai.pendidikan);
      setPegawaiStatus(callAllPegawai.status);
    } catch (error) {
      console.log(`Gagal dalam menapat data: ${error}`);
    }
  };

  const deletePegawai = async (pegawaiNip: string, pegawaiImage: string) => {
    try {
      await DeletePegawai(pegawaiNip);
      await DeleteImagePegawai(pegawaiImage);
      await fetchUser();
    } catch (error) {
      console.log("Gagal menghapus user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <section className="container mx-auto px-16">
      <MenuBreadCrumbs
        title={"Pegawai"}
        linkArray={["Dashboard", "Menu User"]}
        titleLinkArray={["/admin/dashboard", "/admin/menu_user/users"]}
        endTitle={"Pegawai"}
      />

      <MenuContainer>
        <MenuAddTitle
          title="Daftar Pegawai"
          titleIcon={<CiViewList />}
          linkButton="/admin/menu_user/pegawai/adddata"
        />

        <hr />

        <div className="overflow-x-hidden form-control justify-between min-h-96">
          {sortedPegawai().length > 0 ? (
            <>
              <table className="table table-auto">
                <thead>
                  <tr>
                    <th className="font-semibold">NO</th>
                    <th className="font-semibold">
                      <button
                        className="flex items-center gap-2"
                        onClick={() => sortData("pegawai_nip")}
                      >
                        NIP {getSortIcon("pegawai_nip")}
                      </button>
                    </th>
                    <th className="font-semibold">
                      <button
                        className="flex items-center gap-2"
                        onClick={() => sortData("pegawai_nama")}
                      >
                        NAMA {getSortIcon("pegawai_nama")}
                      </button>
                    </th>
                    <th className="font-semibold">
                      <button
                        className="flex items-center gap-2"
                        onClick={() => sortData("bidang_id")}
                      >
                        BIDANG {getSortIcon("bidang_id")}
                      </button>
                    </th>
                    <th className="font-semibold">
                      <button
                        className="flex items-center gap-2"
                        onClick={() => sortData("pegawai_jabatan")}
                      >
                        JABATAN {getSortIcon("pegawai_jabatan")}
                      </button>
                    </th>
                    <th className="font-semibold">
                      <button
                        className="flex items-center gap-2"
                        onClick={() => sortData("pegawai_jk")}
                      >
                        JENIS KELAMIN {getSortIcon("pegawai_jk")}
                      </button>
                    </th>
                    <th className="font-semibold">
                      <button
                        className="flex items-center gap-2"
                        onClick={() => sortData("pendidikan_id")}
                      >
                        PENDIDIKAN {getSortIcon("pendidikan_id")}
                      </button>
                    </th>
                    <th className="font-semibold">
                      <button
                        className="flex items-center gap-2"
                        onClick={() => sortData("pegawai_role")}
                      >
                        ROLE {getSortIcon("pegawai_role")}
                      </button>
                    </th>
                    <th className="font-semibold">
                      <button
                        className="flex items-center gap-2"
                        onClick={() => sortData("status_pegawai_id")}
                      >
                        STATUS {getSortIcon("status_pegawai_id")}
                      </button>
                    </th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {displayedPegawai.map((user, index) => (
                    <tr key={index}>
                      <td>
                        {(currentPage - 1) * RESULTS_PER_PAGE + index + 1}
                      </td>
                      <td>{user.pegawai_nip}</td>
                      <td>{user.pegawai_nama}</td>
                      <td>{pegawaiBidang[user.bidang_id]?.bidang_nama}</td>
                      <td>{user.pegawai_jabatan}</td>
                      <td>{jkType[user.pegawai_jk]}</td>
                      <td>
                        {pegawaiPendidikan[user.pendidikan_id]?.pendidikan_nama}
                      </td>
                      <td>{roleType[user.pegawai_role]}</td>
                      <td>
                        <div className="flex gap-1 justify-center">
                          <div>
                            {
                              pegawaiStatus[user.status_pegawai_id]
                                ?.status_pegawai_nama
                            }
                          </div>
                          - <div>{pegawaiStatusType[user.pegawai_status]}</div>
                        </div>
                      </td>
                      <td>
                        <div className={"flex gap-2 justify-center"}>
                          <ButtonActionLinkMenu
                            link={`/admin/menu_user/pegawai/editdata/${user.pegawai_nip}`}
                            btnType={"btn-warning"}
                            icon={<FaPencilAlt />}
                          />

                          <ButtonActionFunctionMenu
                            btnFunction={async () => {
                              const session = await getDataSession();

                              if (session.idUser == user.pegawai_nip) {
                                setIsAlertOpen(true);
                              } else {
                                setIsModalOpen({
                                  bolean: true,
                                  pegawaiId: user.pegawai_nip,
                                  image: user.pegawai_foto,
                                });
                              }
                            }}
                            btnType={"btn-error"}
                            icon={<MdDelete />}
                          />

                          <ModalAlertDelete
                            isOpen={isModalOpen.bolean}
                            onClose={() =>
                              setIsModalOpen({
                                pegawaiId: "",
                                image: "",
                                bolean: false,
                              })
                            }
                            onSubmit={async () =>
                              await deletePegawai(
                                isModalOpen.pegawaiId,
                                isModalOpen.image
                              )
                            }
                          />

                          <ModalAlertCantDelete
                            isOpen={isAlertOpen}
                            onClose={() => setIsAlertOpen(false)}
                          />
                        </div>
                      </td>
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
            <div className="flex justify-center">Tidak ada Data</div>
          )}
        </div>
      </MenuContainer>
    </section>
  );
}
