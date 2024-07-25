"use client";

import { MenuBreadCrumbs } from "@/components/menu";
import { useEffect, useState } from "react";
import { StatsMenu, VerticalBarChart } from "@/components/dashboard";
import {
  FaUsers,
  FaHeadSideCough,
  FaUserFriends,
  FaHandsHelping,
} from "react-icons/fa";
import { GetDashboardAdmin } from "@/utils/server/dashboard/dashboard";
import { getDataSession } from "@/utils/lib/session";

export default function Page() {
  const [detailDashboard, setDetailDashboard] = useState({
    username: "",
    pengaduan: 0,
    permohonan: 0,
    user: 0,
    pegawai: 0,
    chart_unconfirm: Array(12).fill(0),
    chart_confirm: Array(12).fill(0),
    chart_progress: Array(12).fill(0),
    chart_reject: Array(12).fill(0),
    chart_done: Array(12).fill(0),
  });

  useEffect(() => {
    async function fetchDetailDashboard() {
      try {
        const session = await getDataSession();

        const statistic = await GetDashboardAdmin();

        setDetailDashboard({
          username: session.namaUser!,
          pengaduan: statistic.pengaduan,
          permohonan: statistic.permohonan,
          user: statistic.user,
          pegawai: statistic.pegawai,
          chart_unconfirm: statistic.statistkUnconfirm.map(
            (item) => item.count
          ),
          chart_confirm: statistic.statistikConfirmed.map((item) => item.count),
          chart_progress: statistic.statistikProgress.map((item) => item.count),
          chart_reject: statistic.statistikRejected.map((item) => item.count),
          chart_done: statistic.statistkDone.map((item) => item.count),
        });
      } catch (e) {
        console.error(e);
      }
    }

    fetchDetailDashboard();
  }, []);

  return (
    <section className="container mx-auto px-16">
      <MenuBreadCrumbs
        title={"Dashboard"}
        linkArray={[]}
        titleLinkArray={[]}
        endTitle={`Selamat Datang, ${detailDashboard.username}`}
      />

      <div className="form-control gap-10">
        <div className="flex gap-5 z-0">
          <StatsMenu
            color={"#0D9276"}
            count={detailDashboard.pegawai}
            icon={<FaUsers />}
            title={"Pegawai Aktif"}
            link={"/admin/menu_user/pegawai"}
          />

          <StatsMenu
            color={"#10439F"}
            count={detailDashboard.user}
            icon={<FaUserFriends />}
            title={"User Aktif"}
            link={"/admin/menu_user/users"}
          />

          <StatsMenu
            color={"#FFA800"}
            count={detailDashboard.pengaduan}
            icon={<FaHeadSideCough />}
            title={"Pengaduan"}
            link={"/admin/menu_layanan/pengaduan"}
          />

          <StatsMenu
            color={"#F05941"}
            count={detailDashboard.permohonan}
            icon={<FaHandsHelping />}
            title={"Permohonan"}
            link={"/admin/menu_layanan/permohonan_bantuan"}
          />
        </div>

        <div>
          <VerticalBarChart
            dataChartUnconfirm={detailDashboard.chart_unconfirm}
            dataChartConfirm={detailDashboard.chart_confirm}
            dataChartProgress={detailDashboard.chart_progress}
            dataChartReject={detailDashboard.chart_reject}
            dataChartDone={detailDashboard.chart_done}
            icon={<FaHeadSideCough />}
            title={"Statistik Laporan Tahun ini"}
            color={"bg-green-400"}
          />
        </div>
      </div>
    </section>
  );
}
