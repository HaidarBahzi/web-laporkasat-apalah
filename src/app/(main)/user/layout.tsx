import { Footer } from "@/components/footer";
import { NavbarBidang } from "@/components/navbar";
import { Suspense } from "react";
import Loading from "./loading";

export default function BidangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarBidang link={"user"} />
      <Suspense fallback={<Loading />}>
        <main className="bg-slate-200 min-h-128 pb-10">{children}</main>
      </Suspense>
      <Footer />
    </>
  );
}
