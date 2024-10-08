"use client";

import MenuContainer, {
  MenuBreadCrumbs,
  MenuEditTitle,
} from "@/components/menu";
import { CiViewList } from "react-icons/ci";
import { useCallback, useEffect, useState } from "react";
import {
  ApproveLaporanKasat,
  GetDetailPengaduan,
} from "@/utils/server/pengaduan/pengaduan";
import {
  DetailButtonSubmit,
  ImageShow,
  TextareaInput,
  TextInput,
} from "@/components/form";
import { setup_role, status_laporan } from "@prisma/client";
import { FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import { bidangType, roleType } from "@/components/options";
import { ModalAlertApproveBidang } from "@/components/modal";

export default function Page({ params }: { params: { id: string } }) {
  const [pelaporValues, setPelaporValues] = useState({
    user_mail: "",
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

  const [formValues, setFormValues] = useState({
    input_role: 0,
  });

  const handleDropdownChange = (selectedValue: any, inputName: string) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [inputName]: selectedValue,
    }));
  };

  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

  async function approvePengaduan(bidangId: number, userKtp: string) {
    try {
      await ApproveLaporanKasat(params.id, bidangId);

      axios
        .post("http://103.30.180.221:4000/notification/add", {
          user_id: userKtp,
          title: "Tindak Laporan",
          message: `Laporan Anda sedang ditindak oleh ${bidangType[bidangId]}, terima kasih atas laporannya!`,
        })
        .then(() => {
          router.push("/kasat/menu_layanan/pengaduan");
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
      <ModalAlertApproveBidang
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async () => {
          await approvePengaduan(
            formValues.input_role,
            pelaporValues.user_mail
          );
        }}
        handleChange={(selectedValue) =>
          handleDropdownChange(selectedValue, "input_role")
        }
        inputName={"inputRole"}
        optionTitle={"Silahkan Pilih Bidang"}
        optionValue={[
          {
            title: "Gakda",
            value: 1,
          },

          {
            title: "Tibum",
            value: 2,
          },
          {
            title: "Lindam",
            value: 3,
          },
        ]}
        defaultValue={""}
      />

      <MenuBreadCrumbs
        title={"Pengaduan Masyarakat"}
        linkArray={["Dashboard", "Menu Layanan", "Pengaduan Masyarakat"]}
        titleLinkArray={[
          "/kasat/dashboard",
          "/kasat/menu_layanan/pengaduan",
          "/kasat/menu_layanan/pengaduan",
        ]}
        endTitle={"Detail Pengaduan Masyarakat"}
      />

      <MenuContainer>
        <MenuEditTitle
          title="Detail Pengaduan Masyarakat"
          titleIcon={<CiViewList />}
          linkButton="/kasat/menu_layanan/pengaduan"
        />

        <hr />

        <div className="form-control gap-5">
          <span className="text-lg font-semibold">Data Pelapor</span>
          <div className="grid grid-cols-6 gap-5">
            <TextInput
              labelText={"Email Pelapor"}
              inputName={"userKtp"}
              readOnly={true}
              inputPlaceholder={""}
              defValue={pelaporValues.user_mail}
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

        {pengaduanValues.laporan_status == status_laporan.C ? (
          <>
            <hr />

            <div className="flex justify-center">
              <DetailButtonSubmit
                onPress={() => setIsModalOpen(true)}
                icon={<FaCheck />}
                title={"Tindak"}
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
