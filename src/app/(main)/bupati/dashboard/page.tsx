"use client";

import { MenuBreadCrumbs } from "@/components/menu";
import { useEffect, useState } from "react";
import { StatsMenu, VerticalBarChart } from "@/components/dashboard";
import { FaHeadSideCough, FaHandsHelping } from "react-icons/fa";
import { GetDashboard } from "@/utils/server/dashboard/dashboard";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

export default function Page() {
  const [detailDashboard, setDetailDashboard] = useState({
    username: "",
    pengaduan: 0,
    permohonan: 0,
    chart_send: Array(12).fill(0),
    chart_done: Array(12).fill(0),
  });

  useEffect(() => {
    async function fetchDetailDashboard() {
      const statistic = await GetDashboard();

      setDetailDashboard({
        username: statistic.session.namaUser!,
        pengaduan: statistic.pengaduan,
        permohonan: statistic.permohonan,
        chart_send: statistic.statistkSend.map((item) => item.count),
        chart_done: statistic.statistkDone.map((item) => item.count),
      });
    }

    fetchDetailDashboard();
  }, []);

  return (
    <section className="container mx-auto px-32">
      <MenuBreadCrumbs
        title={"Dashboard"}
        linkArray={[]}
        titleLinkArray={[]}
        endTitle={`Selamat Datang, ${detailDashboard.username}`}
      />

      <div className="form-control gap-10">
        <div className="flex gap-5">
          <StatsMenu
            color={"#FFA800"}
            count={detailDashboard.pengaduan}
            icon={<FaHeadSideCough />}
            title={"Pengaduan"}
            link={"/bupati/menu_layanan/pengaduan"}
          />

          <StatsMenu
            color={"#F05941"}
            count={detailDashboard.permohonan}
            icon={<FaHandsHelping />}
            title={"Permohonan"}
            link={"/bupati/menu_layanan/permohonan_bantuan"}
          />
        </div>

        <div className="flex gap-5">
          <VerticalBarChart
            dataChart={detailDashboard.chart_send}
            icon={<FaHeadSideCough />}
            title={"Pengaduan Dilaporkan"}
            color={"bg-yellow-400"}
          />

          <VerticalBarChart
            dataChart={detailDashboard.chart_done}
            icon={<IoCheckmarkDoneSharp />}
            title={"Pengaduan Diselesaikan"}
            color={"bg-green-400"}
          />
        </div>
      </div>
    </section>
  );
}
