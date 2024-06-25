import { Footer } from "@/components/footer";
import { NavbarAdmin } from "@/components/navbar";
import { Suspense } from "react";
import Loading from "./loading";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarAdmin link={"admin"} />
      <Suspense fallback={<Loading />}>
        <main className="bg-slate-200 min-h-128 pb-10">{children}</main>
      </Suspense>
      <Footer />
    </>
  );
}
