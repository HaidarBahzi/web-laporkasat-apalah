"use client";

import MenuContainer, {
  MenuBreadCrumbs,
  MenuEditTitle,
} from "@/components/menu";
import { FaRegImage } from "react-icons/fa";
import { createRef, useCallback, useEffect, useRef, useState } from "react";
import {
  ButtonSubmit,
  DropdownEditInput,
  FailNotification,
  HoneypotInput,
  SuccessNotification,
  TextInput,
} from "@/components/form";
import { RiPencilFill } from "react-icons/ri";
import { asset_status } from "@prisma/client";
import { MdDelete } from "react-icons/md";
import { EditAsset, GetDetailAssets } from "@/utils/server/master/assets";
import Image from "next/image";
import { ModalAlertEdit } from "@/components/modal";

export default function Page({ params }: { params: { id: string } }) {
  const ref = createRef<HTMLFormElement>();

  const [notification, setNotification] = useState({ type: "", message: "" });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formValue, setFormValue] = useState({
    asset_photo: "",
    asset_title: "",
    asset_type: "",
    asset_url: "",
  });

  function closeNotification() {
    setNotification({ type: "", message: "" });
  }

  const fetchAdditionalData = useCallback(async () => {
    try {
      const fetch = await GetDetailAssets(Number(params.id));

      setFormValue({
        asset_photo: fetch!.asset_photo,
        asset_title: fetch!.asset_title,
        asset_type: fetch!.asset_type,
        asset_url: fetch!.asset_url!,
      });
    } catch (e) {
      console.error(e);
    }
  }, [params.id]);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleImageDelete = () => {
    setSelectedImage(null);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  async function handleSubmitClient(formData: FormData) {
    const response = await EditAsset(
      formData,
      formValue.asset_photo,
      Number(params.id)
    );

    setNotification({ type: response.type, message: response.message });

    if (response.type == "success") {
      ref.current?.reset();
      handleImageDelete();

      await fetchAdditionalData();
    }
  }

  const handleFormEdit = async () => {
    if (ref.current) {
      const formData = new FormData(ref.current);
      await handleSubmitClient(formData);
      setIsModalOpen(false);
    }
  };

  const handleDropdownChange = (selectedValue: any, inputName: string) => {
    setFormValue((prevFormValues) => ({
      ...prevFormValues,
      [inputName]: selectedValue,
    }));
  };

  const optionType: any = {
    C: asset_status.C,
    I: asset_status.I,
  };

  useEffect(() => {
    fetchAdditionalData();
  }, [params.id, fetchAdditionalData]);

  return (
    <section className="container mx-auto px-16">
      <ModalAlertEdit
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => handleFormEdit()}
      />

      <MenuBreadCrumbs
        title={"Users"}
        linkArray={["Dashboard", "Master", "Aset Mobile"]}
        titleLinkArray={[
          "/admin/dashboard",
          "/admin/master/assets",
          "/admin/master/assets",
        ]}
        endTitle={"Edit Aset"}
      />

      <MenuContainer>
        <MenuEditTitle
          title={"Edit Aset"}
          titleIcon={<FaRegImage />}
          linkButton={"/admin/master/assets"}
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
            <TextInput
              labelText={"Nama Aset"}
              inputName={"asetName"}
              inputPlaceholder={"Input Nama Aset"}
              defValue={formValue.asset_title}
            />

            <DropdownEditInput
              labelText={"Jenis Aset"}
              inputName={"asetType"}
              optionTitle={"Pilih Aset"}
              defaultValue={optionType[formValue.asset_type]}
              handleChange={(selectedValue) =>
                handleDropdownChange(selectedValue, "asset_type")
              }
              optionValue={[
                {
                  title: "Carausel",
                  value: asset_status.C,
                },
                {
                  title: "Stats Icon",
                  value: asset_status.S,
                },
                {
                  title: "Icon",
                  value: asset_status.I,
                },
              ]}
            />

            <TextInput
              labelText={"Url Aset"}
              inputName={"asetUrl"}
              inputPlaceholder={"Input Url Aset"}
              defValue={formValue.asset_url}
            />

            <>
              <label className="text-xs font-normal text-gray-900">
                Foto Aset
              </label>
              <div className="indicator">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  name={"asetPhoto"}
                  ref={fileInputRef}
                />
                <button
                  type="button"
                  onClick={handleImageDelete}
                  className={`indicator-bottom indicator-item badge bg-red-500 border-none h-7 w-7 text-white ${
                    selectedImage ? "flex" : "hidden"
                  }`}
                >
                  <i>
                    <MdDelete />
                  </i>
                </button>

                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="indicator-item badge bg-blue-500 h-7 w-7 border-none text-white"
                >
                  <i>
                    <RiPencilFill />
                  </i>
                </button>

                {selectedImage ? (
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected Image"
                    className="grid w-52 h-32 bg-gray-100 place-items-center rounded shadow-lg"
                  />
                ) : (
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    src={`${window.location.origin}/foto-aset/${formValue.asset_photo}`}
                    className="w-52 h-32 shadow-lg"
                    alt={"Current Image"}
                  />
                )}
              </div>
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
