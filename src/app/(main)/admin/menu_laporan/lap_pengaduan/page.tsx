"use client";

import MenuContainer, { MenuBreadCrumbs, MenuNothing } from "@/components/menu";
import { CiViewList } from "react-icons/ci";
import { status_laporan } from "@prisma/client";
import {
  ButtonExport,
  DateLaporanInput,
  DropdownAddInput,
} from "@/components/form";
import { PrintLaporanPengaduanAll } from "@/utils/server/print_laporan/print_all";
import { pdf } from "@react-pdf/renderer";
import LaporanPengaduanAll from "@/utils/lib/pdf/pengaduan/laporan_full";
import saveAs from "file-saver";

export default function Page() {
  interface DateProps {
    tanggalAwal: Date;
    tanggalAkhir: Date;
  }

  interface DataProps {
    tanggalPengaduan: string;
    namaPelapor: string;
    alamatPelapor: string;
    noHandphone: string;
    judul: string;
    lokasi: string;
    keterangan: string;
    status: string;
  }

  async function handleSubmitClient(formData: FormData) {
    const response = await PrintLaporanPengaduanAll(formData);

    try {
      const dateFirst = new Date(formData.get("dateFirst")?.toString()!);
      const dateSec = new Date(formData.get("dateSec")?.toString()!);

      const dateProps: DateProps = {
        tanggalAwal: new Date(dateFirst),
        tanggalAkhir: new Date(dateSec),
      };

      const dataProps: DataProps[] = response.map((value, index) => {
        return {
          tanggalPengaduan: value.laporan_tgl_send.toString(),
          namaPelapor: value.user_fullname?.toString()!,
          alamatPelapor: value.user_alamat?.toString()!,
          noHandphone: value.user_phone?.toString()!,
          judul: value.laporan_title?.toString()!,
          lokasi: value.laporan_location?.toString()!,
          keterangan: value.laporan_description?.toString()!,
          status: value.laporan_status,
        };
      });

      const blob = await pdf(
        <LaporanPengaduanAll when={dateProps} data={dataProps} />
      ).toBlob();

      saveAs(blob, `laporan-pengaduan.pdf`);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <section className="container mx-auto px-16">
      <MenuBreadCrumbs
        title={"Lap. Pengaduan Masyarakat"}
        linkArray={["Dashboard", "Menu Laporan"]}
        titleLinkArray={[
          "/admin/dashboard",
          "/admin/menu_laporan/lap_pengaduan",
        ]}
        endTitle={"Lap. Pengaduan Masyarakat"}
      />

      <MenuContainer>
        <MenuNothing
          title="Lap. Pengaduan Masyarakat"
          titleIcon={<CiViewList />}
        />

        <hr />

        <form action={handleSubmitClient} className="form-control gap-4 px-8">
          <DateLaporanInput
            inputNameFirst={"dateFirst"}
            inputNameSec={"dateSec"}
          />

          <DropdownAddInput
            labelText={"Status Data"}
            inputName={"dataType"}
            optionTitle={"Pilih Status Data"}
            optionValue={[
              {
                title: "SEMUA DATA",
                value: "all",
              },
              {
                title: "DITERIMA",
                value: status_laporan.S,
              },
              {
                title: "TERKONFIRMASI",
                value: status_laporan.C,
              },
              {
                title: "DALAM PROGRESS",
                value: status_laporan.P,
              },
              {
                title: "DITOLAK",
                value: status_laporan.R,
              },
              {
                title: "SELESAI",
                value: status_laporan.D,
              },
            ]}
            defaultValue={""}
          />

          <hr />

          <div className="flex justify-center">
            <ButtonExport />
          </div>
        </form>
      </MenuContainer>
    </section>
  );
}
