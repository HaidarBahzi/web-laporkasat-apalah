"use client";

import { logout } from "@/utils/lib/session";
import MenuContainer, { MenuBreadCrumbs } from "@/components/menu";
import { TextInput } from "@/components/form";
import { useEffect, useState } from "react";
import { GetProfile } from "@/utils/server/profile/profile";
import { roleType } from "@/components/options";
import Image from "next/image";
import { ModalAlertLogout } from "@/components/modal";

export default function Page({ params }: { params: { id: string } }) {
  const [formValues, setFormValues] = useState({
    pegawai_nip: "",
    pegawai_nik: "",
    pegawai_password: "",
    pegawai_nama: "",
    pegawai_jk: "",
    pegawai_tempat_lahir: "",
    pegawai_tanggal_lahir: new Date(""),
    pegawai_phone: "",
    pegawai_email: "",
    pegawai_alamat: "",
    pegawai_foto: "",
    pegawai_jabatan: "",

    agama_id: 0,
    pendidikan_id: 0,
    status_pegawai_id: 0,
    status_kawin_id: 0,

    pegawai_kewarganegaraan: "",
    pegawai_status: "",
    pegawai_role: "",
    bidang_id: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const dataProfile = await GetProfile(params.id);

        setFormValues(dataProfile!);
      } catch (e) {
        console.error(e);
      }
    };

    fetchAdditionalData();
  }, [params.id]);

  return (
    <section className="container mx-auto px-16">
      <MenuBreadCrumbs
        title={"Profil"}
        linkArray={["Dashboard"]}
        titleLinkArray={["/tibum/dashboard"]}
        endTitle={"Profil Saya"}
      />

      <MenuContainer>
        <div className="flex gap-10 items-center ">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                src={`${window.location.origin}/foto-pegawai/${formValues.pegawai_foto}`}
                alt={"User Profile Picture"}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label>{formValues.pegawai_nama}</label>
            <label>
              {formValues.pegawai_email} - {roleType[formValues.pegawai_role]}
            </label>
          </div>
        </div>

        <div className="form-control gap-5">
          <span className="text-xl font-semibold">Detail Akun</span>

          <hr />

          <div className="grid grid-cols-3 gap-5 items-center">
            <TextInput
              labelText={"Pegawai Nip"}
              inputName={""}
              inputPlaceholder={""}
              defValue={formValues.pegawai_nip}
            />

            <TextInput
              labelText={"Pegawai Nik"}
              inputName={""}
              inputPlaceholder={""}
              defValue={formValues.pegawai_nik}
            />

            <TextInput
              labelText={"Nama Lengkap"}
              inputName={""}
              inputPlaceholder={""}
              defValue={formValues.pegawai_nama}
            />

            <TextInput
              labelText={"Email"}
              inputName={""}
              inputPlaceholder={""}
              defValue={formValues.pegawai_email}
            />

            <TextInput
              labelText={"No. Handphone"}
              inputName={""}
              inputPlaceholder={""}
              defValue={formValues.pegawai_phone}
            />
          </div>

          <button
            className="btn btn-error max-w-20 rounded no-animation text-white"
            onClick={() => setIsModalOpen(true)}
          >
            logout
          </button>
        </div>
      </MenuContainer>

      <ModalAlertLogout
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async () => await logout()}
      />
    </section>
  );
}
