"use client";

import MenuContainer, {
  MenuBreadCrumbs,
  MenuEditTitle,
} from "@/components/menu";
import {
  ButtonSubmit,
  DateInput,
  FailNotification,
  HoneypotInput,
  LimitedTextInput,
  SuccessNotification,
} from "@/components/form";

import { createRef, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { AddPenyidik } from "@/utils/server/penyidik/penyidik";
import { ModalAlertAdd } from "@/components/modal";

export default function Page() {
  const ref = createRef<HTMLFormElement>();

  const [notification, setNotification] = useState({ type: "", message: "" });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [jabatan, setJabatan] = useState({ jabatan: "" });

  function closeNotification() {
    setNotification({ type: "", message: "" });
  }

  async function handleSubmitClient(formData: FormData) {
    const response = await AddPenyidik(formData);

    setNotification({ type: response.type, message: response.message });

    if (response.type == "success") {
      ref.current?.reset();
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

      <MenuBreadCrumbs
        title={"Users"}
        linkArray={["Dashboard", "Menu User", "Penyidik"]}
        titleLinkArray={[
          "/admin/dashboard",
          "/admin/menu_user/penyidik",
          "/admin/menu_user/penyidik",
        ]}
        endTitle={"Tambah Penyidik"}
      />

      <MenuContainer>
        <MenuEditTitle
          title={"Tambah Penyidik"}
          titleIcon={<FaUserPlus />}
          linkButton={"/admin/menu_user/penyidik"}
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
            <LimitedTextInput
              labelText={"Nip Pegawai"}
              inputName={"penyidikNip"}
              inputPlaceholder={"Cari Nip Pegawai"}
              maxLength={18}
              minLength={18}
            />

            <LimitedTextInput
              labelText={"Nomor SK"}
              inputName={"penyidikSk"}
              inputPlaceholder={"Input Nomor SK"}
              maxLength={25}
              minLength={25}
            />

            <DateInput labelText={"Tanggal SK"} inputName={"penyidikTglSk"} />

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
