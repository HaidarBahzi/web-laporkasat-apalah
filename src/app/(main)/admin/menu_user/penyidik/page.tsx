"use client";

import MenuContainer, {
  ButtonActionFunctionMenu,
  ButtonActionLinkMenu,
  MenuAddTitle,
  MenuBreadCrumbs,
} from "@/components/menu";
import { CiViewList } from "react-icons/ci";

import { useEffect, useState } from "react";
import { FaPencilAlt, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { formatter } from "@/components/options";
import { ModalAlertDelete } from "@/components/form";
import {
  GetAllPenyidik,
  DeletePenyidik,
} from "@/utils/server/penyidik/penyidik";

type Penyidik = {
  penyidik_id: string;
  pegawai_nip: string;
  pegawai_nama: string | null;
  pegawai_jabatan: string | null;
  penyidik_sk: string;
  penyidik_tgl_sk: Date;
};

type SortKey = keyof Penyidik;

export default function Page() {
  const [penyidik, setPenyidik] = useState<Penyidik[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPenyidik = async () => {
    try {
      const callFunction = await GetAllPenyidik();
      setPenyidik(callFunction!);
    } catch (e) {
      console.error(e);
    }
  };

  const deletePenyidik = async (penyidikId: string) => {
    try {
      await DeletePenyidik(penyidikId);
      await fetchPenyidik();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPenyidik();
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

  const sortedPenyidik = () => {
    let sortableItems = [...penyidik];
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
        title={"Penyidik"}
        linkArray={["Dashboard", "Menu User"]}
        titleLinkArray={["/admin/dashboard", "/admin/menu_user/penyidik"]}
        endTitle={"Penyidik"}
      />

      <MenuContainer>
        <MenuAddTitle
          title="Daftar Penyidik"
          titleIcon={<CiViewList />}
          linkButton="/admin/menu_user/penyidik/adddata"
        />

        <hr />

        <div className="overflow-x-hidden">
          {sortedPenyidik().length > 0 ? (
            <table className="table table-sm">
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
                      onClick={() => sortData("pegawai_jabatan")}
                    >
                      JABATAN {getSortIcon("pegawai_jabatan")}
                    </button>
                  </th>
                  <th className="font-semibold">
                    <button
                      className="flex items-center gap-2"
                      onClick={() => sortData("penyidik_sk")}
                    >
                      NOMOR SK {getSortIcon("penyidik_sk")}
                    </button>
                  </th>
                  <th className="font-semibold">
                    <button
                      className="flex items-center gap-2"
                      onClick={() => sortData("penyidik_tgl_sk")}
                    >
                      TANGGAL SK {getSortIcon("penyidik_tgl_sk")}
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedPenyidik().map((value, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex gap-2 justify-center">
                        <ButtonActionLinkMenu
                          link={`/admin/menu_user/penyidik/editdata/${value.penyidik_id}`}
                          btnType={"btn-warning"}
                          icon={<FaPencilAlt />}
                        />

                        <ButtonActionFunctionMenu
                          btnFunction={() => setIsModalOpen(true)}
                          btnType={"btn-error"}
                          icon={<MdDelete />}
                        />

                        <ModalAlertDelete
                          isOpen={isModalOpen}
                          onClose={() => setIsModalOpen(false)}
                          onSubmit={() => deletePenyidik(value.penyidik_id)}
                        />
                      </div>
                    </td>
                    <td>{index + 1}</td>
                    <td>{value.pegawai_nip}</td>
                    <td>{value.pegawai_nama}</td>
                    <td>{value.pegawai_jabatan}</td>
                    <td>{value.penyidik_sk}</td>
                    <td>{formatter.format(new Date(value.penyidik_tgl_sk))}</td>
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
