"use client";

import {
  ButtonSubmit,
  FailNotification,
  HoneypotInput,
  LimitedTextInput,
  ModalAlertAdd,
  PasswordInput,
  SuccessNotification,
  TextInput,
} from "@/components/form";

import MenuContainer, {
  MenuBreadCrumbs,
  MenuEditTitle,
} from "@/components/menu";

import { FaUserPlus } from "react-icons/fa";
import { createRef, useState } from "react";
import { SubmitUserData } from "@/utils/server/users/user";

export default function Page() {
  const ref = createRef<HTMLFormElement>();

  const [notification, setNotification] = useState({ type: "", message: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeNotification() {
    setNotification({ type: "", message: "" });
  }

  const handleSubmitClient = async (formData: FormData) => {
    const response = await SubmitUserData(formData);
    setNotification({ type: response.type, message: response.message });

    if (response.type === "success") {
      ref.current?.reset();
    }
  };

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
        linkArray={["Dashboard", "Menu User", "Users"]}
        titleLinkArray={[
          "/admin/dashboard",
          "/admin/menu_user/users",
          "/admin/menu_user/users",
        ]}
        endTitle={"Tambah User"}
      />

      <MenuContainer>
        <MenuEditTitle
          title="Tambah User"
          titleIcon={<FaUserPlus />}
          linkButton="/admin/menu_user/users"
        />

        <hr />

        {notification.type &&
          (notification.type === "success" ? (
            <SuccessNotification
              title={notification.message}
              buttonFunction={closeNotification}
            />
          ) : (
            <FailNotification
              title={notification.message}
              buttonFunction={closeNotification}
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
              labelText={"KTP"}
              inputName={"userKtp"}
              inputPlaceholder={"Input KTP"}
              maxLength={16}
              minLength={16}
            />

            <TextInput
              labelText={"Nama Lengkap"}
              inputName={"userNama"}
              inputPlaceholder={"Input Nama Lengkap"}
            />

            <TextInput
              labelText={"Alamat"}
              inputName={"userAlamat"}
              inputPlaceholder={"Input Alamat"}
            />

            <LimitedTextInput
              inputType={"tel"}
              labelText={"No. Handphone"}
              inputName={"userPhone"}
              inputPlaceholder={"Input No. Handphone"}
              maxLength={13}
              minLength={12}
            />

            <PasswordInput
              containerRelative={"w-full"}
              width={"w-full"}
              placeholder={"Input Password"}
              inputName={"userPassword"}
              labelText={"Password"}
              required={true}
            />

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
