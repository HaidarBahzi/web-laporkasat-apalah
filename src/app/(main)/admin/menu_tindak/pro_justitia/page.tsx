"use client";

import MenuContainer, {
  MenuAddTitle,
  MenuBreadCrumbs,
} from "@/components/menu";
import { CiViewList } from "react-icons/ci";

export default function Page() {
  return (
    <section className="container mx-auto px-16">
      <MenuBreadCrumbs
        title={"Pro Justitia"}
        linkArray={["Dashboard", "Menu Tindak Lanjut"]}
        titleLinkArray={["/admin/dashboard", "/admin/menu_tindak/pro_justitia"]}
        endTitle={"Pro Justitia"}
      />

      <MenuContainer>
        <MenuAddTitle
          title="Daftar Tindak Lanjut Pro Justitia"
          titleIcon={<CiViewList />}
          linkButton="/admin/menu_tindak/pro_justitia/adddata"
        />

        <hr />

        <div className="overflow-x-hidden"></div>
      </MenuContainer>
    </section>
  );
}
