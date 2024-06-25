"use client";

import MenuContainer, {
  ButtonActionFunctionMenu,
  ButtonActionLinkMenu,
  MenuBreadCrumbs,
  MenuNothing,
} from "@/components/menu";
import { CiViewList } from "react-icons/ci";
import { useEffect, useState } from "react";
import { status_laporan } from "@prisma/client";
import {
  DeleteDokumenPermohonan,
  DeletePermohonanBantuan,
  GetAllPermohonanBantuan,
} from "@/utils/server/permohonan_bantuan/permohonan_bantuan";
import { IoMdInformationCircle } from "react-icons/io";
import { MdDelete, MdLocalPrintshop } from "react-icons/md";
import { formatter, laporanStatus, roleType } from "@/components/options";
import { ModalAlertDelete } from "@/components/form";
import { PrintLaporanPermohonanDetail } from "@/utils/server/print_laporan/print_detail";

export default function Page() {
  const [permohonan, setPermohonan] = useState<
    {
      user_fullname: string | null;
      user_alamat: string | null;
      user_phone: string | null;
      laporan_id: string;
      laporan_tgl_send: Date;
      laporan_title: string;
      laporan_description: string;
      laporan_location: string;
      laporan_action: string | null;
      laporan_document: string;
      laporan_status: status_laporan;
    }[]
  >([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  async function FetchAllData() {
    try {
      const callAllPermohonan = await GetAllPermohonanBantuan();
      setPermohonan(callAllPermohonan!);
    } catch (e) {
      console.error(e);
    }
  }

  async function DeleteData(permohonanId: string, permohonanDokumen: string) {
    try {
      await DeletePermohonanBantuan(permohonanId);
      await DeleteDokumenPermohonan(permohonanDokumen);
      await FetchAllData();
    } catch (e) {
      console.error(e);
    }
  }

  async function PrintData(
    idPengaduan: string,
    tanggalPengaduan: string,
    namaPelapor: string,
    alamatPelapor: string,
    noHandphone: string,
    judul: string,
    alamatLokasi: string,
    keterangan: string,
    dokumen: string
  ) {
    try {
      let Data = {
        idPengaduan: idPengaduan,
        tanggalPengaduan: tanggalPengaduan,
        namaPelapor: namaPelapor,
        alamatPelapor: alamatPelapor,
        noHandphone: noHandphone,
        judul: judul,
        alamatLokasi: alamatLokasi,
        keterangan: keterangan,
        dokumen: dokumen,
      };

      await PrintLaporanPermohonanDetail(Data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    FetchAllData();
  }, []);

  return (
    <section className="container mx-auto px-24">
      <MenuBreadCrumbs
        title={"Permohonan Bantuan"}
        linkArray={["Dashboard", "Menu Layanan"]}
        titleLinkArray={[
          "/admin/dashboard",
          "/admin/menu_layanan/permohonan_bantuan",
        ]}
        endTitle={"Permohonan Bantuan"}
      />

      <MenuContainer>
        <MenuNothing
          title="Daftar Permohonan Bantuan"
          titleIcon={<CiViewList />}
        />

        <hr />

        <div className="overflow-x-auto">
          {permohonan.length > 0 ? (
            <table className="table table-sm">
              <thead>
                <tr>
                  <th></th>
                  <th>NO</th>
                  <th>TANGGAL</th>
                  <th>NAMA PELAPOR</th>
                  <th>JUDUL</th>
                  <th>LOKASI</th>
                  <th>ACTION</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {permohonan.map((value, index) => (
                  <tr key={index}>
                    <td>
                      <div className={"flex gap-2 justify-center"}>
                        <ButtonActionLinkMenu
                          link={`/admin/menu_layanan/permohonan_bantuan/detaildata/${value.laporan_id}`}
                          btnType={"btn-warning"}
                          icon={<IoMdInformationCircle />}
                        />

                        <ButtonActionFunctionMenu
                          btnFunction={() =>
                            PrintData(
                              value.laporan_id,
                              String(value.laporan_tgl_send),
                              value.user_fullname!,
                              value.user_alamat!,
                              value.user_phone!,
                              value.laporan_title,
                              value.laporan_location,
                              value.laporan_description,
                              `${window.location.origin}/pdf-uploads/${value.laporan_document}`
                            )
                          }
                          btnType={"btn-info"}
                          icon={<MdLocalPrintshop />}
                        />

                        <ButtonActionFunctionMenu
                          btnFunction={() => setIsModalOpen(true)}
                          btnType={"btn-error"}
                          icon={<MdDelete />}
                        />

                        <ModalAlertDelete
                          isOpen={isModalOpen}
                          onClose={() => setIsModalOpen(false)}
                          onSubmit={() =>
                            DeleteData(value.laporan_id, value.laporan_document)
                          }
                        />
                      </div>
                    </td>
                    <td>{index + 1}</td>
                    <td>{formatter.format(value.laporan_tgl_send)}</td>
                    <td>{value.user_fullname}</td>
                    <td>{value.laporan_title}</td>
                    <td>{value.laporan_location}</td>
                    <td>
                      {value.laporan_action == null
                        ? "Belum ditindak"
                        : roleType[value.laporan_action]}
                    </td>
                    <td>{laporanStatus[value.laporan_status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center">Tidak ada Data Permohonan</div>
          )}
        </div>
      </MenuContainer>
    </section>
  );
}
