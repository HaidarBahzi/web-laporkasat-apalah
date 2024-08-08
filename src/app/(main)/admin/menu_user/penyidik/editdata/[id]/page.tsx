"use client";

import MenuContainer, {
  MenuBreadCrumbs,
  MenuEditTitle,
} from "@/components/menu";
import { FaRegImage } from "react-icons/fa";
import { createRef, useCallback, useEffect, useState } from "react";
import {
  ButtonSubmit,
  DateInput,
  DropdownEditInput,
  FailNotification,
  HoneypotInput,
  LimitedTextInput,
  SearchTextInput,
  SuccessNotification,
  TextInput,
  TextInputUpdate,
} from "@/components/form";
import { RiPencilFill } from "react-icons/ri";
import { asset_status } from "@prisma/client";
import { MdDelete } from "react-icons/md";
import { EditAsset, GetDetailAssets } from "@/utils/server/master/assets";
import Image from "next/image";
import { ModalAlertEdit, ModalSearchPegawai } from "@/components/modal";
import {
  EditPenyidik,
  GetDetailPenyidik,
} from "@/utils/server/penyidik/penyidik";
import { GetDetailPegawai } from "@/utils/server/pegawai/pegawai";

interface PegawaiSearch {
  pegawaiNip?: string;
  pegawaiNama?: string;
  pegawaiJabatan?: string;
  pegawaiSk?: string;
  penyidikTglSk?: string;
}

export default function Page({ params }: { params: { id: string } }) {
  const ref = createRef<HTMLFormElement>();

  const [notification, setNotification] = useState({ type: "", message: "" });
  const [pegawaiSearch, setPegawaiSearch] = useState<PegawaiSearch>({
    pegawaiNip: "",
    pegawaiNama: "",
    pegawaiJabatan: "",
    pegawaiSk: "",
    penyidikTglSk: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  function closeNotification() {
    setNotification({ type: "", message: "" });
  }

  const fetchAdditionalData = useCallback(async () => {
    try {
      const fetch = await GetDetailPenyidik(params.id);
      const detail = await GetDetailPegawai(fetch?.pegawai_nip!);

      setPegawaiSearch({
        pegawaiNip: fetch?.pegawai_nip!,
        pegawaiNama: detail?.pegawai_nama!,
        pegawaiJabatan: detail?.pegawai_jabatan!,
        pegawaiSk: fetch?.penyidik_sk!,
        penyidikTglSk: fetch?.penyidik_tgl_sk
          ? formatDate(fetch.penyidik_tgl_sk)
          : "", // Format date
      });
    } catch (e) {
      console.error(e);
    }
  }, [params.id]);

  async function handleSubmitClient(formData: FormData) {
    const response = await EditPenyidik(formData, params.id);

    setNotification({ type: response.type, message: response.message });
  }

  const handleFormEdit = async () => {
    if (ref.current) {
      const formData = new FormData(ref.current);
      await handleSubmitClient(formData);
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    fetchAdditionalData();
  }, [params.id, fetchAdditionalData]);

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  }

  const handleDropdownChange = (selectedValue: any, inputName: string) => {
    setPegawaiSearch((prevPegawaiSearch) => ({
      ...prevPegawaiSearch,
      [inputName]: selectedValue,
    }));
  };

  return (
    <section className="container mx-auto px-16">
      <ModalAlertEdit
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => handleFormEdit()}
      />

      <ModalSearchPegawai
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSubmit={(
          pegawaiNip: string,
          pegawaiNama: string,
          pegawaiJabatan: string
        ) => {
          setIsSearchOpen(false);
          setPegawaiSearch({
            pegawaiNip: pegawaiNip,
            pegawaiNama: pegawaiNama,
            pegawaiJabatan: pegawaiJabatan,
          });
        }}
      />

      <MenuBreadCrumbs
        title={"Users"}
        linkArray={["Dashboard", "Menu User", "Penyidik"]}
        titleLinkArray={[
          "/admin/dashboard",
          "/admin/menu_user/penyidik",
          "/admin/menu_user/penyidik",
        ]}
        endTitle={"Edit Penyidik"}
      />

      <MenuContainer>
        <MenuEditTitle
          title={"Edit Penyidik"}
          titleIcon={<FaRegImage />}
          linkButton={"/admin/menu_user/penyidik"}
        />

        <hr />

        {notification.type &&
          (notification.type === "success" ? (
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
              labelText={"Nama Pegawai"}
              inputName={"penyidikNip"}
              inputPlaceholder={"Cari Nama Pegawai"}
              defValue={pegawaiSearch.pegawaiNip || ""}
              showValue={pegawaiSearch.pegawaiNama || ""}
              buttonPress={() => setIsSearchOpen(true)}
            />

            <TextInputUpdate
              labelText={"Jabatan Pegawai"}
              inputName={""}
              value={pegawaiSearch.pegawaiJabatan || ""}
            />

            <LimitedTextInput
              labelText={"Nomor SK"}
              inputName={"penyidikSk"}
              defValue={pegawaiSearch.pegawaiSk || ""}
              inputPlaceholder={"Input Nomor SK"}
              maxLength={25}
              minLength={25}
            />

            <DateInput
              labelText={"Tanggal SK"}
              inputName={"penyidikTglSk"}
              defValue={pegawaiSearch.penyidikTglSk || ""}
              handleChange={(selectedValue) =>
                handleDropdownChange(selectedValue, "penyidikTglSk")
              }
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
