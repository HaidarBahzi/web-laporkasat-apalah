"use client";

import MenuContainer, {
  MenuBreadCrumbs,
  MenuEditTitle,
} from "@/components/menu";
import { CiViewList } from "react-icons/ci";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { GetDetailPengaduan } from "@/utils/server/pengaduan/pengaduan";
import {
  ImageShow,
  TextareaInput,
  TextInput,
  WizardDateInput,
  WizardDropdownInput,
  WizardLimitedTextInput,
  WizardTextAreaInput,
  WizardTextInput,
} from "@/components/form";
import { Wizard } from "react-use-wizard";
import { StepLayout } from "@/components/wizard";
import { setup_kelamin, tindak_lanjut_status } from "@prisma/client";
import { FetchInputPegawai } from "@/utils/server/pegawai/pegawai";
import { GetAllPenyidik } from "@/utils/server/penyidik/penyidik";
import { FaFileUpload } from "react-icons/fa";
import { SubmitPelanggaran } from "@/utils/server/pelanggaran/pelanggaran";
import { useRouter } from "next/navigation";
import { PelanggaranTindakForm } from "@/components/options";
import { ModalAlertTindak } from "@/components/modal";
import { getDataSession } from "@/utils/lib/session";
import { IoImageOutline } from "react-icons/io5";

export default function Page({ params }: { params: { id: string } }) {
  const [pelaporValues, setPelaporValues] = useState({
    user_mail: "",
    user_fullname: "",
    user_alamat: "",
    user_phone: "",
  });

  const [pengaduanValues, setPengaduanValues] = useState({
    laporan_title: "",
    laporan_location: "",
    laporan_description: "",
    laporan_document: "",
    laporan_status: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formDataWizard, setFormDataWizard] = useState<PelanggaranTindakForm>({
    pelanggar: {
      nama: "",
      ayah: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      pelanggarJk: "",
      agama: -1,
      pendidikan: -1,
      kewarganegaraan: "",
      status_kawin: -1,
      phone: "",
      alamat: "",
    },
    saksi1: {
      nama: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      jenis_kelamin: "",
      agama: -1,
      pendidikan: -1,
      kewarganegaraan: "",
      status_kawin: -1,
      phone: "",
      alamat: "",
    },
    saksi2: {
      nama: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      jenis_kelamin: "",
      agama: -1,
      pendidikan: -1,
      kewarganegaraan: "",
      status_kawin: -1,
      phone: "",
      alamat: "",
    },
    tindakan: {
      penyidik: "",
      tindak: "",
      pelaksanaan: "",
    },
    bukti: {
      bukti_kejadian: "",
      bukti_barang: "",
      bukti_penyegelan: "",
      dokumen_ktp: "",
      dokumen_sp: "",
      dokumen_sp1: "",
      dokumen_sp2: "",
      dokumen_sp3: "",
      dokumen_lk: "",
      dokumen_spp: "",
      dokumen_bap: "",
      dokumen_p3bb: "",
      dokumen_psk: "",
      dokumen_bapc: "",
      dokumen_pst: "",
    },
  });

  const convertFileToBuffer = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  };

  const handleInputChange = (
    section: keyof PelanggaranTindakForm,
    name: string,
    value: any
  ) => {
    setFormDataWizard((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    }));
  };

  const handleInputFileChange = async (
    section: keyof PelanggaranTindakForm,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = event.target.name;
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      const value = await convertFileToBuffer(file);

      setFormDataWizard((prevData) => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          [name]: value,
        },
      }));
    }
  };

  const [formValues, setFormValues] = useState({
    input_action: "",
  });

  const handleDropdownChange = (selectedValue: any, inputName: string) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [inputName]: selectedValue,
    }));
  };

  const [agama, setAgama] = useState<
    {
      agama_id: number;
      agama_nama: string;
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

  const [penyidik, setPenyidik] = useState<
    {
      pegawai_nama: string | null;
      pegawai_jabatan: string | null;
      penyidik_id: string;
      pegawai_nip: string;
      penyidik_sk: string;
      penyidik_tgl_sk: Date;
    }[]
  >();

  const fetchFormValue = useCallback(async () => {
    try {
      const fetch = await GetDetailPengaduan(params.id);

      setPelaporValues(fetch.pelapor!);
      setPengaduanValues(fetch.pengaduan!);

      const dataInput = await FetchInputPegawai();

      setAgama(dataInput.agama);
      setPendidikan(dataInput.pendidikan);
      setKawin(dataInput.kawin);

      const dataPenyidik = await GetAllPenyidik();

      setPenyidik(dataPenyidik!);
    } catch (err) {
      console.error(err);
    }
  }, [params.id]);

  useEffect(() => {
    fetchFormValue();
  }, [params.id, fetchFormValue]);

  const router = useRouter();

  async function handleSubmitClient() {
    setIsModalOpen(false);

    const response = await SubmitPelanggaran(
      formDataWizard,
      pelaporValues.user_mail,
      (
        await getDataSession()
      ).idUser!,
      formValues.input_action,
      params.id
    );

    if (response.type == "success") {
      router.push("/user/menu_layanan/pengaduan");
    }
  }

  return (
    <section className="container mx-auto px-16">
      <ModalAlertTindak
        inputName={"inputAction"}
        optionTitle={"Silahkan Pilih Jenis Tindakan"}
        optionValue={[
          { title: "Non Justitia", value: tindak_lanjut_status.NJ },
          { title: "Pro Justitia", value: tindak_lanjut_status.PJ },
        ]}
        handleChange={(selectedValue) =>
          handleDropdownChange(selectedValue, "input_action")
        }
        defaultValue={""}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => handleSubmitClient()}
      />

      <MenuBreadCrumbs
        title={"Pengaduan Masyarakat"}
        linkArray={["Dashboard", "Menu Layanan", "Pengaduan Masyarakat"]}
        titleLinkArray={[
          "/user/dashboard",
          "/user/menu_layanan/pengaduan",
          "/user/menu_layanan/pengaduan",
        ]}
        endTitle={"Detail Pengaduan Masyarakat"}
      />

      <MenuContainer>
        <MenuEditTitle
          title="Detail Pengaduan Masyarakat"
          titleIcon={<CiViewList />}
          linkButton="/user/menu_layanan/pengaduan"
        />

        <hr />

        <Wizard>
          <StepLayout stepIndex={0} currentStep={0}>
            <div className="form-control gap-5">
              <span className="text-lg font-semibold">Data Pelapor</span>
              <div className="grid grid-cols-3 gap-5">
                <TextInput
                  labelText={"Email Pelapor"}
                  inputName={""}
                  readOnly={true}
                  inputPlaceholder={""}
                  defValue={pelaporValues.user_mail}
                />

                <TextInput
                  labelText={"Nama Pelapor"}
                  inputName={""}
                  readOnly={true}
                  inputPlaceholder={""}
                  defValue={pelaporValues.user_fullname}
                />

                <TextInput
                  labelText={"Alamat Pelapor"}
                  inputName={""}
                  readOnly={true}
                  inputPlaceholder={""}
                  defValue={pelaporValues.user_alamat}
                />

                <TextInput
                  labelText={"No. HP Pelapor"}
                  inputName={""}
                  readOnly={true}
                  inputPlaceholder={""}
                  defValue={pelaporValues.user_phone}
                />
              </div>
            </div>
          </StepLayout>

          <StepLayout stepIndex={1} currentStep={1}>
            <div className="form-control gap-5">
              <span className="text-lg font-semibold">Data Kejadian</span>
              <div className="grid grid-cols-3 gap-5">
                <TextInput
                  labelText={"Judul"}
                  inputName={""}
                  readOnly={true}
                  inputPlaceholder={""}
                  defValue={pengaduanValues.laporan_title}
                />

                <TextInput
                  labelText={"Lokasi"}
                  inputName={""}
                  readOnly={true}
                  inputPlaceholder={""}
                  defValue={pengaduanValues.laporan_location}
                />

                <TextareaInput
                  labelText={"Keterangan"}
                  inputName={""}
                  readOnly={true}
                  inputPlaceholder={""}
                  defValue={pengaduanValues.laporan_description}
                />

                <ImageShow
                  labelText={"Bukti Foto"}
                  imageSrc={pengaduanValues.laporan_document}
                />
              </div>
            </div>
          </StepLayout>

          <StepLayout stepIndex={2} currentStep={2}>
            <div className="form-control gap-5">
              <span className="text-lg font-semibold">Data Pelanggar</span>
              <div className="grid grid-cols-3 gap-5">
                <WizardTextInput
                  labelText={"Nama Lengkap"}
                  inputName={"nama"}
                  defValue={formDataWizard.pelanggar.nama}
                  inputPlaceholder={"Input Nama Lengkap"}
                  onChange={(name, value) =>
                    handleInputChange("pelanggar", name, value)
                  }
                />

                <WizardTextInput
                  labelText={"Nama Ayah"}
                  inputName={"ayah"}
                  defValue={formDataWizard.pelanggar.ayah}
                  inputPlaceholder={"Input Nama Ayah"}
                  onChange={(name, value) =>
                    handleInputChange("pelanggar", name, value)
                  }
                />

                <WizardTextInput
                  labelText={"Tempat Lahir"}
                  inputName={"tempat_lahir"}
                  defValue={formDataWizard.pelanggar.tempat_lahir}
                  inputPlaceholder={"Input Tempat Lahir"}
                  onChange={(name, value) =>
                    handleInputChange("pelanggar", name, value)
                  }
                />

                <WizardDateInput
                  labelText={"Tanggal Lahir"}
                  inputName={"tanggal_lahir"}
                  defValue={formDataWizard.pelanggar.tanggal_lahir}
                  onChange={(name, value) =>
                    handleInputChange("pelanggar", name, value)
                  }
                />

                <WizardDropdownInput
                  labelText={"Jenis Kelamin"}
                  inputName={"pelanggarJk"}
                  optionTitle={"Pilih Kelamin"}
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
                  defaultValue={formDataWizard.pelanggar.pelanggarJk}
                  onChange={(name, value) =>
                    handleInputChange("pelanggar", name, value)
                  }
                />

                <WizardDropdownInput
                  labelText={"Agama"}
                  inputName={"agama"}
                  optionTitle={"Pilih Agama"}
                  optionValue={
                    agama?.map((item) => ({
                      title: item.agama_nama,
                      value: item.agama_id,
                    })) || []
                  }
                  defaultValue={formDataWizard.pelanggar.agama}
                  onChange={(name, value) =>
                    handleInputChange("pelanggar", name, value)
                  }
                />

                <WizardDropdownInput
                  labelText={"Pendidikan"}
                  inputName={"pendidikan"}
                  optionTitle={"Pilih Pendidikan"}
                  optionValue={
                    pendidikan?.map((item) => ({
                      title: item.pendidikan_nama,
                      value: item.pendidikan_id,
                    })) || []
                  }
                  defaultValue={formDataWizard.pelanggar.pendidikan}
                  onChange={(name, value) =>
                    handleInputChange("pelanggar", name, value)
                  }
                />

                <WizardDropdownInput
                  labelText={"Kewarganegaraan"}
                  inputName={"kewarganegaraan"}
                  optionTitle={"Pilih Kewarganegaraan"}
                  optionValue={[
                    { title: "WNI", value: "wni" },
                    { title: "WNA", value: "wna" },
                  ]}
                  defaultValue={formDataWizard.pelanggar.kewarganegaraan}
                  onChange={(name, value) =>
                    handleInputChange("pelanggar", name, value)
                  }
                />

                <WizardDropdownInput
                  labelText={"Status Perkawinan"}
                  inputName={"status_kawin"}
                  optionTitle={"Pilih Status Perkawinan"}
                  optionValue={
                    kawin?.map((item) => ({
                      title: item.status_kawin_nama,
                      value: item.status_kawin_id,
                    })) || []
                  }
                  defaultValue={formDataWizard.pelanggar.status_kawin}
                  onChange={(name, value) =>
                    handleInputChange("pelanggar", name, value)
                  }
                />

                <WizardLimitedTextInput
                  labelText={"Nomor HP"}
                  inputName={"phone"}
                  defValue={formDataWizard.pelanggar.phone}
                  inputPlaceholder={"Input Nomor HP"}
                  onChange={(name, value) =>
                    handleInputChange("pelanggar", name, value)
                  }
                  maxLength={13}
                  minLength={12}
                />

                <WizardTextInput
                  labelText={"Alamat"}
                  inputName={"alamat"}
                  inputPlaceholder={"Input Alamat"}
                  defValue={formDataWizard.pelanggar.alamat}
                  onChange={(name, value) =>
                    handleInputChange("pelanggar", name, value)
                  }
                />
              </div>
            </div>
          </StepLayout>

          <StepLayout stepIndex={3} currentStep={3}>
            <div className="form-control gap-5">
              <span className="text-lg font-semibold">Data Saksi 1 :</span>
              <div className="grid grid-cols-3 gap-5">
                <WizardTextInput
                  labelText={"Nama Lengkap"}
                  inputName={"nama"}
                  defValue={formDataWizard.saksi1.nama}
                  inputPlaceholder={"Input Nama Lengkap"}
                  onChange={(name, value) =>
                    handleInputChange("saksi1", name, value)
                  }
                />

                <WizardTextInput
                  labelText={"Tempat Lahir"}
                  inputName={"tempat_lahir"}
                  defValue={formDataWizard.saksi1.tempat_lahir}
                  inputPlaceholder={"Input Tempat Lahir"}
                  onChange={(name, value) =>
                    handleInputChange("saksi1", name, value)
                  }
                />

                <WizardDateInput
                  labelText={"Tanggal Lahir"}
                  inputName={"tanggal_lahir"}
                  defValue={formDataWizard.saksi1.tanggal_lahir}
                  onChange={(name, value) =>
                    handleInputChange("saksi1", name, value)
                  }
                />

                <WizardDropdownInput
                  labelText={"Jenis Kelamin"}
                  inputName={"jenis_kelamin"}
                  optionTitle={"Pilih Kelamin"}
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
                  defaultValue={formDataWizard.saksi1.jenis_kelamin}
                  onChange={(name, value) =>
                    handleInputChange("saksi1", name, value)
                  }
                />

                <WizardDropdownInput
                  labelText={"Agama"}
                  inputName={"agama"}
                  optionTitle={"Pilih Agama"}
                  optionValue={
                    agama?.map((item) => ({
                      title: item.agama_nama,
                      value: item.agama_id,
                    })) || []
                  }
                  defaultValue={formDataWizard.saksi1.agama}
                  onChange={(name, value) =>
                    handleInputChange("saksi1", name, value)
                  }
                />

                <WizardDropdownInput
                  labelText={"Pendidikan"}
                  inputName={"pendidikan"}
                  optionTitle={"Pilih Pendidikan"}
                  optionValue={
                    pendidikan?.map((item) => ({
                      title: item.pendidikan_nama,
                      value: item.pendidikan_id,
                    })) || []
                  }
                  defaultValue={formDataWizard.saksi1.pendidikan}
                  onChange={(name, value) =>
                    handleInputChange("saksi1", name, value)
                  }
                />

                <WizardDropdownInput
                  labelText={"Kewarganegaraan"}
                  inputName={"kewarganegaraan"}
                  optionTitle={"Pilih Kewarganegaraan"}
                  optionValue={[
                    { title: "WNI", value: "wni" },
                    { title: "WNA", value: "wna" },
                  ]}
                  defaultValue={formDataWizard.saksi1.kewarganegaraan}
                  onChange={(name, value) =>
                    handleInputChange("saksi1", name, value)
                  }
                />

                <WizardDropdownInput
                  labelText={"Status Perkawinan"}
                  inputName={"status_kawin"}
                  optionTitle={"Pilih Status Perkawinan"}
                  optionValue={
                    kawin?.map((item) => ({
                      title: item.status_kawin_nama,
                      value: item.status_kawin_id,
                    })) || []
                  }
                  defaultValue={formDataWizard.saksi1.status_kawin}
                  onChange={(name, value) =>
                    handleInputChange("saksi1", name, value)
                  }
                />

                <WizardLimitedTextInput
                  labelText={"Nomor HP"}
                  inputName={"phone"}
                  defValue={formDataWizard.saksi1.phone}
                  inputPlaceholder={"Input Nomor HP"}
                  onChange={(name, value) =>
                    handleInputChange("saksi1", name, value)
                  }
                  maxLength={13}
                  minLength={12}
                />

                <WizardTextInput
                  labelText={"Alamat"}
                  inputName={"alamat"}
                  inputPlaceholder={"Input Alamat"}
                  defValue={formDataWizard.saksi1.alamat}
                  onChange={(name, value) =>
                    handleInputChange("saksi1", name, value)
                  }
                />
              </div>
            </div>

            <div className="form-control gap-5">
              <span className="text-lg font-semibold">Data Saksi 2 :</span>
              <div className="grid grid-cols-3 gap-5">
                <WizardTextInput
                  labelText={"Nama Lengkap"}
                  inputName={"nama"}
                  defValue={formDataWizard.saksi2.nama}
                  inputPlaceholder={"Input Nama Lengkap"}
                  onChange={(name, value) =>
                    handleInputChange("saksi2", name, value)
                  }
                />

                <WizardTextInput
                  labelText={"Tempat Lahir"}
                  inputName={"tempat_lahir"}
                  defValue={formDataWizard.saksi2.tempat_lahir}
                  inputPlaceholder={"Input Tempat Lahir"}
                  onChange={(name, value) =>
                    handleInputChange("saksi2", name, value)
                  }
                />

                <WizardDateInput
                  labelText={"Tanggal Lahir"}
                  inputName={"tanggal_lahir"}
                  defValue={formDataWizard.saksi2.tanggal_lahir}
                  onChange={(name, value) =>
                    handleInputChange("saksi2", name, value)
                  }
                />

                <WizardDropdownInput
                  labelText={"Jenis Kelamin"}
                  inputName={"jenis_kelamin"}
                  optionTitle={"Pilih Kelamin"}
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
                  defaultValue={formDataWizard.saksi2.jenis_kelamin}
                  onChange={(name, value) =>
                    handleInputChange("saksi2", name, value)
                  }
                />

                <WizardDropdownInput
                  labelText={"Agama"}
                  inputName={"agama"}
                  optionTitle={"Pilih Agama"}
                  optionValue={
                    agama?.map((item) => ({
                      title: item.agama_nama,
                      value: item.agama_id,
                    })) || []
                  }
                  defaultValue={formDataWizard.saksi2.agama}
                  onChange={(name, value) =>
                    handleInputChange("saksi2", name, value)
                  }
                />

                <WizardDropdownInput
                  labelText={"Pendidikan"}
                  inputName={"pendidikan"}
                  optionTitle={"Pilih Pendidikan"}
                  optionValue={
                    pendidikan?.map((item) => ({
                      title: item.pendidikan_nama,
                      value: item.pendidikan_id,
                    })) || []
                  }
                  defaultValue={formDataWizard.saksi2.pendidikan}
                  onChange={(name, value) =>
                    handleInputChange("saksi2", name, value)
                  }
                />

                <WizardDropdownInput
                  labelText={"Kewarganegaraan"}
                  inputName={"kewarganegaraan"}
                  optionTitle={"Pilih Kewarganegaraan"}
                  optionValue={[
                    { title: "WNI", value: "wni" },
                    { title: "WNA", value: "wna" },
                  ]}
                  defaultValue={formDataWizard.saksi2.kewarganegaraan}
                  onChange={(name, value) =>
                    handleInputChange("saksi2", name, value)
                  }
                />

                <WizardDropdownInput
                  labelText={"Status Perkawinan"}
                  inputName={"status_kawin"}
                  optionTitle={"Pilih Status Perkawinan"}
                  optionValue={
                    kawin?.map((item) => ({
                      title: item.status_kawin_nama,
                      value: item.status_kawin_id,
                    })) || []
                  }
                  defaultValue={formDataWizard.saksi2.status_kawin}
                  onChange={(name, value) =>
                    handleInputChange("saksi2", name, value)
                  }
                />

                <WizardLimitedTextInput
                  labelText={"Nomor HP"}
                  inputName={"phone"}
                  defValue={formDataWizard.saksi2.phone}
                  inputPlaceholder={"Input Nomor HP"}
                  onChange={(name, value) =>
                    handleInputChange("saksi2", name, value)
                  }
                  maxLength={13}
                  minLength={12}
                />

                <WizardTextInput
                  labelText={"Alamat"}
                  inputName={"alamat"}
                  inputPlaceholder={"Input Alamat"}
                  defValue={formDataWizard.saksi2.alamat}
                  onChange={(name, value) =>
                    handleInputChange("saksi2", name, value)
                  }
                />
              </div>
            </div>
          </StepLayout>

          <StepLayout stepIndex={4} currentStep={4}>
            <div className="form-control gap-5">
              <span className="text-lg font-semibold">Data Tindakan</span>
              <div className="grid grid-cols-3 gap-5">
                <WizardDropdownInput
                  labelText={"Penyidik"}
                  inputName={"penyidik"}
                  optionTitle={"Pilih Penyidik"}
                  optionValue={
                    penyidik?.map((item) => ({
                      title: `${item.pegawai_nip} | ${item.pegawai_nama}`,
                      value: item.penyidik_id,
                    })) || []
                  }
                  defaultValue={formDataWizard.tindakan.penyidik}
                  onChange={(name, value) =>
                    handleInputChange("tindakan", name, value)
                  }
                />

                <WizardTextAreaInput
                  labelText={"Detail Tindakan"}
                  inputName={"tindak"}
                  inputPlaceholder={"Input Detail Tindakan"}
                  defValue={formDataWizard.tindakan.tindak}
                  onChange={(name, value) =>
                    handleInputChange("tindakan", name, value)
                  }
                />

                <WizardTextAreaInput
                  labelText={"Detail Pelaksanaan"}
                  inputName={"pelaksanaan"}
                  inputPlaceholder={"Input Detail Pelaksanaan"}
                  defValue={formDataWizard.tindakan.pelaksanaan}
                  onChange={(name, value) =>
                    handleInputChange("tindakan", name, value)
                  }
                />
              </div>
            </div>
          </StepLayout>

          <StepLayout
            stepIndex={5}
            currentStep={5}
            submitFunction={() => setIsModalOpen(true)}
          >
            <div className="form-control gap-5">
              <span className="text-lg font-semibold">BUKTI</span>

              <table className="table table-sm">
                <thead>
                  <tr>
                    <th className="font-semibold">NO</th>
                    <th className="font-semibold">NAMA DOKUMEN</th>
                    <th className="font-semibold">PREVIEW</th>
                    <th className="font-semibold">STATUS</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Bukti Kejadian</td>
                    <td>
                      {formDataWizard.bukti.bukti_kejadian == "" ? (
                        <div className="w-36 h-20 rounded flex flex-col justify-center items-center bg-gray-300">
                          <i className="text-2xl">
                            <IoImageOutline />
                          </i>
                          No Image
                        </div>
                      ) : (
                        <img
                          className="w-36 h-20 rounded"
                          src={URL.createObjectURL(
                            new Blob([formDataWizard.bukti.bukti_kejadian])
                          )}
                          alt="E"
                        />
                      )}
                    </td>
                    <td>
                      <div
                        role="alert"
                        className={`alert flex justify-center p-0.5 text-xs rounded-md ${
                          formDataWizard.bukti.bukti_kejadian == ""
                            ? "alert-warning"
                            : "alert-info"
                        }`}
                      >
                        {formDataWizard.bukti.bukti_kejadian == ""
                          ? "BELUM UPLOAD"
                          : "SUDAH UPLOAD"}
                      </div>
                    </td>
                    <td>
                      <label className="btn btn-sm btn-secondary min-h-6 min-w-6 w-6 h-6 rounded">
                        <i className="text-white text-base">
                          <FaFileUpload />
                        </i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleInputFileChange("bukti", event)
                          }
                          required
                          className="hidden"
                          name="bukti_kejadian"
                        />
                      </label>
                    </td>
                  </tr>

                  <tr>
                    <td>2</td>
                    <td>Bukti Barang</td>
                    <td>
                      {formDataWizard.bukti.bukti_barang == "" ? (
                        <div className="w-36 h-20 rounded flex flex-col justify-center items-center bg-gray-300">
                          <i className="text-2xl">
                            <IoImageOutline />
                          </i>
                          No Image
                        </div>
                      ) : (
                        <img
                          className="w-36 h-20 rounded"
                          src={URL.createObjectURL(
                            new Blob([formDataWizard.bukti.bukti_barang])
                          )}
                          alt="E"
                        />
                      )}
                    </td>
                    <td>
                      <div
                        role="alert"
                        className={`alert flex justify-center p-0.5 text-xs rounded-md ${
                          formDataWizard.bukti.bukti_barang == ""
                            ? "alert-warning"
                            : "alert-info"
                        }`}
                      >
                        {formDataWizard.bukti.bukti_barang == ""
                          ? "BELUM UPLOAD"
                          : "SUDAH UPLOAD"}
                      </div>
                    </td>
                    <td>
                      <label className="btn btn-sm btn-secondary min-h-6 min-w-6 w-6 h-6 rounded">
                        <i className="text-white text-base">
                          <FaFileUpload />
                        </i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleInputFileChange("bukti", event)
                          }
                          required
                          className="hidden"
                          name="bukti_barang"
                        />
                      </label>
                    </td>
                  </tr>

                  <tr>
                    <td>3</td>
                    <td>Bukti Penyegelan</td>
                    <td>
                      {formDataWizard.bukti.bukti_penyegelan == "" ? (
                        <div className="w-36 h-20 rounded flex flex-col justify-center items-center bg-gray-300">
                          <i className="text-2xl">
                            <IoImageOutline />
                          </i>
                          No Image
                        </div>
                      ) : (
                        <img
                          className="w-36 h-20 rounded"
                          src={URL.createObjectURL(
                            new Blob([formDataWizard.bukti.bukti_penyegelan])
                          )}
                          alt="E"
                        />
                      )}
                    </td>
                    <td>
                      <div
                        role="alert"
                        className={`alert flex justify-center p-0.5 text-xs rounded-md ${
                          formDataWizard.bukti.bukti_penyegelan == ""
                            ? "alert-warning"
                            : "alert-info"
                        }`}
                      >
                        {formDataWizard.bukti.bukti_penyegelan == ""
                          ? "BELUM UPLOAD"
                          : "SUDAH UPLOAD"}
                      </div>
                    </td>
                    <td>
                      <label className="btn btn-sm btn-secondary min-h-6 min-w-6 w-6 h-6 rounded">
                        <i className="text-white text-base">
                          <FaFileUpload />
                        </i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleInputFileChange("bukti", event)
                          }
                          required
                          className="hidden"
                          name="bukti_penyegelan"
                        />
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="form-control gap-2.5">
              <span className="text-lg font-semibold">Dokumen</span>

              <table className="table table-sm">
                <thead>
                  <tr>
                    <th className="font-semibold">NO</th>
                    <th className="font-semibold">NAMA DOKUMEN</th>
                    <th className="font-semibold">PREVIEW</th>
                    <th className="font-semibold">STATUS</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>1</td>
                    <td>KTP</td>
                    <td>
                      {formDataWizard.bukti.dokumen_ktp == "" ? (
                        <div className="w-36 h-20 rounded flex flex-col justify-center items-center bg-gray-300">
                          <i className="text-2xl">
                            <IoImageOutline />
                          </i>
                          No Image
                        </div>
                      ) : (
                        <img
                          className="w-36 h-20 rounded"
                          src={URL.createObjectURL(
                            new Blob([formDataWizard.bukti.dokumen_ktp])
                          )}
                          alt="E"
                        />
                      )}
                    </td>
                    <td>
                      <div
                        role="alert"
                        className={`alert flex justify-center p-0.5 text-xs rounded-md ${
                          formDataWizard.bukti.dokumen_ktp == ""
                            ? "alert-warning"
                            : "alert-info"
                        }`}
                      >
                        {formDataWizard.bukti.dokumen_ktp == ""
                          ? "BELUM UPLOAD"
                          : "SUDAH UPLOAD"}
                      </div>
                    </td>
                    <td>
                      <label className="btn btn-sm btn-secondary min-h-6 min-w-6 w-6 h-6 rounded">
                        <i className="text-white text-base">
                          <FaFileUpload />
                        </i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleInputFileChange("bukti", event)
                          }
                          required
                          className="hidden"
                          name="dokumen_ktp"
                        />
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>SURAT PERNYATAAN</td>
                    <td>
                      {formDataWizard.bukti.dokumen_sp == "" ? (
                        <div className="w-36 h-20 rounded flex flex-col justify-center items-center bg-gray-300">
                          <i className="text-2xl">
                            <IoImageOutline />
                          </i>
                          No Image
                        </div>
                      ) : (
                        <img
                          className="w-36 h-20 rounded"
                          src={URL.createObjectURL(
                            new Blob([formDataWizard.bukti.dokumen_sp])
                          )}
                          alt="E"
                        />
                      )}
                    </td>
                    <td>
                      <div
                        role="alert"
                        className={`alert flex justify-center p-0.5 text-xs rounded-md ${
                          formDataWizard.bukti.dokumen_sp == ""
                            ? "alert-warning"
                            : "alert-info"
                        }`}
                      >
                        {formDataWizard.bukti.dokumen_sp == ""
                          ? "BELUM UPLOAD"
                          : "SUDAH UPLOAD"}
                      </div>
                    </td>
                    <td>
                      <label className="btn btn-sm btn-secondary min-h-6 min-w-6 w-6 h-6 rounded">
                        <i className="text-white text-base">
                          <FaFileUpload />
                        </i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleInputFileChange("bukti", event)
                          }
                          required
                          className="hidden"
                          name="dokumen_sp"
                        />
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>SURAT PERINGATAN 1</td>
                    <td>
                      {formDataWizard.bukti.dokumen_sp1 == "" ? (
                        <div className="w-36 h-20 rounded flex flex-col justify-center items-center bg-gray-300">
                          <i className="text-2xl">
                            <IoImageOutline />
                          </i>
                          No Image
                        </div>
                      ) : (
                        <img
                          className="w-36 h-20 rounded"
                          src={URL.createObjectURL(
                            new Blob([formDataWizard.bukti.dokumen_sp1])
                          )}
                          alt="E"
                        />
                      )}
                    </td>
                    <td>
                      <div
                        role="alert"
                        className={`alert flex justify-center p-0.5 text-xs rounded-md ${
                          formDataWizard.bukti.dokumen_sp1 == ""
                            ? "alert-warning"
                            : "alert-info"
                        }`}
                      >
                        {formDataWizard.bukti.dokumen_sp1 == ""
                          ? "BELUM UPLOAD"
                          : "SUDAH UPLOAD"}
                      </div>
                    </td>
                    <td>
                      <label className="btn btn-sm btn-secondary min-h-6 min-w-6 w-6 h-6 rounded">
                        <i className="text-white text-base">
                          <FaFileUpload />
                        </i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleInputFileChange("bukti", event)
                          }
                          required
                          className="hidden"
                          name="dokumen_sp1"
                        />
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>SURAT PERINGATAN 2</td>
                    <td>
                      {formDataWizard.bukti.dokumen_sp2 == "" ? (
                        <div className="w-36 h-20 rounded flex flex-col justify-center items-center bg-gray-300">
                          <i className="text-2xl">
                            <IoImageOutline />
                          </i>
                          No Image
                        </div>
                      ) : (
                        <img
                          className="w-36 h-20 rounded"
                          src={URL.createObjectURL(
                            new Blob([formDataWizard.bukti.dokumen_sp2])
                          )}
                          alt="E"
                        />
                      )}
                    </td>
                    <td>
                      <div
                        role="alert"
                        className={`alert flex justify-center p-0.5 text-xs rounded-md ${
                          formDataWizard.bukti.dokumen_sp2 == ""
                            ? "alert-warning"
                            : "alert-info"
                        }`}
                      >
                        {formDataWizard.bukti.dokumen_sp2 == ""
                          ? "BELUM UPLOAD"
                          : "SUDAH UPLOAD"}
                      </div>
                    </td>
                    <td>
                      <label className="btn btn-sm btn-secondary min-h-6 min-w-6 w-6 h-6 rounded">
                        <i className="text-white text-base">
                          <FaFileUpload />
                        </i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleInputFileChange("bukti", event)
                          }
                          required
                          className="hidden"
                          name="dokumen_sp2"
                        />
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>SURAT PERINGATAN 3</td>
                    <td>
                      {formDataWizard.bukti.dokumen_sp3 == "" ? (
                        <div className="w-36 h-20 rounded flex flex-col justify-center items-center bg-gray-300">
                          <i className="text-2xl">
                            <IoImageOutline />
                          </i>
                          No Image
                        </div>
                      ) : (
                        <img
                          className="w-36 h-20 rounded"
                          src={URL.createObjectURL(
                            new Blob([formDataWizard.bukti.dokumen_sp3])
                          )}
                          alt="E"
                        />
                      )}
                    </td>
                    <td>
                      <div
                        role="alert"
                        className={`alert flex justify-center p-0.5 text-xs rounded-md ${
                          formDataWizard.bukti.dokumen_sp3 == ""
                            ? "alert-warning"
                            : "alert-info"
                        }`}
                      >
                        {formDataWizard.bukti.dokumen_sp3 == ""
                          ? "BELUM UPLOAD"
                          : "SUDAH UPLOAD"}
                      </div>
                    </td>
                    <td>
                      <label className="btn btn-sm btn-secondary min-h-6 min-w-6 w-6 h-6 rounded">
                        <i className="text-white text-base">
                          <FaFileUpload />
                        </i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleInputFileChange("bukti", event)
                          }
                          required
                          className="hidden"
                          name="dokumen_sp3"
                        />
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>LAPORAN KEJADIAN</td>
                    <td>
                      {formDataWizard.bukti.dokumen_lk == "" ? (
                        <div className="w-36 h-20 rounded flex flex-col justify-center items-center bg-gray-300">
                          <i className="text-2xl">
                            <IoImageOutline />
                          </i>
                          No Image
                        </div>
                      ) : (
                        <img
                          className="w-36 h-20 rounded"
                          src={URL.createObjectURL(
                            new Blob([formDataWizard.bukti.dokumen_lk])
                          )}
                          alt="E"
                        />
                      )}
                    </td>
                    <td>
                      <div
                        role="alert"
                        className={`alert flex justify-center p-0.5 text-xs rounded-md ${
                          formDataWizard.bukti.dokumen_lk == ""
                            ? "alert-warning"
                            : "alert-info"
                        }`}
                      >
                        {formDataWizard.bukti.dokumen_lk == ""
                          ? "BELUM UPLOAD"
                          : "SUDAH UPLOAD"}
                      </div>
                    </td>
                    <td>
                      <label className="btn btn-sm btn-secondary min-h-6 min-w-6 w-6 h-6 rounded">
                        <i className="text-white text-base">
                          <FaFileUpload />
                        </i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleInputFileChange("bukti", event)
                          }
                          required
                          className="hidden"
                          name="dokumen_lk"
                        />
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>SURAT PERINTAH PENYITAAN</td>
                    <td>
                      {formDataWizard.bukti.dokumen_spp == "" ? (
                        <div className="w-36 h-20 rounded flex flex-col justify-center items-center bg-gray-300">
                          <i className="text-2xl">
                            <IoImageOutline />
                          </i>
                          No Image
                        </div>
                      ) : (
                        <img
                          className="w-36 h-20 rounded"
                          src={URL.createObjectURL(
                            new Blob([formDataWizard.bukti.dokumen_spp])
                          )}
                          alt="E"
                        />
                      )}
                    </td>
                    <td>
                      <div
                        role="alert"
                        className={`alert flex justify-center p-0.5 text-xs rounded-md ${
                          formDataWizard.bukti.dokumen_spp == ""
                            ? "alert-warning"
                            : "alert-info"
                        }`}
                      >
                        {formDataWizard.bukti.dokumen_spp == ""
                          ? "BELUM UPLOAD"
                          : "SUDAH UPLOAD"}
                      </div>
                    </td>
                    <td>
                      <label className="btn btn-sm btn-secondary min-h-6 min-w-6 w-6 h-6 rounded">
                        <i className="text-white text-base">
                          <FaFileUpload />
                        </i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleInputFileChange("bukti", event)
                          }
                          required
                          className="hidden"
                          name="dokumen_spp"
                        />
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>BERITA ACARA PENYITAAN</td>
                    <td>
                      {formDataWizard.bukti.dokumen_bap == "" ? (
                        <div className="w-36 h-20 rounded flex flex-col justify-center items-center bg-gray-300">
                          <i className="text-2xl">
                            <IoImageOutline />
                          </i>
                          No Image
                        </div>
                      ) : (
                        <img
                          className="w-36 h-20 rounded"
                          src={URL.createObjectURL(
                            new Blob([formDataWizard.bukti.dokumen_bap])
                          )}
                          alt="E"
                        />
                      )}
                    </td>
                    <td>
                      <div
                        role="alert"
                        className={`alert flex justify-center p-0.5 text-xs rounded-md ${
                          formDataWizard.bukti.dokumen_bap == ""
                            ? "alert-warning"
                            : "alert-info"
                        }`}
                      >
                        {formDataWizard.bukti.dokumen_bap == ""
                          ? "BELUM UPLOAD"
                          : "SUDAH UPLOAD"}
                      </div>
                    </td>
                    <td>
                      <label className="btn btn-sm btn-secondary min-h-6 min-w-6 w-6 h-6 rounded">
                        <i className="text-white text-base">
                          <FaFileUpload />
                        </i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleInputFileChange("bukti", event)
                          }
                          required
                          className="hidden"
                          name="dokumen_bap"
                        />
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>PERMOHONAN PERSETUJUAN PENYITAAN BARANG BUKTI</td>
                    <td>
                      {formDataWizard.bukti.dokumen_p3bb == "" ? (
                        <div className="w-36 h-20 rounded flex flex-col justify-center items-center bg-gray-300">
                          <i className="text-2xl">
                            <IoImageOutline />
                          </i>
                          No Image
                        </div>
                      ) : (
                        <img
                          className="w-36 h-20 rounded"
                          src={URL.createObjectURL(
                            new Blob([formDataWizard.bukti.dokumen_p3bb])
                          )}
                          alt="E"
                        />
                      )}
                    </td>
                    <td>
                      <div
                        role="alert"
                        className={`alert flex justify-center p-0.5 text-xs rounded-md ${
                          formDataWizard.bukti.dokumen_p3bb == ""
                            ? "alert-warning"
                            : "alert-info"
                        }`}
                      >
                        {formDataWizard.bukti.dokumen_p3bb == ""
                          ? "BELUM UPLOAD"
                          : "SUDAH UPLOAD"}
                      </div>
                    </td>

                    <td>
                      <label className="btn btn-sm btn-secondary min-h-6 min-w-6 w-6 h-6 rounded">
                        <i className="text-white text-base">
                          <FaFileUpload />
                        </i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleInputFileChange("bukti", event)
                          }
                          required
                          className="hidden"
                          name="dokumen_p3bb"
                        />
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>PERMINTAAN SURAT KUASA</td>
                    <td>
                      {formDataWizard.bukti.dokumen_psk == "" ? (
                        <div className="w-36 h-20 rounded flex flex-col justify-center items-center bg-gray-300">
                          <i className="text-2xl">
                            <IoImageOutline />
                          </i>
                          No Image
                        </div>
                      ) : (
                        <img
                          className="w-36 h-20 rounded"
                          src={URL.createObjectURL(
                            new Blob([formDataWizard.bukti.dokumen_psk])
                          )}
                          alt="E"
                        />
                      )}
                    </td>
                    <td>
                      <div
                        role="alert"
                        className={`alert flex justify-center p-0.5 text-xs rounded-md ${
                          formDataWizard.bukti.dokumen_psk == ""
                            ? "alert-warning"
                            : "alert-info"
                        }`}
                      >
                        {formDataWizard.bukti.dokumen_psk == ""
                          ? "BELUM UPLOAD"
                          : "SUDAH UPLOAD"}
                      </div>
                    </td>

                    <td>
                      <label className="btn btn-sm btn-secondary min-h-6 min-w-6 w-6 h-6 rounded">
                        <i className="text-white text-base">
                          <FaFileUpload />
                        </i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleInputFileChange("bukti", event)
                          }
                          required
                          className="hidden"
                          name="dokumen_psk"
                        />
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td>BERITA ACARA PEMERIKSAAN CEPAT</td>
                    <td>
                      {formDataWizard.bukti.dokumen_bapc == "" ? (
                        <div className="w-36 h-20 rounded flex flex-col justify-center items-center bg-gray-300">
                          <i className="text-2xl">
                            <IoImageOutline />
                          </i>
                          No Image
                        </div>
                      ) : (
                        <img
                          className="w-36 h-20 rounded"
                          src={URL.createObjectURL(
                            new Blob([formDataWizard.bukti.dokumen_bapc])
                          )}
                          alt="E"
                        />
                      )}
                    </td>
                    <td>
                      <div
                        role="alert"
                        className={`alert flex justify-center p-0.5 text-xs rounded-md ${
                          formDataWizard.bukti.dokumen_bapc == ""
                            ? "alert-warning"
                            : "alert-info"
                        }`}
                      >
                        {formDataWizard.bukti.dokumen_bapc == ""
                          ? "BELUM UPLOAD"
                          : "SUDAH UPLOAD"}
                      </div>
                    </td>

                    <td>
                      <label className="btn btn-sm btn-secondary min-h-6 min-w-6 w-6 h-6 rounded">
                        <i className="text-white text-base">
                          <FaFileUpload />
                        </i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleInputFileChange("bukti", event)
                          }
                          required
                          className="hidden"
                          name="dokumen_bapc"
                        />
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td>PERMOHONAN SIDANG TIPIRING</td>
                    <td>
                      {formDataWizard.bukti.dokumen_pst == "" ? (
                        <div className="w-36 h-20 rounded flex flex-col justify-center items-center bg-gray-300">
                          <i className="text-2xl">
                            <IoImageOutline />
                          </i>
                          No Image
                        </div>
                      ) : (
                        <img
                          className="w-36 h-20 rounded"
                          src={URL.createObjectURL(
                            new Blob([formDataWizard.bukti.dokumen_pst])
                          )}
                          alt="E"
                        />
                      )}
                    </td>
                    <td>
                      <div
                        role="alert"
                        className={`alert flex justify-center p-0.5 text-xs rounded-md ${
                          formDataWizard.bukti.dokumen_pst == ""
                            ? "alert-warning"
                            : "alert-info"
                        }`}
                      >
                        {formDataWizard.bukti.dokumen_pst == ""
                          ? "BELUM UPLOAD"
                          : "SUDAH UPLOAD"}
                      </div>
                    </td>

                    <td>
                      <label className="btn btn-sm btn-secondary min-h-6 min-w-6 w-6 h-6 rounded">
                        <i className="text-white text-base">
                          <FaFileUpload />
                        </i>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleInputFileChange("bukti", event)
                          }
                          required
                          className="hidden"
                          name="dokumen_pst"
                        />
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </StepLayout>
        </Wizard>
      </MenuContainer>
    </section>
  );
}
