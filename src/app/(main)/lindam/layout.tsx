import { Footer } from "@/components/footer";
import { NavbarOperator } from "@/components/navbar";
import { Suspense } from "react";
import Loading from "./loading";

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarOperator link={"lindam"} />
      <Suspense fallback={<Loading />}>
        <main className="bg-slate-200 min-h-128 pb-10">{children}</main>
      </Suspense>
      <Footer />
    </>
  );
}
