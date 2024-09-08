import { formatter, laporanStatus } from "@/components/options";
import {
  Image,
  Text,
  View,
  Page,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  img: {
    width: 50,
    height: 60,
  },
  imgheader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: 2.5,
    paddingBottom: 5,
    width: "100%",
  },
  containerheader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    width: 500,
  },
  containerapalah: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  headersub: { fontWeight: "bold", fontSize: 12 },
  headertitle: { fontWeight: "extrabold", fontSize: 16 },
  headerlater: { fontSize: 8 },
  bodytitle: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  bodysubtitle: { fontSize: 10, textAlign: "center", marginVertical: 10 },
  section: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    fontSize: 10,
    marginVertical: 5,
  },
  sectionimage: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    fontSize: 10,
    marginVertical: 5,
  },
  imgdetail: {
    width: 250,
  },
  table: {
    fontSize: 8,
  },
});

const LaporanTitle: React.FC = () => (
  <>
    <View style={styles.imgheader}>
      <Image style={styles.img} src="/images/logo/logo-white.png" />
      <View style={styles.containerheader}>
        <View style={styles.containerapalah}>
          <Text style={styles.headersub}>PEMERINTAH KABUPATEN KUDUS</Text>
          <Text style={styles.headertitle}>SATUAN POLISI PAMONG PRAJA</Text>
        </View>

        <View style={styles.containerapalah}>
          <Text style={styles.headerlater}>
            Jl. Drs. R.M. Sosrokartono No. 39 Telp. 0291-438137 Kudus 59312
          </Text>
          <Text style={styles.headerlater}>
            E-mail: satpolpp@kuduskab.go.id | Website:
            https://satpolpp.kuduskab.go.id/
          </Text>
        </View>
      </View>
    </View>
  </>
);

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

function LaporanPengaduanAll({
  when,
  data,
}: {
  when: DateProps;
  data: DataProps[];
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <LaporanTitle />

        <View>
          <Text style={styles.bodytitle}>LAPORAN PENGADUAN MASYARAKAT</Text>
          <Text style={styles.bodysubtitle}>
            PERIODE : {formatter.format(when.tanggalAwal)} s/d
            {` ${formatter.format(when.tanggalAkhir)}`}
          </Text>

          <Table style={styles.table}>
            <TH>
              <TD weighting={0.3}>NO</TD>
              <TD weighting={1}>TANGGAL</TD>
              <TD weighting={1}>NAMA PELAPOR</TD>
              <TD weighting={1}>NO. HANDPHONE</TD>
              <TD weighting={1}>JUDUL</TD>
              <TD weighting={1}>KETERANGAN</TD>
              <TD weighting={1}>LOKASI</TD>
              <TD weighting={1}>STATUS</TD>
            </TH>
            {data.map((value, index) => {
              return (
                <TR key={index}>
                  <TD weighting={0.3}>1</TD>
                  <TD weighting={1}>
                    {formatter.format(new Date(value.tanggalPengaduan))}
                  </TD>
                  <TD weighting={1}>{value.namaPelapor}</TD>
                  <TD weighting={1}>{value.noHandphone}</TD>
                  <TD weighting={1}>{value.judul}</TD>
                  <TD weighting={1}>{value.keterangan}</TD>
                  <TD weighting={1}>{value.lokasi}</TD>
                  <TD weighting={1}>{laporanStatus[value.status]}</TD>
                </TR>
              );
            })}
          </Table>
        </View>
      </Page>
    </Document>
  );
}

function LaporanPengaduanAllNoDate({ data }: { data: DataProps[] }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <LaporanTitle />

        <View>
          <Text style={styles.bodytitle}>LAPORAN PENGADUAN MASYARAKAT</Text>

          <Table style={styles.table}>
            <TH>
              <TD weighting={0.3}>NO</TD>
              <TD weighting={1}>TANGGAL</TD>
              <TD weighting={1}>NAMA PELAPOR</TD>
              <TD weighting={1}>NO. HANDPHONE</TD>
              <TD weighting={1}>JUDUL</TD>
              <TD weighting={1}>KETERANGAN</TD>
              <TD weighting={1}>LOKASI</TD>
              <TD weighting={1}>STATUS</TD>
            </TH>
            {data.map((value, index) => {
              return (
                <TR key={index}>
                  <TD weighting={0.3}>1</TD>
                  <TD weighting={1}>
                    {formatter.format(new Date(value.tanggalPengaduan))}
                  </TD>
                  <TD weighting={1}>{value.namaPelapor}</TD>
                  <TD weighting={1}>{value.noHandphone}</TD>
                  <TD weighting={1}>{value.judul}</TD>
                  <TD weighting={1}>{value.keterangan}</TD>
                  <TD weighting={1}>{value.lokasi}</TD>
                  <TD weighting={1}>{laporanStatus[value.status]}</TD>
                </TR>
              );
            })}
          </Table>
        </View>
      </Page>
    </Document>
  );
}

export { LaporanPengaduanAll, LaporanPengaduanAllNoDate };
