"use client";

import MenuContainer, {
  MenuBreadCrumbs,
  MenuEditTitle,
} from "@/components/menu";
import { RiImageAddLine, RiPencilFill } from "react-icons/ri";
import {
  ButtonSubmit,
  DropdownAddInput,
  FailNotification,
  HoneypotInput,
  ModalAlertAdd,
  RadioInput,
  SuccessNotification,
  TextInput,
} from "@/components/form";

import { createRef, useRef, useState } from "react";
import { asset_status } from "@prisma/client";
import { MdDelete } from "react-icons/md";
import { IoImageOutline } from "react-icons/io5";
import { SubmitAsset } from "@/utils/server/master/assets";
import Image from "next/image";

export default function Page() {
  const ref = createRef<HTMLFormElement>();

  const [notification, setNotification] = useState({ type: "", message: "" });

  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeNotification() {
    setNotification({ type: "", message: "" });
  }

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
    const response = await SubmitAsset(formData);

    setNotification({ type: response.type, message: response.message });

    if (response.type == "success") {
      ref.current?.reset();
      handleImageDelete();
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
    <section className="container mx-auto px-24">
      <ModalAlertAdd
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => handleFormSubmit()}
      />

      <MenuBreadCrumbs
        title={"Users"}
        linkArray={["Dashboard", "Master", "Aset Mobile"]}
        titleLinkArray={[
          "/admin/dashboard",
          "/admin/master/assets",
          "/admin/master/assets",
        ]}
        endTitle={"Tambah Aset"}
      />

      <MenuContainer>
        <MenuEditTitle
          title={"Tambah Aset"}
          titleIcon={<RiImageAddLine />}
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
            />

            <TextInput
              labelText={"Url Aset"}
              inputName={"asetUrl"}
              inputPlaceholder={"Input Url Aset"}
            />

            <DropdownAddInput
              labelText={"Jenis Aset"}
              inputName={"asetType"}
              optionTitle={"Pilih Jenis Aset"}
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
              defaultValue={""}
            />

            <>
              <label className="text-xs font-thin text-gray-900">
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
                    className="w-52 h-32 bg-gray-100 place-items-center rounded shadow-lg"
                  />
                ) : (
                  <div className="w-52 h-32 bg-gray-100 place-items-center shadow-lg text-gray-600 justify-center items-center rounded flex flex-col">
                    <i className="text-2xl">
                      <IoImageOutline />
                    </i>
                    No Image
                  </div>
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
