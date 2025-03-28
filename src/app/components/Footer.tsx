"use client"
import { useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";
import Link  from 'next/link'
import Image from "next/image";
const Footer = () => {
    const sections = [{ name: "Home", link: "home" }, { name: "Services", link: "services" },{ name: "Choose Us", link: "choose" }, { name: "About Us", link: "serve" }];
     const [activeSection, setActiveSection] = useState("home");
    return (
        <footer className="bg-[#18191A] text-white p-8 mt-8">
            <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 text-center max-w-6xl">
                <div className=" flex items-center flex-col">
                    <Image height={40} width={50} src="/logo-white.png" alt="Logo" className="w-32 mb-4 " />
          
                    <div className="flex space-x-3 mt-4 text-xl">
                        <Link href="https://www.facebook.com/share/1XKtj5HDHx/" ><FaFacebook size={30}/></Link>
                        <Link href="https://www.instagram.com/sgt.make?igsh=MTNhZXJnZm5iMDZzdA==" ><FaInstagram size={30}/></Link>
                        <Link href="https://www.linkedin.com/company/sgtmake/"><FaLinkedin size={30}/></Link>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-3">Services</h3>
                    <ul className="text-sm space-y-2">
                        <li>3D Designing</li>
                        <li>3D Printing</li>
                        <li>CNC Machining</li>
                        <li>Battery Packs</li>
                        <li>Laser Cutting</li>
                        <li>Wiring Harnesses</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-3">Quick Links</h3>
                    <ul className="text-sm space-y-2">
                    {sections.map((section) => (
   <li key={section.link}>   <ScrollLink
      
      to={section.link}
      spy={true}
      smooth={true}
      offset={-100}
      duration={500}
      className={`cursor-pointer`}
      onSetActive={() => setActiveSection(section.link)}
    >
      {section.name}
    </ScrollLink></li>
      ))}
                    </ul>
                </div>
                {/* <div>
                    <h3 className="font-semibold mb-3">More</h3>
                    <ul className="text-sm space-y-2">
                        <li>Cart</li>
                        <li>Location</li>
                        <li>Track Orders</li>
                        <li>Help Center</li>
                    </ul>
                </div> */}
                {/* <div className="">
                    <h3 className="font-semibold mb-3">Subscribe</h3>
                    <input type="email" placeholder="Enter Email" className="w-full p-2 mb-2 rounded text-black border-orange-400" />
                    <button className="bg-orange-500 px-4 py-2 rounded">Submit</button>
                </div> */}
            </div>
            <div className="text-center mt-6 border-t border-gray-700 pt-4 text-sm">
                © 2025 All Rights Reserved.
            </div>
            <p className="text-sm text-center">Developed & Maintain by <span className="font-bold underline cursor-pointer text-[#86EFAC]">www.arevei.com</span></p>
        </footer>
    );
};

export default Footer;