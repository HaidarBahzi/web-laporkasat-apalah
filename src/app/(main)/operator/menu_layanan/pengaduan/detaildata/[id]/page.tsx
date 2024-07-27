"use client";

import MenuContainer, {
  MenuBreadCrumbs,
  MenuEditTitle,
} from "@/components/menu";
import { CiViewList } from "react-icons/ci";
import { useCallback, useEffect, useState } from "react";
import {
  ApproveLaporan,
  GetDetailPengaduan,
} from "@/utils/server/pengaduan/pengaduan";
import {
  DetailButtonSubmit,
  ImageShow,
  TextareaInput,
  TextInput,
} from "@/components/form";
import { status_laporan } from "@prisma/client";
import { FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ModalAlertApprove } from "@/components/modal";

export default function Page({ params }: { params: { id: string } }) {
  const [pelaporValues, setPelaporValues] = useState({
    user_ktp: "",
    user_fullname: "",
    user_alamat: "",
    user_phone: "",
  });

  const [pengaduanValues, setPengaduanValues] = useState({
    laporan_title: "",
    laporan_location: "",
    laporan_description: "",
    laporan_document: "",
    laporan_status: "",
  });

  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

  async function approvePengaduan(userKtp: string) {
    try {
      await ApproveLaporan(params.id, status_laporan.C);

      axios
        .post("http://localhost:4000/notification/add", {
          user_id: userKtp,
          title: "Konfirmasi Permohonan Bantuan",
          message:
            "Permohonan Bantuan Anda telah dikonfirmasi, terima kasih atas laporannya!",
        })
        .then(() => {
          router.push("/operator/menu_layanan/pengaduan");
        });
    } catch (err) {
      console.error(err);
    }
  }

  const fetchFormValue = useCallback(async () => {
    try {
      const fetch = await GetDetailPengaduan(params.id);

      setPelaporValues(fetch.pelapor!);
      setPengaduanValues(fetch.pengaduan!);
    } catch (err) {
      console.error(err);
    }
  }, [params.id]);

  useEffect(() => {
    fetchFormValue();
  }, [params.id, fetchFormValue]);

  return (
    <section className="container mx-auto px-16">
      <ModalAlertApprove
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async () => {
          await approvePengaduan(pelaporValues.user_ktp);
        }}
      />

      <MenuBreadCrumbs
        title={"Pengaduan Masyarakat"}
        linkArray={["Dashboard", "Menu Layanan", "Pengaduan Masyarakat"]}
        titleLinkArray={[
          "/operator/dashboard",
          "/operator/menu_layanan/pengaduan",
          "/operator/menu_layanan/pengaduan",
        ]}
        endTitle={"Detail Pengaduan Masyarakat"}
      />

      <MenuContainer>
        <MenuEditTitle
          title="Detail Pengaduan Masyarakat"
          titleIcon={<CiViewList />}
          linkButton="/operator/menu_layanan/pengaduan"
        />

        <hr />

        <div className="form-control gap-5">
          <span className="text-lg font-semibold">Data Pelapor</span>
          <div className="grid grid-cols-6 gap-5">
            <TextInput
              labelText={"KTP Pelapor"}
              inputName={"userKtp"}
              readOnly={true}
              inputPlaceholder={""}
              defValue={pelaporValues.user_ktp}
            />

            <TextInput
              labelText={"Nama Pelapor"}
              inputName={"userKtp"}
              readOnly={true}
              inputPlaceholder={""}
              defValue={pelaporValues.user_fullname}
            />

            <TextInput
              labelText={"Alamat Pelapor"}
              inputName={"userKtp"}
              readOnly={true}
              inputPlaceholder={""}
              defValue={pelaporValues.user_alamat}
            />

            <TextInput
              labelText={"No. HP Pelapor"}
              inputName={"userKtp"}
              readOnly={true}
              inputPlaceholder={""}
              defValue={pelaporValues.user_phone}
            />
          </div>
        </div>

        <div className="form-control gap-5">
          <span className="text-lg font-semibold">Data Pengaduan</span>
          <div className="grid grid-cols-6 gap-5">
            <TextInput
              labelText={"Judul"}
              inputName={"userKtp"}
              readOnly={true}
              inputPlaceholder={""}
              defValue={pengaduanValues.laporan_title}
            />

            <TextInput
              labelText={"Lokasi"}
              inputName={"userKtp"}
              readOnly={true}
              inputPlaceholder={""}
              defValue={pengaduanValues.laporan_location}
            />

            <TextareaInput
              labelText={"Keterangan"}
              inputName={"userKtp"}
              readOnly={true}
              inputPlaceholder={""}
              defValue={pengaduanValues.laporan_description}
            />

            <ImageShow
              labelText={"Bukti Foto"}
              imageSrc={pengaduanValues.laporan_document}
            />
          </div>
        </div>

        {pengaduanValues.laporan_status == status_laporan.S ? (
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
      </MenuContainer>
    </section>
  );
}
