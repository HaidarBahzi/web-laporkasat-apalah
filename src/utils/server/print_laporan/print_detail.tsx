import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import LaporanPengaduanDetail from "@/utils/lib/pdf/pengaduan/laporan_detail";
import LaporanPermohonanDetail from "@/utils/lib/pdf/permohonan/laporan_detail";

interface DataPengaduan {
  idPengaduan: string;
  tanggalPengaduan: string;
  namaPelapor: string;
  alamatPelapor: string;
  noHandphone: string;
  judul: string;
  alamatLokasi: string;
  keterangan: string;
  foto: string;
}

export async function PrintLaporanPengaduanDetail(laporan: DataPengaduan) {
  try {
    const blob = await pdf(
      <LaporanPengaduanDetail
        tanggalPengaduan={laporan.tanggalPengaduan}
        namaPelapor={laporan.namaPelapor}
        alamatPelapor={laporan.alamatPelapor}
        noHandphone={laporan.noHandphone}
        judul={laporan.judul}
        alamatLokasi={laporan.alamatLokasi}
        keterangan={laporan.keterangan}
        foto={laporan.foto}
      />
    ).toBlob();

    saveAs(blob, `laporan-pengaduan-${laporan.idPengaduan}.pdf`);
  } catch (e) {
    console.error(e);
  }
}

interface DataPermohonan {
  idPengaduan: string;
  tanggalPengaduan: string;
  namaPelapor: string;
  alamatPelapor: string;
  noHandphone: string;
  judul: string;
  alamatLokasi: string;
  keterangan: string;
  dokumen: string;
}

export async function PrintLaporanPermohonanDetail(laporan: DataPermohonan) {
  try {
    const blob = await pdf(
      <LaporanPermohonanDetail
        tanggalPengaduan={laporan.tanggalPengaduan}
        namaPelapor={laporan.namaPelapor}
        alamatPelapor={laporan.alamatPelapor}
        noHandphone={laporan.noHandphone}
        judul={laporan.judul}
        alamatLokasi={laporan.alamatLokasi}
        keterangan={laporan.keterangan}
        dokumen={laporan.dokumen}
      />
    ).toBlob();

    saveAs(blob, `laporan-permohonan-${laporan.idPengaduan}.pdf`);

    window.open(laporan.dokumen, "_blank", "noopener,noreferrer");
  } catch (e) {
    console.error(e);
  }
}
