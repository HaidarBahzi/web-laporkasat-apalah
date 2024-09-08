"use client";

import MenuContainer, {
  MenuBreadCrumbs,
  MenuEditTitle,
} from "@/components/menu";
import { CiViewList } from "react-icons/ci";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import {
  DoneLaporan,
  GetDetailPengaduan,
  RejectLaporan,
} from "@/utils/server/pengaduan/pengaduan";
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
import {
  setup_kelamin,
  status_laporan,
  tindak_lanjut_status,
} from "@prisma/client";
import { FetchInputPegawai } from "@/utils/server/pegawai/pegawai";
import { GetAllPenyidik } from "@/utils/server/penyidik/penyidik";
import { FaFileUpload, FaPaperclip } from "react-icons/fa";
import { GetDetailPelanggaran } from "@/utils/server/pelanggaran/pelanggaran";
import { useRouter } from "next/navigation";
import {
  inputDataType,
  inputJkType,
  PelanggaranTindakForm,
} from "@/components/options";
import { ModalAlertTindak } from "@/components/modal";
import axios from "axios";
import Link from "next/link";

export default function Page({ params }: { params: { id: string } }) {
  const [pelaporValues, setPelaporValues] = useState({
    user_mail: "",
    user_fullname: "",
    user_alamat: "",
    user_phone: "",
  });

  const [pengaduanValues, setPengaduanValues] = useState({
    laporan_id: "",
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

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  }

  const fetchFormValue = useCallback(async () => {
    try {
      const fetch = await GetDetailPelanggaran(params.id);

      setPelaporValues(fetch.user!);
      setPengaduanValues(fetch.pengaduan!);
      setFormDataWizard({
        pelanggar: {
          nama: fetch.pelanggaran?.pelanggar_fullname!,
          ayah: fetch.pelanggaran?.pelanggar_ayah!,
          tempat_lahir: fetch.pelanggaran?.pelanggar_tempat_lahir!,
          tanggal_lahir: formatDate(
            fetch.pelanggaran?.pelanggar_tanggal_lahir!
          ),
          pelanggarJk: inputJkType[fetch.pelanggaran?.pelanggar_jk!],
          agama: fetch.pelanggaran?.pelanggar_agama!,
          pendidikan: fetch.pelanggaran?.pelanggar_pendidikan!,
          kewarganegaraan: fetch.pelanggaran?.pelanggar_kewarnegaraan!,
          status_kawin: fetch.pelanggaran?.pelanggar_kawin!,
          phone: fetch.pelanggaran?.pelanggar_phone!,
          alamat: fetch.pelanggaran?.pelanggar_alamat!,
        },
        saksi1: {
          nama: fetch.pelanggaran?.saksi_1_fullname!,
          tempat_lahir: fetch.pelanggaran?.saksi_1_tempat_lahir!,
          tanggal_lahir: formatDate(fetch.pelanggaran?.saksi_1_tanggal_lahir!),
          jenis_kelamin: inputJkType[fetch.pelanggaran?.saksi_1_jk!],
          agama: fetch.pelanggaran?.saksi_1_agama!,
          pendidikan: fetch.pelanggaran?.saksi_1_pendidikan!,
          kewarganegaraan: fetch.pelanggaran?.saksi_1_kewarnegaraan!,
          status_kawin: fetch.pelanggaran?.saksi_1_kawin!,
          phone: fetch.pelanggaran?.saksi_1_phone!,
          alamat: fetch.pelanggaran?.saksi_1_alamat!,
        },
        saksi2: {
          nama: fetch.pelanggaran?.saksi_2_fullname!,
          tempat_lahir: fetch.pelanggaran?.saksi_2_tempat_lahir!,
          tanggal_lahir: formatDate(fetch.pelanggaran?.saksi_2_tanggal_lahir!),
          jenis_kelamin: inputJkType[fetch.pelanggaran?.saksi_2_jk!],
          agama: fetch.pelanggaran?.saksi_2_agama!,
          pendidikan: fetch.pelanggaran?.saksi_2_pendidikan!,
          kewarganegaraan: fetch.pelanggaran?.saksi_2_kewarnegaraan!,
          status_kawin: fetch.pelanggaran?.saksi_2_kawin!,
          phone: fetch.pelanggaran?.saksi_2_phone!,
          alamat: fetch.pelanggaran?.saksi_2_alamat!,
        },
        tindakan: {
          penyidik: fetch.pelanggaran?.penyidik_id!,
          tindak: fetch.pelanggaran?.tindakan_detail!,
          pelaksanaan: fetch.pelanggaran?.tindakan_pelaksanaan!,
        },
        bukti: {
          bukti_kejadian: fetch.pelanggaran?.bukti_kejadian!,
          bukti_barang: fetch.pelanggaran?.bukti_barang!,
          bukti_penyegelan: fetch.pelanggaran?.bukti_penyegelan!,
          dokumen_ktp: fetch.pelanggaran?.dokumen_ktp!,
          dokumen_sp: fetch.pelanggaran?.dokumen_sp!,
          dokumen_sp1: fetch.pelanggaran?.dokumen_sp1!,
          dokumen_sp2: fetch.pelanggaran?.dokumen_sp2!,
          dokumen_sp3: fetch.pelanggaran?.dokumen_sp3!,
          dokumen_lk: fetch.pelanggaran?.dokumen_lk!,
          dokumen_spp: fetch.pelanggaran?.dokumen_spp!,
          dokumen_bap: fetch.pelanggaran?.dokumen_bap!,
          dokumen_p3bb: fetch.pelanggaran?.dokumen_p3bb!,
          dokumen_psk: fetch.pelanggaran?.dokumen_psk!,
          dokumen_bapc: fetch.pelanggaran?.dokumen_bapc!,
          dokumen_pst: fetch.pelanggaran?.dokumen_pst!,
        },
      });

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

  const [formValues, setFormValues] = useState({
    input_action: "",
  });

  const handleDropdownChange = (selectedValue: any, inputName: string) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [inputName]: selectedValue,
    }));
  };

  async function handleSubmitClient() {
    setIsModalOpen(false);

    if (inputDataType[formValues.input_action] == status_laporan.D) {
      try {
        await DoneLaporan(pengaduanValues.laporan_id);

        axios
          .post("http://103.30.180.221:4000/notification/add", {
            user_id: pelaporValues.user_mail,
            title: "Laporan Selesai",
            message:
              "Laporan Anda sudah selesai ditindak lanjut, terima kasih atas laporannya!",
          })
          .then(() => {
            router.push("/user/menu_tindak/pengaduan");
          });
      } catch (err) {
        console.error(err);
      }
    } else if (inputDataType[formValues.input_action] == status_laporan.R) {
      try {
        await RejectLaporan(pengaduanValues.laporan_id);

        axios
          .post("http://103.30.180.221:4000/notification/add", {
            user_id: pelaporValues.user_mail,
            title: "Laporan Ditolak",
            message:
              "Laporan Anda ditolak, mohon periksa kembali laporan anda!",
          })
          .then(() => {
            router.push("/user/menu_tindak/pengaduan");
          });
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <section className="container mx-auto px-16">
      <ModalAlertTindak
        inputName={"inputAction"}
        optionTitle={"Silahkan Pilih Tindakan Akhir"}
        optionValue={[
          {
            title: "Tolak",
            value: status_laporan.R,
          },
          {
            title: "Selesai",
            value: status_laporan.D,
          },
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
          "/user/menu_tindak/pengaduan",
          "/user/menu_tindak/pengaduan",
        ]}
        endTitle={"Detail Pengaduan Masyarakat"}
      />

      <MenuContainer>
        <MenuEditTitle
          title="Detail Pengaduan Masyarakat"
          titleIcon={<CiViewList />}
          linkButton="/user/menu_tindak/pengaduan"
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
                    <th className="font-semibold">STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Bukti Kejadian</td>
                    <td>
                      <Link
                        target="_blank"
                        href={`http://103.30.180.221:3000/assets/foto-pelanggaran/${pengaduanValues.laporan_id}/Bukti-Kejadian/${formDataWizard.bukti.bukti_kejadian}`}
                        className="bg-gray-300 w-full justify-center h-fit gap-2 items-center flex col-span-2 text-gray-900 text-xs rounded p-2.5"
                      >
                        <i>
                          <FaPaperclip />
                        </i>
                        Cek Dokumen
                      </Link>
                    </td>
                  </tr>

                  <tr>
                    <td>2</td>
                    <td>Bukti Barang</td>
                    <td>
                      <Link
                        target="_blank"
                        href={`http://103.30.180.221:3000/assets/foto-pelanggaran/${pengaduanValues.laporan_id}/Bukti-Barang/${formDataWizard.bukti.bukti_barang}`}
                        className="bg-gray-300 w-full justify-center h-fit gap-2 items-center flex col-span-2 text-gray-900 text-xs rounded p-2.5"
                      >
                        <i>
                          <FaPaperclip />
                        </i>
                        Cek Dokumen
                      </Link>
                    </td>
                  </tr>

                  <tr>
                    <td>3</td>
                    <td>Bukti Penyegelan</td>
                    <td>
                      <Link
                        target="_blank"
                        href={`http://103.30.180.221:3000/assets/foto-pelanggaran/${pengaduanValues.laporan_id}/Bukti-Penyegelan/${formDataWizard.bukti.bukti_penyegelan}`}
                        className="bg-gray-300 w-full justify-center h-fit gap-2 items-center flex col-span-2 text-gray-900 text-xs rounded p-2.5"
                      >
                        <i>
                          <FaPaperclip />
                        </i>
                        Cek Dokumen
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="form-control gap-5">
              <span className="text-lg font-semibold">Dokumen</span>

              <table className="table table-sm">
                <thead>
                  <tr>
                    <th className="font-semibold">NO</th>
                    <th className="font-semibold">NAMA DOKUMEN</th>
                    <th className="font-semibold">STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>1</td>
                    <td>KTP</td>
                    <td>
                      <Link
                        target="_blank"
                        href={`http://103.30.180.221:3000/assets/foto-pelanggaran/${pengaduanValues.laporan_id}/Ktp/${formDataWizard.bukti.dokumen_ktp}`}
                        className="bg-gray-300 w-full justify-center h-fit gap-2 items-center flex col-span-2 text-gray-900 text-xs rounded p-2.5"
                      >
                        <i>
                          <FaPaperclip />
                        </i>
                        Cek Dokumen
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>SURAT PERNYATAAN</td>
                    <td>
                      <Link
                        target="_blank"
                        href={`http://103.30.180.221:3000/assets/foto-pelanggaran/${pengaduanValues.laporan_id}/Surat-Pernyataan/${formDataWizard.bukti.dokumen_sp}`}
                        className="bg-gray-300 w-full justify-center h-fit gap-2 items-center flex col-span-2 text-gray-900 text-xs rounded p-2.5"
                      >
                        <i>
                          <FaPaperclip />
                        </i>
                        Cek Dokumen
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>SURAT PERINGATAN 1</td>
                    <td>
                      <Link
                        target="_blank"
                        href={`http://103.30.180.221:3000/assets/foto-pelanggaran/${pengaduanValues.laporan_id}/Surat-Peringatan-1/${formDataWizard.bukti.dokumen_sp1}`}
                        className="bg-gray-300 w-full justify-center h-fit gap-2 items-center flex col-span-2 text-gray-900 text-xs rounded p-2.5"
                      >
                        <i>
                          <FaPaperclip />
                        </i>
                        Cek Dokumen
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>SURAT PERINGATAN 2</td>
                    <td>
                      <Link
                        target="_blank"
                        href={`http://103.30.180.221:3000/assets/foto-pelanggaran/${pengaduanValues.laporan_id}/Surat-Peringatan-2/${formDataWizard.bukti.dokumen_sp2}`}
                        className="bg-gray-300 w-full justify-center h-fit gap-2 items-center flex col-span-2 text-gray-900 text-xs rounded p-2.5"
                      >
                        <i>
                          <FaPaperclip />
                        </i>
                        Cek Dokumen
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>SURAT PERINGATAN 3</td>
                    <td>
                      <Link
                        target="_blank"
                        href={`http://103.30.180.221:3000/assets/foto-pelanggaran/${pengaduanValues.laporan_id}/Surat-Peringatan-3/${formDataWizard.bukti.dokumen_sp3}`}
                        className="bg-gray-300 w-full justify-center h-fit gap-2 items-center flex col-span-2 text-gray-900 text-xs rounded p-2.5"
                      >
                        <i>
                          <FaPaperclip />
                        </i>
                        Cek Dokumen
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>LAPORAN KEJADIAN</td>
                    <td>
                      <Link
                        target="_blank"
                        href={`http://103.30.180.221:3000/assets/foto-pelanggaran/${pengaduanValues.laporan_id}/Laporan-Kejadian/${formDataWizard.bukti.dokumen_lk}`}
                        className="bg-gray-300 w-full justify-center h-fit gap-2 items-center flex col-span-2 text-gray-900 text-xs rounded p-2.5"
                      >
                        <i>
                          <FaPaperclip />
                        </i>
                        Cek Dokumen
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>SURAT PERINTAH PENYITAAN</td>
                    <td>
                      <Link
                        target="_blank"
                        href={`http://103.30.180.221:3000/assets/foto-pelanggaran/${pengaduanValues.laporan_id}/Surat-Perintah-Penyitaan/${formDataWizard.bukti.dokumen_spp}`}
                        className="bg-gray-300 w-full justify-center h-fit gap-2 items-center flex col-span-2 text-gray-900 text-xs rounded p-2.5"
                      >
                        <i>
                          <FaPaperclip />
                        </i>
                        Cek Dokumen
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>BERITA ACARA PENYITAAN</td>
                    <td>
                      <Link
                        target="_blank"
                        href={`http://103.30.180.221:3000/assets/foto-pelanggaran/${pengaduanValues.laporan_id}/Berita-Acara-Penyitaan/${formDataWizard.bukti.dokumen_bap}`}
                        className="bg-gray-300 w-full justify-center h-fit gap-2 items-center flex col-span-2 text-gray-900 text-xs rounded p-2.5"
                      >
                        <i>
                          <FaPaperclip />
                        </i>
                        Cek Dokumen
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>PERMOHONAN PERSETUJUAN PENYITAAN BARANG BUKTI</td>
                    <td>
                      <Link
                        target="_blank"
                        href={`http://103.30.180.221:3000/assets/foto-pelanggaran/${pengaduanValues.laporan_id}/Permohonan-Persetujuan/${formDataWizard.bukti.dokumen_p3bb}`}
                        className="bg-gray-300 w-full justify-center h-fit gap-2 items-center flex col-span-2 text-gray-900 text-xs rounded p-2.5"
                      >
                        <i>
                          <FaPaperclip />
                        </i>
                        Cek Dokumen
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>PERMINTAAN SURAT KUASA</td>
                    <td>
                      <Link
                        target="_blank"
                        href={`http://103.30.180.221:3000/assets/foto-pelanggaran/${pengaduanValues.laporan_id}/Surat-Kuasa/${formDataWizard.bukti.dokumen_psk}`}
                        className="bg-gray-300 w-full justify-center h-fit gap-2 items-center flex col-span-2 text-gray-900 text-xs rounded p-2.5"
                      >
                        <i>
                          <FaPaperclip />
                        </i>
                        Cek Dokumen
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td>BERITA ACARA PEMERIKSAAN CEPAT</td>
                    <td>
                      <Link
                        target="_blank"
                        href={`http://103.30.180.221:3000/assets/foto-pelanggaran/${pengaduanValues.laporan_id}/Berita-Acara-Pemeriksaan/${formDataWizard.bukti.dokumen_bapc}`}
                        className="bg-gray-300 w-full justify-center h-fit gap-2 items-center flex col-span-2 text-gray-900 text-xs rounded p-2.5"
                      >
                        <i>
                          <FaPaperclip />
                        </i>
                        Cek Dokumen
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td>PERMOHONAN SIDANG TIPIRING</td>
                    <td>
                      <Link
                        target="_blank"
                        href={`http://103.30.180.221:3000/assets/foto-pelanggaran/${pengaduanValues.laporan_id}/Permohonan-Sidang/${formDataWizard.bukti.dokumen_pst}`}
                        className="bg-gray-300 w-full justify-center h-fit gap-2 items-center flex col-span-2 text-gray-900 text-xs rounded p-2.5"
                      >
                        <i>
                          <FaPaperclip />
                        </i>
                        Cek Dokumen
                      </Link>
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
