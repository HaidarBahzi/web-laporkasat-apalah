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
        title={"Non Justitia"}
        linkArray={["Dashboard", "Menu Tindak Lanjut"]}
        titleLinkArray={["/admin/dashboard", "/admin/menu_tindak/non_justitia"]}
        endTitle={"Non Justitia"}
      />

      <MenuContainer>
        <MenuAddTitle
          title="Daftar Tindak Lanjut Non Justitia"
          titleIcon={<CiViewList />}
          linkButton="/admin/menu_tindak/non_justitia/adddata"
        />

        <hr />

        <div className="overflow-x-hidden"></div>
      </MenuContainer>
    </section>
  );
}
