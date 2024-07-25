"use client";

import MenuContainer, {
  ButtonActionFunctionMenu,
  ButtonActionLinkMenu,
  MenuAddTitle,
  MenuBreadCrumbs,
} from "@/components/menu";
import { CiViewList } from "react-icons/ci";
import {
  DeleteAsset,
  DeleteImageAsset,
  GetAllAssets,
} from "@/utils/server/master/assets";

import { useEffect, useState } from "react";
import { asset_status } from "@prisma/client";
import { FaPencilAlt, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { assetType } from "@/components/options";
import { ModalAlertDelete } from "@/components/form";
import Image from "next/image";

type Asset = {
  asset_id: number;
  asset_photo: string;
  asset_title: string;
  asset_url: string | null;
  asset_type: asset_status;
};

type SortKey = keyof Asset;

export default function Page() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAssets = async () => {
    try {
      const callFunction = await GetAllAssets();
      setAssets(callFunction!);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteAsset = async (assetId: number, assetName: string) => {
    try {
      await DeleteAsset(assetId);
      await DeleteImageAsset(assetName);
      await fetchAssets();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAssets();
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

  const sortedAsset = () => {
    let sortableItems = [...assets];
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
        title={"Users"}
        linkArray={["Dashboard", "Master"]}
        titleLinkArray={["/admin/dashboard", "/admin/master/assets"]}
        endTitle={"Aset Mobile"}
      />

      <MenuContainer>
        <MenuAddTitle
          title="Daftar Asset Mobile"
          titleIcon={<CiViewList />}
          linkButton="/admin/master/assets/adddata"
        />

        <hr />

        <div className="overflow-x-hidden">
          {sortedAsset().length > 0 ? (
            <table className="table table-sm">
              <thead>
                <tr>
                  <th></th>
                  <th className="font-semibold">NO</th>
                  <th className="font-semibold">
                    <button
                      className="flex items-center gap-2"
                      onClick={() => sortData("asset_title")}
                    >
                      NAMA ASET {getSortIcon("asset_title")}
                    </button>
                  </th>
                  <th className="font-semibold">
                    <button
                      className="flex items-center gap-2"
                      onClick={() => sortData("asset_photo")}
                    >
                      GAMBAR ASET {getSortIcon("asset_photo")}
                    </button>
                  </th>
                  <th className="font-semibold">
                    <button
                      className="flex items-center gap-2"
                      onClick={() => sortData("asset_url")}
                    >
                      URL ASET {getSortIcon("asset_url")}
                    </button>
                  </th>
                  <th className="font-semibold">
                    <button
                      className="flex items-center gap-2"
                      onClick={() => sortData("asset_type")}
                    >
                      TIPE ASET {getSortIcon("asset_type")}
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedAsset().map((value, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex gap-2 justify-center">
                        <ButtonActionLinkMenu
                          link={`/admin/master/assets/editdata/${value.asset_id}`}
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
                          onSubmit={() =>
                            deleteAsset(value.asset_id, value.asset_photo)
                          }
                        />
                      </div>
                    </td>
                    <td>{index + 1}</td>
                    <td>{value.asset_title}</td>
                    <td>
                      <Image
                        src={`${window.location.origin}/foto-aset/${value.asset_photo}`}
                        className="w-36 h-20"
                        width={0}
                        height={0}
                        sizes="100vw"
                        alt={"Current Asset"}
                      />
                    </td>
                    <td>{value.asset_url}</td>
                    <td>{assetType[value.asset_type]}</td>
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
