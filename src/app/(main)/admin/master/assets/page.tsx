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
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { assetType } from "@/components/options";
import { ModalAlertDelete } from "@/components/form";
import Image from "next/image";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [assets, setAssets] = useState<
    {
      asset_id: number;
      asset_photo: string;
      asset_title: string;
      asset_url: string | null;
      asset_type: asset_status;
    }[]
  >([]);

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

  return (
    <section className="container mx-auto px-24">
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

        <div className="overflow-x-auto">
          {assets.length > 0 ? (
            <table className="table table-sm">
              <thead>
                <tr>
                  <th></th>
                  <th>NO</th>
                  <th>NAMA ASET</th>
                  <th>GAMBAR ASET</th>
                  <th>URL ASET</th>
                  <th>TIPE ASET</th>
                </tr>
              </thead>

              <tbody>
                {assets.map((value, index) => (
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
                        className="w-26 h-20"
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
