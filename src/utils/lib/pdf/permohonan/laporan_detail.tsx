import { formatter } from "@/components/options";
import {
  Image,
  Text,
  View,
  Page,
  Document,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
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
    textDecoration: "underline",
    fontSize: 11,
    textAlign: "center",
    marginVertical: 10,
  },
  bodysubtitle: { fontSize: 11, textAlign: "center", marginVertical: 10 },
  section: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    fontSize: 10,
    marginVertical: 5,
  },
  sectionimage: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    fontSize: 10,
    marginVertical: 5,
  },
  imgdetail: {
    width: 250,
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

interface LaporanDetailProps {
  label: string;
  value: any;
}

const LaporanDetail: React.FC<LaporanDetailProps> = ({ label, value }) => (
  <View style={styles.section}>
    <Text>{label}</Text>
    <Text>:</Text>
    <Text>{value}</Text>
  </View>
);

const LaporanDetailURL: React.FC<LaporanDetailProps> = ({ label, value }) => (
  <View style={styles.section}>
    <Text>{label}</Text>
    <Text>:</Text>
    <Link href={value}>{value}</Link>
  </View>
);

interface DataProps {
  tanggalPengaduan: string;
  namaPelapor: string;
  alamatPelapor: string;
  noHandphone: string;
  judul: string;
  alamatLokasi: string;
  keterangan: string;
  dokumen: string;
}

function LaporanPermohonanDetail(laporan: DataProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <LaporanTitle />

        <View>
          <Text style={styles.bodytitle}>DATA PERMOHONAN BANTUAN</Text>

          <LaporanDetail
            label="Tanggal Pengaduan"
            value={formatter.format(new Date(laporan.tanggalPengaduan))}
          />
          <LaporanDetail label="Nama Pelapor" value={laporan.namaPelapor} />
          <LaporanDetail label="Alamat Pelapor" value={laporan.alamatPelapor} />
          <LaporanDetail
            label="No. Handphone Pelapor"
            value={laporan.noHandphone}
          />

          <Text style={styles.bodysubtitle}>DETAIL PERMOHONAN</Text>

          <LaporanDetail label="Judul Permohonan" value={laporan.judul} />
          <LaporanDetail
            label="Alamat Permohonan"
            value={laporan.alamatLokasi}
          />
          <LaporanDetail
            label="Keterangan Permohonan"
            value={laporan.keterangan}
          />
          <LaporanDetailURL
            label="URL Surat Permohonan"
            value={laporan.dokumen}
          />
        </View>
      </Page>
    </Document>
  );
}

export default LaporanPermohonanDetail;
