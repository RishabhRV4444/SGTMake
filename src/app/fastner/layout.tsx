"use client";
import Footer from "../components/Footer";
import Sidebar from "./Sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutProps } from "@/lib/types/types";

const Layout = ({ children }:LayoutProps) => {
  const path=usePathname();
  return (
    <>
    <div className="flex items-center">
      <h2 className="text-4xl font-semibold m-4 mt-3">Fastner</h2>
      <p className="text-lg text-gray-300"><Link href={"/fastner"}>{path.split('/')[1]}</Link>/{path.split("/")[2]}</p>
    </div>
     <div className="flex justify-center p-7 m-3">
            <Sidebar />
            <main className="w-full">
              <section className="w-full ">
                {children}
              </section>
            </main>
          </div>
    <Footer />
  </>
  );
};

export default Layout;