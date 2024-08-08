"use client";

import MenuContainer, {
  MenuBreadCrumbs,
  MenuEditTitle,
} from "@/components/menu";
import { MdDelete, MdOutlinePostAdd } from "react-icons/md";
import { createRef, MouseEvent, useRef, useState } from "react";
import {
  ButtonSubmit,
  FailNotification,
  HoneypotInput,
  SearchTextInput,
  SuccessNotification,
  TextareaInput,
  TextInput,
} from "@/components/form";
import { ModalAlertAdd, ModalSearchUser } from "@/components/modal";
import { RiPencilFill } from "react-icons/ri";
import { IoImageOutline } from "react-icons/io5";
import { SubmitPengaduan } from "@/utils/server/pengaduan/pengaduan";
import Image from "next/image";

export default function Page() {
  const ref = createRef<HTMLFormElement>();

  const [notification, setNotification] = useState({ type: "", message: "" });
  const [ktpSearch, setKtpSearch] = useState({ ktp: "", nama: "" });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    const response = await SubmitPengaduan(formData);

    setNotification({ type: response.type, message: response.message });

    if (response.type == "success") {
      ref.current?.reset();
      setKtpSearch({ ktp: "", nama: "" });
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
        title={"Pengaduan Masyarakat"}
        linkArray={["Dashboard", "Menu Layanan", "Pengaduan Masyarakat"]}
        titleLinkArray={[
          "/admin/dashboard",
          "/admin/menu_layanan/pengaduan",
          "/admin/menu_layanan/pengaduan",
        ]}
        endTitle={"Tambah Pengaduan"}
      />

      <MenuContainer>
        <MenuEditTitle
          title="Tambah Pengaduan"
          titleIcon={<MdOutlinePostAdd />}
          linkButton="/admin/menu_layanan/pengaduan"
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
              inputName={"pengaduanKtp"}
              inputPlaceholder={"Cari Nama User"}
              defValue={ktpSearch.ktp}
              showValue={ktpSearch.nama}
              buttonPress={() => setIsSearchOpen(true)}
            />

            <TextInput
              labelText={"Judul"}
              inputName={"pengaduanJudul"}
              inputPlaceholder={"Input Judul"}
            />

            <TextInput
              labelText={"Alamat"}
              inputName={"pengaduanAlamat"}
              inputPlaceholder={"Input Alamat"}
            />

            <TextareaInput
              labelText={"Keterangan"}
              inputName={"pengaduanKeterangan"}
              inputPlaceholder={"Input Keterangan"}
            />

            <>
              <label className="text-xs font-medium text-gray-900">
                Bukti Foto
              </label>
              <div className="indicator">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  required
                  name={"pengaduanFoto"}
                  ref={fileInputRef}
                />

                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="indicator-item badge bg-blue-500 h-7 w-7 border-none text-white"
                >
                  <i>
                    <RiPencilFill />
                  </i>
                </button>

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

                {selectedImage ? (
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected Image"
                    className="w-64 h-40 shadow-lg"
                  />
                ) : (
                  <div className="w-64 h-40 shadow-lg bg-gray-100 text-gray-600 flex justify-center items-center flex-col">
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
