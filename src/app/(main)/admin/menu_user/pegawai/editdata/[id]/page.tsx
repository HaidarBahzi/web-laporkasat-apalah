"use client";

import MenuContainer, {
  MenuBreadCrumbs,
  MenuEditTitle,
} from "@/components/menu";
import { FaUserEdit } from "react-icons/fa";
import {
  ButtonSubmit,
  DateInput,
  DropdownEditInput,
  FailNotification,
  HoneypotInput,
  LimitedTextInput,
  PasswordInput,
  SuccessNotification,
  TextInput,
} from "@/components/form";
import { setup_kelamin, setup_role } from "@prisma/client";
import { createRef, useCallback, useEffect, useRef, useState } from "react";
import {
  FetchInputPegawai,
  GetDetailPegawai,
  SubmitEditPegawai,
} from "@/utils/server/pegawai/pegawai";
import { RiPencilFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { inputRoleType, inputJkType } from "@/components/options";
import Image from "next/image";
import { updateSession } from "@/utils/lib/session";
import { useRouter } from "next/navigation";
import { ModalAlertEdit } from "@/components/modal";

export default function Page({ params }: { params: { id: string } }) {
  const ref = createRef<HTMLFormElement>();

  const [notification, setNotification] = useState({ type: "", message: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeNotification = () => {
    setNotification({ type: "", message: "" });
  };

  const [formValues, setFormValues] = useState({
    pegawai_nip: "",
    pegawai_nik: "",
    pegawai_password: "",
    pegawai_nama: "",
    pegawai_jk: "",
    pegawai_tempat_lahir: "",
    pegawai_tanggal_lahir: "",
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

  const dateObj = new Date(formValues.pegawai_tanggal_lahir);

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

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

  const router = useRouter();

  const handleSubmitClient = async (formData: FormData) => {
    const response = await SubmitEditPegawai(
      formData,
      params.id,
      formValues.pegawai_password,
      formValues.pegawai_foto
    );

    setNotification({ type: response.type, message: response.message });

    if (response.type == "success") {
      router.refresh();
      handleImageDelete();
    }
  };

  const handleFormEdit = async () => {
    if (ref.current) {
      const formData = new FormData(ref.current);
      await handleSubmitClient(formData);
      setIsModalOpen(false);
    }
  };

  const handleDropdownChange = (selectedValue: any, inputName: string) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [inputName]: selectedValue,
    }));
  };

  const fetchAdditionalData = useCallback(async () => {
    await updateSession();

    try {
      const dataInput = await FetchInputPegawai();

      setAgama(dataInput.agama);
      setStatusPegawai(dataInput.status);
      setPendidikan(dataInput.pendidikan);
      setKawin(dataInput.kawin);
      setBidang(dataInput.bidang);

      const dataInputPegawai = await GetDetailPegawai(params.id);

      const formattedDate = dataInputPegawai
        ? dataInputPegawai.pegawai_tanggal_lahir.toISOString()
        : "";

      const initialFormValues = {
        pegawai_nip: dataInputPegawai?.pegawai_nip || "",
        pegawai_nik: dataInputPegawai?.pegawai_nik || "",
        pegawai_password: dataInputPegawai?.pegawai_password || "",
        pegawai_nama: dataInputPegawai?.pegawai_nama || "",
        pegawai_jk: dataInputPegawai?.pegawai_jk || "",
        pegawai_tempat_lahir: dataInputPegawai?.pegawai_tempat_lahir || "",
        pegawai_tanggal_lahir: formattedDate,
        pegawai_phone: dataInputPegawai?.pegawai_phone || "",
        pegawai_email: dataInputPegawai?.pegawai_email || "",
        pegawai_alamat: dataInputPegawai?.pegawai_alamat || "",
        pegawai_foto: dataInputPegawai?.pegawai_foto || "",
        pegawai_jabatan: dataInputPegawai?.pegawai_jabatan || "",
        agama_id: dataInputPegawai?.agama_id || 0,
        pendidikan_id: dataInputPegawai?.pendidikan_id || 0,
        status_pegawai_id: dataInputPegawai?.status_pegawai_id || 0,
        status_kawin_id: dataInputPegawai?.status_kawin_id || 0,
        pegawai_kewarganegaraan:
          dataInputPegawai?.pegawai_kewarganegaraan || "",
        pegawai_status: dataInputPegawai?.pegawai_status || "",
        pegawai_role: dataInputPegawai?.pegawai_role || "",
        bidang_id: dataInputPegawai?.bidang_id || 0,
      };

      setFormValues(initialFormValues);
    } catch (e) {
      console.error(e);
    }
  }, [params.id]);

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
        linkArray={["Dashboard", "Menu User", "Pegawai"]}
        titleLinkArray={[
          "/admin/dashboard",
          "/admin/menu_user/pegawai",
          "/admin/menu_user/pegawai",
        ]}
        endTitle={"Edit Pegawai"}
      />

      <MenuContainer>
        <MenuEditTitle
          title="Edit Pegawai"
          titleIcon={<FaUserEdit />}
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
              defValue={formValues.pegawai_nik}
            />

            <LimitedTextInput
              labelText={"NIP"}
              inputName={"pegawaiNip"}
              inputPlaceholder={"Input N I P"}
              maxLength={18}
              minLength={18}
              defValue={formValues.pegawai_nip}
            />

            <TextInput
              labelText={"Nama Lengkap"}
              inputName={"pegawaiNama"}
              inputPlaceholder={"Input Nama Lengkap"}
              defValue={formValues.pegawai_nama}
            />

            <TextInput
              labelText={"Alamat"}
              inputName={"pegawaiAlamat"}
              inputPlaceholder={"Input Alamat"}
              defValue={formValues.pegawai_alamat}
            />

            <TextInput
              labelText={"Tempat Lahir"}
              inputName={"pegawaiTptLahir"}
              inputPlaceholder={"Input Tempat Lahir"}
              defValue={formValues.pegawai_tempat_lahir}
            />

            <DateInput
              inputName={"pegawaiTglLahir"}
              labelText={"Tanggal Lahir"}
              defValue={formattedDate}
              handleChange={(selectedValue) =>
                handleDropdownChange(selectedValue, "pegawai_tanggal_lahir")
              }
            />

            <DropdownEditInput
              labelText={"Jenis Kelamin"}
              inputName={"pegawaiJk"}
              optionTitle={"Pilih Jenis Kelamin"}
              optionValue={[
                {
                  title: "Laki-laki",
                  value: setup_kelamin.L,
                },
                {
                  title: "Perempuan",
                  value: setup_kelamin.P,
                },
              ]}
              defaultValue={inputJkType[formValues.pegawai_jk]}
              handleChange={(selectedValue) =>
                handleDropdownChange(selectedValue, "pegawai_jk")
              }
            />

            <DropdownEditInput
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
              defaultValue={formValues.agama_id}
              handleChange={(selectedValue) =>
                handleDropdownChange(selectedValue, "agama_id")
              }
            />

            <LimitedTextInput
              labelText={"No. Handphone"}
              inputName={"pegawaiPhone"}
              inputPlaceholder={"Input No. Handphone"}
              maxLength={13}
              minLength={12}
              defValue={formValues.pegawai_phone}
            />

            <TextInput
              labelText={"Email"}
              inputName={"pegawaiEmail"}
              inputPlaceholder={"Input Email"}
              inputType={"email"}
              defValue={formValues.pegawai_email}
            />

            <TextInput
              labelText={"Jabatan"}
              inputName={"pegawaiJabatan"}
              inputPlaceholder={"Input Jabatan"}
              defValue={formValues.pegawai_jabatan}
            />

            <DropdownEditInput
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
              defaultValue={formValues.status_pegawai_id}
              handleChange={(selectedValue) =>
                handleDropdownChange(selectedValue, "status_pegawai_id")
              }
            />

            <DropdownEditInput
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
                  title: "User",
                  value: setup_role.U,
                },
                {
                  title: "Operator",
                  value: setup_role.O,
                },
              ]}
              defaultValue={inputRoleType[formValues.pegawai_role]}
              handleChange={(selectedValue) =>
                handleDropdownChange(selectedValue, "pegawai_role")
              }
            />

            <DropdownEditInput
              labelText={"Pendidikan"}
              inputName={"pegawaiPendidikan"}
              optionTitle={"Pilih Pendidikan"}
              defaultValue={formValues.pendidikan_id}
              optionValue={
                pendidikan
                  ? pendidikan.map((item) => ({
                      title: item.pendidikan_nama,
                      value: item.pendidikan_id,
                    }))
                  : []
              }
              handleChange={(selectedValue) =>
                handleDropdownChange(selectedValue, "pendidikan_id")
              }
            />

            <DropdownEditInput
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
              defaultValue={formValues.status_kawin_id}
              handleChange={(selectedValue) =>
                handleDropdownChange(selectedValue, "status_kawin_id")
              }
            />

            <DropdownEditInput
              labelText={"Kewarganegaraan"}
              inputName={"pegawaiKewarganegaraan"}
              optionTitle={"Pilih Pegawai Kewarganegaraan"}
              optionValue={[
                { title: "WNI", value: "WNI" },
                { title: "WNA", value: "WNA" },
              ]}
              defaultValue={String(formValues.pegawai_kewarganegaraan)}
              handleChange={(selectedValue) =>
                handleDropdownChange(selectedValue, "pegawai_kewarganegaraan")
              }
            />

            <DropdownEditInput
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
              defaultValue={formValues.bidang_id}
              handleChange={(selectedValue) =>
                handleDropdownChange(selectedValue, "bidang_id")
              }
            />

            <PasswordInput
              containerRelative={"w-full"}
              width={"w-full"}
              placeholder={"Input Password"}
              inputName={"pegawaiPass"}
              labelText={"Password"}
              required={false}
            />

            <>
              <label className="text-xs font-normal text-gray-900">
                Pegawai Foto
              </label>
              <div className="indicator">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
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
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    src={`http://103.30.180.221/web-laporkasat-apalah/assets/foto-pegawai/${formValues.pegawai_foto}`}
                    className="w-40 h-40 shadow-lg"
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
