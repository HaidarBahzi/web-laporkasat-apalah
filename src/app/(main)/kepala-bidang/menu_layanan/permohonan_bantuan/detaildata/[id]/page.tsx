"use client";

import MenuContainer, {
  MenuBreadCrumbs,
  MenuEditTitle,
} from "@/components/menu";
import { CiViewList } from "react-icons/ci";
import { useCallback, useEffect, useState } from "react";
import { GetDetailPermohonanBantuan } from "@/utils/server/permohonan_bantuan/permohonan_bantuan";
import {
  DetailButtonSubmit,
  TextareaInput,
  TextInput,
} from "@/components/form";
import { FaCheck, FaPaperclip } from "react-icons/fa";
import Link from "next/link";
import { status_laporan } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ApproveLaporanKepalaBidang } from "@/utils/server/pengaduan/pengaduan";
import { ModalSearchPegawai } from "@/components/modal";

export default function Page({ params }: { params: { id: string } }) {
  const [pemohonValues, setPemohonValues] = useState({
    user_mail: "",
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

  async function approvePermohonan(pegawaiNip: string) {
    try {
      await ApproveLaporanKepalaBidang(params.id, pegawaiNip);
      router.push("/kepala-bidang/menu_layanan/permohonan_bantuan");
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
    <section className="container mx-auto px-16">
      <ModalSearchPegawai
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (pegawaiNip: string) => {
          setIsModalOpen(false);

          await approvePermohonan(pegawaiNip);
        }}
      />

      <MenuBreadCrumbs
        title={"Permohonan Bantuan"}
        linkArray={["Dashboard", "Menu Layanan", "Permohonan Bantuan"]}
        titleLinkArray={[
          "/kepala-bidang/dashboard",
          "/kepala-bidang/menu_layanan/permohonan_bantuan",
          "/kepala-bidang/menu_layanan/permohonan_bantuan",
        ]}
        endTitle={"Detail Permohonan"}
      />

      <MenuContainer>
        <MenuEditTitle
          title="Detail Permohonan Bantuan"
          titleIcon={<CiViewList />}
          linkButton="/kepala-bidang/menu_layanan/permohonan_bantuan"
        />

        <hr />

        <div className="form-control gap-5">
          <span className="text-lg font-semibold">Data Pemohon</span>
          <div className="grid grid-cols-6 gap-5">
            <TextInput
              labelText={"Email Pemohon"}
              inputName={""}
              readOnly={true}
              inputPlaceholder={""}
              defValue={pemohonValues.user_mail}
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
          <span className="text-lg font-semibold">Data Permohonan</span>
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
              <label className="text-xs w-fit font-normal text-gray-900">
                Surat Pemohon
              </label>

              <Link
                target="_blank"
                href={`http://103.30.180.221/web-laporkasat-apalah/assets/pdf-uploads/${permohonanValues.laporan_document}`}
                className="bg-gray-100 w-fit h-fit gap-2 items-center flex col-span-2 text-gray-900 text-xs rounded p-2.5"
              >
                <i>
                  <FaPaperclip />
                </i>
                Open Document
              </Link>
            </>
          </div>

          {permohonanValues.laporan_status == status_laporan.P ? (
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
