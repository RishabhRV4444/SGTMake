"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "./Sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Layout = ({ children }) => {
  const path=usePathname();
  return (
    <>
      <div className="flex items-center">
        <h2 className="text-3xl font-bold m-4">Tools & Equipments</h2>
        <p className="text-lg text-gray-300"><Link href={"/tools"}>{path.split('/')[1]}</Link>/{path.split("/")[2]}</p>
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