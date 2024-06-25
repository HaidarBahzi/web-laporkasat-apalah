"use client";

import {
  ButtonSubmit,
  DateInput,
  DropdownAddInput,
  FailNotification,
  HoneypotInput,
  LimitedTextInput,
  ModalAlertAdd,
  PasswordInput,
  RadioInput,
  SuccessNotification,
  TextInput,
} from "@/components/form";

import MenuContainer, {
  MenuBreadCrumbs,
  MenuEditTitle,
} from "@/components/menu";

import { FaUserPlus } from "react-icons/fa";

import { createRef, useEffect, useRef, useState } from "react";
import {
  FetchInputPegawai,
  SubmitPegawaiData,
} from "@/utils/server/pegawai/pegawai";
import { setup_kelamin, setup_role } from "@prisma/client";
import { RiPencilFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { IoImageOutline } from "react-icons/io5";
import Image from "next/image";

export default function Page() {
  const ref = createRef<HTMLFormElement>();

  const [notification, setNotification] = useState({ type: "", message: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [agama, setAgama] = useState<
    {
      agama_id: number;
      agama_nama: string;
    }[]
  >();

  const [statusPegawai, setStatusPegawai] = useState<
    {
      status_pegawai_id: number;
      status_pegawai_nama: string;
    }[]
  >();

  const [pendidikan, setPendidikan] = useState<
    {
      pendidikan_id: number;
      pendidikan_nama: string;
    }[]
  >();

  const [kawin, setKawin] = useState<
    {
      status_kawin_id: number;
      status_kawin_nama: string;
    }[]
  >();

  const [bidang, setBidang] = useState<
    {
      bidang_id: number;
      bidang_singkatan: string;
      bidang_nama: string;
    }[]
  >();

  const closeNotification = () => {
    setNotification({ type: "", message: "" });
  };

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

  const fetchAdditionalData = async () => {
    try {
      const dataInput = await FetchInputPegawai();

      setAgama(dataInput.agama);
      setStatusPegawai(dataInput.status);
      setPendidikan(dataInput.pendidikan);
      setKawin(dataInput.kawin);
      setBidang(dataInput.bidang);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAdditionalData();
  }, []);

  const handleSubmitClient = async (formData: FormData) => {
    const response = await SubmitPegawaiData(formData);

    setNotification({ type: response.type, message: response.message });

    if (response.type == "success") {
      ref.current?.reset();
      handleImageDelete();
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
    <section className="container mx-auto px-24">
      <ModalAlertAdd
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => handleFormSubmit()}
      />

      <MenuBreadCrumbs
        title={"Users"}
        linkArray={["Dashboard", "Menu User", "Pegawai"]}
        titleLinkArray={[
          "/admin/dashboard",
          "/admin/menu_user/pegawai",
          "/admin/menu_user/pegawai",
        ]}
        endTitle={"Tambah Pegawai"}
      />

      <MenuContainer>
        <MenuEditTitle
          title="Tambah Pegawai"
          titleIcon={<FaUserPlus />}
          linkButton="/admin/menu_user/pegawai"
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
              labelText={"NIK"}
              inputName={"pegawaiNik"}
              inputPlaceholder={"Input N I K"}
              maxLength={16}
              minLength={16}
            />

            <LimitedTextInput
              labelText={"NIP"}
              inputName={"pegawaiNip"}
              inputPlaceholder={"Input N I P"}
              maxLength={18}
              minLength={18}
            />

            <TextInput
              labelText={"Nama Lengkap"}
              inputName={"pegawaiNama"}
              inputPlaceholder={"Input Nama Lengkap"}
            />

            <TextInput
              labelText={"Alamat"}
              inputName={"pegawaiAlamat"}
              inputPlaceholder={"Input Alamat"}
            />

            <TextInput
              labelText={"Tempat Lahir"}
              inputName={"pegawaiTptLahir"}
              inputPlaceholder={"Input Tempat Lahir"}
            />

            <DateInput
              inputName={"pegawaiTglLahir"}
              labelText={"Tanggal Lahir"}
            />

            <RadioInput
              labelText={"Jenis Kelamin"}
              inputName={"pegawaiJk"}
              radioValue={[
                {
                  title: "Laki-laki",
                  value: setup_kelamin.L,
                },
                {
                  title: "Perempuan",
                  value: setup_kelamin.P,
                },
              ]}
            />

            <DropdownAddInput
              labelText={"Agama"}
              inputName={"pegawaiAgama"}
              optionTitle={"Pilih Agama"}
              optionValue={
                agama
                  ? agama.map((item) => ({
                      title: item.agama_nama,
                      value: item.agama_id,
                    }))
                  : []
              }
              defaultValue={""}
            />

            <LimitedTextInput
              labelText={"No. Handphone"}
              inputName={"pegawaiPhone"}
              inputPlaceholder={"Input No. Handphone"}
              maxLength={13}
              minLength={12}
            />

            <TextInput
              labelText={"Email"}
              inputName={"pegawaiEmail"}
              inputPlaceholder={"Input Email"}
              inputType={"email"}
            />

            <TextInput
              labelText={"Jabatan"}
              inputName={"pegawaiJabatan"}
              inputPlaceholder={"Input Jabatan"}
            />

            <DropdownAddInput
              labelText={"Status Pegawai"}
              inputName={"pegawaiStatus"}
              optionTitle={"Pilih Status Pegawai"}
              optionValue={
                statusPegawai
                  ? statusPegawai.map((item) => ({
                      title: item.status_pegawai_nama,
                      value: item.status_pegawai_id,
                    }))
                  : []
              }
              defaultValue={""}
            />

            <DropdownAddInput
              labelText={"Role Pegawai"}
              inputName={"pegawaiRole"}
              optionTitle={"Pilih Role Pegawai"}
              optionValue={[
                {
                  title: "Admin",
                  value: setup_role.A,
                },
                {
                  title: "Kasat",
                  value: setup_role.K,
                },
                {
                  title: "Bupati",
                  value: setup_role.B,
                },
                {
                  title: "Gakda",
                  value: setup_role.G,
                },
                {
                  title: "Lindam",
                  value: setup_role.L,
                },
                {
                  title: "Tibum",
                  value: setup_role.T,
                },
                {
                  title: "Sekretariat",
                  value: setup_role.S,
                },
                {
                  title: "Operator",
                  value: setup_role.O,
                },
              ]}
              defaultValue={""}
            />

            <DropdownAddInput
              labelText={"Pendidikan"}
              inputName={"pegawaiPendidikan"}
              optionTitle={"Pilih Pendidikan"}
              optionValue={
                pendidikan
                  ? pendidikan.map((item) => ({
                      title: item.pendidikan_nama,
                      value: item.pendidikan_id,
                    }))
                  : []
              }
              defaultValue={""}
            />

            <DropdownAddInput
              labelText={"Status Perkawinan"}
              inputName={"pegawaiStatusKawin"}
              optionTitle={"Pilih Status Perkawinan"}
              optionValue={
                kawin
                  ? kawin.map((item) => ({
                      title: item.status_kawin_nama,
                      value: item.status_kawin_id,
                    }))
                  : []
              }
              defaultValue={""}
            />

            <RadioInput
              labelText={"Kewarganegaraan"}
              inputName={"pegawaiKewarganegaraan"}
              radioValue={[
                { title: "WNI", value: "WNI" },
                { title: "WNA", value: "WNA" },
              ]}
            />

            <DropdownAddInput
              labelText={"Bidang"}
              inputName={"pegawaiBidang"}
              optionTitle={"Pilih Bidang"}
              optionValue={
                bidang
                  ? bidang.map((item) => ({
                      title: `${item.bidang_singkatan} | ${item.bidang_nama}`,
                      value: item.bidang_id,
                    }))
                  : []
              }
              defaultValue={""}
            />

            <PasswordInput
              containerRelative={"w-full"}
              width={"w-full"}
              placeholder={"Input Password"}
              inputName={"pegawaiPass"}
              labelText={"Password"}
              required={true}
            />

            <>
              <label className="text-xs font-thin text-gray-900">
                Pegawai Foto
              </label>
              <div className="indicator">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  required
                  name={"pegawaiFoto"}
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
                    className="w-40 h-40 shadow-lg"
                  />
                ) : (
                  <div className="w-40 h-40 shadow-lg bg-gray-100 text-gray-600 flex justify-center items-center flex-col">
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
