"use client";

import MenuContainer, {
  MenuBreadCrumbs,
  MenuEditTitle,
} from "@/components/menu";
import { CiViewList } from "react-icons/ci";
import { useCallback, useEffect, useState } from "react";
import {
  ApprovePermohonan,
  GetDetailPermohonanBantuan,
} from "@/utils/server/permohonan_bantuan/permohonan_bantuan";
import {
  DetailButtonSubmit,
  ModalAlertApprove,
  TextareaInput,
  TextInput,
} from "@/components/form";
import { FaCheck, FaPaperclip } from "react-icons/fa";
import Link from "next/link";
import { status_laporan } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
  const [pemohonValues, setPemohonValues] = useState({
    user_ktp: "",
    user_fullname: "",
    user_alamat: "",
    user_phone: "",
  });

  const [permohonanValues, setPermohonanValues] = useState({
    laporan_title: "",
    laporan_description: "",
    laporan_location: "",
    laporan_document: "",
    laporan_status: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  async function approvePermohonan() {
    try {
      await ApprovePermohonan(params.id, status_laporan.C);
      router.push("/operator/menu_layanan/permohonan_bantuan");
    } catch (err) {
      console.error(err);
    }
  }

  const FetchDetailData = useCallback(async () => {
    try {
      const callAllPermohonan = await GetDetailPermohonanBantuan(params.id);
      setPermohonanValues(callAllPermohonan.permohonan!);
      setPemohonValues(callAllPermohonan.user!);
    } catch (e) {
      console.error(e);
    }
  }, [params.id]);

  useEffect(() => {
    FetchDetailData();
  }, [params.id, FetchDetailData]);

  return (
    <section className="container mx-auto px-24">
      <ModalAlertApprove
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async () => {
          await approvePermohonan();
        }}
      />

      <MenuBreadCrumbs
        title={"Permohonan Bantuan"}
        linkArray={["Dashboard", "Menu Layanan", "Permohonan Bantuan"]}
        titleLinkArray={[
          "/operator/dashboard",
          "/operator/menu_layanan/permohonan_bantuan",
          "/operator/menu_layanan/permohonan_bantuan",
        ]}
        endTitle={"Detail Permohonan"}
      />

      <MenuContainer>
        <MenuEditTitle
          title="Detail Permohonan Bantuan"
          titleIcon={<CiViewList />}
          linkButton="/operator/menu_layanan/permohonan_bantuan"
        />

        <hr />

        <div className="form-control gap-5">
          <span className="text-lg font-bold">Data Pemohon</span>
          <div className="grid grid-cols-6 gap-5">
            <TextInput
              labelText={"KTP Pemohon"}
              inputName={""}
              readOnly={true}
              inputPlaceholder={""}
              defValue={pemohonValues.user_ktp}
            />

            <TextInput
              labelText={"Nama Pemohon"}
              inputName={""}
              readOnly={true}
              inputPlaceholder={""}
              defValue={pemohonValues.user_fullname}
            />

            <TextInput
              labelText={"Alamat Pemohon"}
              inputName={""}
              readOnly={true}
              inputPlaceholder={""}
              defValue={pemohonValues.user_alamat}
            />

            <TextInput
              labelText={"No. HP Pemohon"}
              inputName={""}
              readOnly={true}
              inputPlaceholder={""}
              defValue={pemohonValues.user_phone}
            />
          </div>
        </div>

        <div className="form-control gap-5">
          <span className="text-lg font-bold">Data Permohonan</span>
          <div className="grid grid-cols-6 gap-5">
            <TextInput
              labelText={"Judul"}
              inputName={""}
              readOnly={true}
              inputPlaceholder={""}
              defValue={permohonanValues.laporan_title}
            />

            <TextInput
              labelText={"Lokasi"}
              inputName={""}
              readOnly={true}
              inputPlaceholder={""}
              defValue={permohonanValues.laporan_location}
            />

            <TextareaInput
              labelText={"Keterangan"}
              inputName={""}
              readOnly={true}
              inputPlaceholder={""}
              defValue={permohonanValues.laporan_description}
            />

            <>
              <label className="text-xs w-fit font-thin text-gray-900">
                Surat Pemohon
              </label>

              <Link
                target="_blank"
                href={`${window.location.origin}/pdf-uploads/${permohonanValues.laporan_document}`}
                className="bg-gray-100 w-fit h-fit gap-2 items-center flex col-span-2 text-gray-900 text-xs rounded p-2.5"
              >
                <i>
                  <FaPaperclip />
                </i>
                Open Document
              </Link>
            </>
          </div>

          {permohonanValues.laporan_status == status_laporan.S ? (
            <>
              <hr />

              <div className="flex justify-center">
                <DetailButtonSubmit
                  onPress={() => setIsModalOpen(true)}
                  icon={<FaCheck />}
                  title={"Approve"}
                />
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </MenuContainer>
    </section>
  );
}
