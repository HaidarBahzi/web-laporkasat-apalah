"use client";

import MenuContainer, {
  MenuBreadCrumbs,
  MenuEditTitle,
} from "@/components/menu";
import { MdOutlinePostAdd } from "react-icons/md";
import {
  ButtonSubmit,
  FailNotification,
  HoneypotInput,
  LimitedTextInput,
  SearchTextInput,
  SuccessNotification,
  TextareaInput,
  TextInput,
} from "@/components/form";
import { ModalAlertAdd, ModalSearchUser } from "@/components/modal";
import { createRef, useState } from "react";
import { SubmitPermohonanBantuan } from "@/utils/server/permohonan_bantuan/permohonan_bantuan";

export default function Page() {
  const ref = createRef<HTMLFormElement>();

  const [ktpSearch, setKtpSearch] = useState({ ktp: "", nama: "" });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [notification, setNotification] = useState({ type: "", message: "" });

  function closeNotification() {
    setNotification({ type: "", message: "" });
  }

  async function handleSubmitClient(formData: FormData) {
    const response = await SubmitPermohonanBantuan(formData);

    setNotification({ type: response.type, message: response.message });

    if (response.type == "success") {
      ref.current?.reset();
      setKtpSearch({ ktp: "", nama: "" });
    }
  }

  const handleFormSubmit = async () => {
    if (ref.current) {
      const formData = new FormData(ref.current);
      await handleSubmitClient(formData);
      setIsModalOpen(false);
    }
  };

  return (
    <section className="container mx-auto px-16">
      <ModalAlertAdd
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => handleFormSubmit()}
      />

      <ModalSearchUser
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSubmit={(userKtp: string, userName: string) => {
          setIsSearchOpen(false);
          setKtpSearch({ ktp: userKtp, nama: userName });
        }}
      />

      <MenuBreadCrumbs
        title={"Permohonan Bantuan"}
        linkArray={["Dashboard", "Menu Layanan", "Permohonan Bantuan"]}
        titleLinkArray={[
          "/admin/dashboard",
          "/admin/menu_layanan/permohonan_bantuan",
          "/admin/menu_layanan/permohonan_bantuan",
        ]}
        endTitle={"Tambah Data Permohonan"}
      />

      <MenuContainer>
        <MenuEditTitle
          title="Tambah Data Permohonan"
          titleIcon={<MdOutlinePostAdd />}
          linkButton="/admin/menu_layanan/permohonan_bantuan"
        />

        <hr />

        {notification.type &&
          (notification.type == "success" ? (
            <SuccessNotification
              title={notification.message}
              buttonFunction={() => closeNotification()}
            />
          ) : (
            <FailNotification
              title={notification.message}
              buttonFunction={() => closeNotification()}
            />
          ))}

        <form
          ref={ref}
          onSubmit={(e) => {
            e.preventDefault();
            setIsModalOpen(true);
          }}
          autoComplete="off"
          className="form-control gap-8 px-8"
        >
          <div className="grid grid-cols-6 gap-x-12 gap-y-4 items-center">
            <SearchTextInput
              labelText={"Nama"}
              inputName={"permohonanKtp"}
              inputPlaceholder={"Input KTP"}
              defValue={ktpSearch.ktp}
              showValue={ktpSearch.nama}
              buttonPress={() => setIsSearchOpen(true)}
            />

            <TextInput
              labelText={"Judul"}
              inputName={"permohonanJudul"}
              inputPlaceholder={"Input Judul"}
            />

            <TextInput
              labelText={"Alamat"}
              inputName={"permohonanAlamat"}
              inputPlaceholder={"Input Alamat"}
            />

            <TextareaInput
              labelText={"Keterangan"}
              inputName={"permohonanKeterangan"}
              inputPlaceholder={"Input Keterangan"}
            />

            <>
              <label className="text-xs w-fit font-normal text-gray-900">
                Surat Permohonan
              </label>

              <input
                type="file"
                accept="application/pdf"
                name="permohonanDocument"
                className="bg-gray-100 w-full col-span-2 text-gray-900 text-xs rounded focus:bg-gray-200 p-2.5"
              />
            </>

            <HoneypotInput />
          </div>

          <hr />

          <div className="flex justify-center">
            <ButtonSubmit />
          </div>
        </form>
      </MenuContainer>
    </section>
  );
}
