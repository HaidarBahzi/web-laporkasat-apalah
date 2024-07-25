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

import { setup_kelamin, setup_role, setup_status_aktif } from "@prisma/client";

import { useEffect, useState } from "react";

import { CiViewList } from "react-icons/ci";
import { FaPencilAlt, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import { jkType, pegawaiStatusType, roleType } from "@/components/options";
import { ModalAlertCantDelete, ModalAlertDelete } from "@/components/form";
import { getDataSession } from "@/utils/lib/session";

type Pegawai = {
  pegawai_nip: string;
  pegawai_nama: string;
  pegawai_jk: setup_kelamin;
  pegawai_jabatan: string;
  pendidikan_id: number;
  status_pegawai_id: number;
  pegawai_status: setup_status_aktif;
  pegawai_role: setup_role;
  bidang_id: number;
  pegawai_foto: string;
};

type SortKey = keyof Pegawai;

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const [pegawai, setPegawai] = useState<Pegawai[]>([]);
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

        <div className="overflow-x-hidden">
          {sortedPegawai().length > 0 ? (
            <table className="table table-auto">
              <thead>
                <tr>
                  <th></th>
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
                {sortedPegawai().map((user, index) => (
                  <tr key={index}>
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
                              setIsModalOpen(true);
                            }
                          }}
                          btnType={"btn-error"}
                          icon={<MdDelete />}
                        />

                        <ModalAlertDelete
                          isOpen={isModalOpen}
                          onClose={() => setIsModalOpen(false)}
                          onSubmit={async () =>
                            await deletePegawai(
                              user.pegawai_nip,
                              user.pegawai_foto
                            )
                          }
                        />

                        <ModalAlertCantDelete
                          isOpen={isAlertOpen}
                          onClose={() => setIsAlertOpen(false)}
                        />
                      </div>
                    </td>
                    <td>{index + 1}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center">Tidak ada Data</div>
          )}
        </div>
      </MenuContainer>
    </section>
  );
}
