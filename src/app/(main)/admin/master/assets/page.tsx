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
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaPencilAlt,
  FaSort,
  FaSortDown,
  FaSortUp,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { AssetType, assetType } from "@/components/options";
import { ModalAlertDelete } from "@/components/modal";
import Image from "next/image";

type SortKey = keyof AssetType;

export default function Page() {
  const [assets, setAssets] = useState<AssetType[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState({
    asetId: 0,
    asetName: "",
    bolean: false,
  });

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

  const RESULTS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(sortedAsset().length / RESULTS_PER_PAGE);
  const displayedAsset = sortedAsset().slice(
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

        <div className="overflow-x-hidden form-control justify-between min-h-96">
          {sortedAsset().length > 0 ? (
            <>
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
                            btnFunction={() =>
                              setIsModalOpen({
                                asetId: value.asset_id,
                                asetName: value.asset_photo,
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
                                asetId: 0,
                                asetName: "",
                                bolean: false,
                              })
                            }
                            onSubmit={() =>
                              deleteAsset(
                                isModalOpen.asetId,
                                isModalOpen.asetName
                              )
                            }
                          />
                        </div>
                      </td>
                      <td>
                        {(currentPage - 1) * RESULTS_PER_PAGE + index + 1}
                      </td>
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
