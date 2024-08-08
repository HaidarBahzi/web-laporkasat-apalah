"use client";

import MenuContainer, {
  MenuBreadCrumbs,
  MenuEditTitle,
} from "@/components/menu";
import { CiViewList } from "react-icons/ci";
import { useCallback, useEffect, useState } from "react";
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
import { setup_kelamin } from "@prisma/client";
import { FetchInputPegawai } from "@/utils/server/pegawai/pegawai";
import { GetAllPenyidik } from "@/utils/server/penyidik/penyidik";
import { FaFileUpload } from "react-icons/fa";
import { SubmitPelanggaran } from "@/utils/server/pelanggaran/pelanggaran";
import { useRouter } from "next/navigation";
import { PelanggaranTindakForm } from "@/components/options";
import { ModalAlertProgress } from "@/components/modal";

export default function Page({ params }: { params: { id: string } }) {
  const [pelaporValues, setPelaporValues] = useState({
    user_ktp: "",
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
      pelaporValues.user_ktp,
      params.id
    );

    if (response.type == "success") {
      router.push("/tibum/menu_layanan/pengaduan");
    }
  }

  return (
    <section className="container mx-auto px-16">
      <ModalAlertProgress
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => handleSubmitClient()}
      />

      <MenuBreadCrumbs
        title={"Pengaduan Masyarakat"}
        linkArray={["Dashboard", "Menu Layanan", "Pengaduan Masyarakat"]}
        titleLinkArray={[
          "/tibum/dashboard",
          "/tibum/menu_layanan/pengaduan",
          "/tibum/menu_layanan/pengaduan",
        ]}
        endTitle={"Detail Pengaduan Masyarakat"}
      />

      <MenuContainer>
        <MenuEditTitle
          title="Detail Pengaduan Masyarakat"
          titleIcon={<CiViewList />}
          linkButton="/tibum/menu_layanan/pengaduan"
        />

        <hr />

        <Wizard>
          <StepLayout stepIndex={0} currentStep={0}>
            <div className="form-control gap-5">
              <span className="text-lg font-semibold">Data Pelapor</span>
              <div className="grid grid-cols-3 gap-5">
                <TextInput
                  labelText={"KTP Pelapor"}
                  inputName={""}
                  readOnly={true}
                  inputPlaceholder={""}
                  defValue={pelaporValues.user_ktp}
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
              <span className="text-lg font-semibold">Dokumen</span>

              <table className="table table-sm">
                <thead>
                  <tr>
                    <th></th>
                    <th className="font-semibold">NO</th>
                    <th className="font-semibold">NAMA DOKUMEN</th>
                    <th className="font-semibold">STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
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
                    <td>1</td>
                    <td>KTP</td>
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
                  </tr>
                  <tr>
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
                    <td>2</td>
                    <td>SURAT PERNYATAAN</td>
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
                  </tr>
                  <tr>
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
                    <td>3</td>
                    <td>SURAT PERINGATAN 1</td>
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
                  </tr>
                  <tr>
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
                    <td>4</td>
                    <td>SURAT PERINGATAN 2</td>
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
                  </tr>
                  <tr>
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
                    <td>5</td>
                    <td>SURAT PERINGATAN 3</td>
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
                  </tr>
                  <tr>
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
                    <td>6</td>
                    <td>LAPORAN KEJADIAN</td>
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
                  </tr>
                  <tr>
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
                    <td>7</td>
                    <td>SURAT PERINTAH PENYITAAN</td>
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
                  </tr>
                  <tr>
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
                    <td>8</td>
                    <td>BERITA ACARA PENYITAAN</td>
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
                  </tr>
                  <tr>
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
                    <td>9</td>
                    <td>PERMOHONAN PERSETUJUAN PENYITAAN BARANG BUKTI</td>
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
                  </tr>
                  <tr>
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
                    <td>10</td>
                    <td>PERMINTAAN SURAT KUASA</td>
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
                  </tr>
                  <tr>
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
                    <td>11</td>
                    <td>BERITA ACARA PEMERIKSAAN CEPAT</td>
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
                  </tr>
                  <tr>
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
                    <td>12</td>
                    <td>PERMOHONAN SIDANG TIPIRING</td>
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
