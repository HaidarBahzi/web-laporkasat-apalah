"use client";

import MenuContainer, {
  MenuBreadCrumbs,
  MenuEditTitle,
} from "@/components/menu";
import { FaUserEdit } from "react-icons/fa";

import {
  ButtonSubmit,
  FailNotification,
  HoneypotInput,
  LimitedTextInput,
  PasswordInput,
  SuccessNotification,
  TextInput,
} from "@/components/form";

import { createRef, useCallback, useEffect, useState } from "react";
import { GetDetailUser, SubmitUserEdit } from "@/utils/server/users/user";
import { ModalAlertEdit } from "@/components/modal";

export default function Page({ params }: { params: { id: string } }) {
  const ref = createRef<HTMLFormElement>();

  const [formValues, setFormValues] = useState({
    user_ktp: "",
    user_fullname: "",
    user_alamat: "",
    user_phone: "",
    user_password: "",
  });

  const [notification, setNotification] = useState({ type: "", message: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeNotification() {
    setNotification({ type: "", message: "" });
  }

  const fetchFormValue = useCallback(async () => {
    try {
      const fetch = await GetDetailUser(params.id);
      setFormValues(fetch!);
    } catch (err) {
      console.error(err);
    }
  }, [params.id]);

  async function handleSubmitClient(formData: FormData) {
    const response = await SubmitUserEdit(
      formData,
      params.id,
      formValues.user_password
    );

    setNotification({ type: response.type, message: response.message });

    await fetchFormValue();
  }

  const handleFormEdit = async () => {
    if (ref.current) {
      const formData = new FormData(ref.current);
      await handleSubmitClient(formData);
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    fetchFormValue();
  }, [params.id, fetchFormValue]);

  return (
    <section className="container mx-auto px-16">
      <ModalAlertEdit
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => handleFormEdit()}
      />

      <MenuBreadCrumbs
        title={"Users"}
        linkArray={["Dashboard", "Menu User", "Users"]}
        titleLinkArray={[
          "/admin/dashboard",
          "/admin/menu_user/users",
          "/admin/menu_user/users",
        ]}
        endTitle={"Edit User"}
      />

      <MenuContainer>
        <MenuEditTitle
          title="Edit User"
          titleIcon={<FaUserEdit />}
          linkButton="/admin/menu_user/users"
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
          className="form-control gap-8"
        >
          <div className="grid grid-cols-6 gap-4">
            <LimitedTextInput
              labelText={"KTP"}
              inputName={"userKtp"}
              inputPlaceholder={"Input KTP"}
              maxLength={16}
              minLength={16}
              defValue={formValues.user_ktp}
            />

            <TextInput
              labelText={"Nama Lengkap"}
              inputName={"userNama"}
              inputPlaceholder={"Input Nama Lengkap"}
              defValue={formValues.user_fullname}
            />

            <TextInput
              labelText={"Alamat"}
              inputName={"userAlamat"}
              inputPlaceholder={"Input Alamat"}
              defValue={formValues.user_alamat}
            />

            <LimitedTextInput
              inputType={"tel"}
              labelText={"No. Handphone"}
              inputName={"userPhone"}
              inputPlaceholder={"Input No. Handphone"}
              maxLength={13}
              minLength={12}
              defValue={formValues.user_phone}
            />

            <PasswordInput
              containerRelative={"w-full"}
              width={"w-full"}
              placeholder={"Input Password"}
              inputName={"userPassword"}
              labelText={"Password"}
              required={false}
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
