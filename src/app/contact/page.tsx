"use client";

import Image from "next/image";
import Footer from "../components/Footer";
import { SocialCard } from "../components/SocialCard";

export default function ContactUsPage() {
  return (
    <>
      <div className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section - Contact Form */}
          <div>
            <h1 className="text-4xl font-semibold">Contact with Our <br/> Specialized Team</h1>
            <p className="text-gray-600 mb-6">
              Please fill in the part number according to your cable requirements.
            </p>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Name" className="p-3 border rounded-md w-full" />
              <input type="email" placeholder="Email" className="p-3 border rounded-md w-full" />
              <input type="text" placeholder="Company" className="p-3 border rounded-md w-full" />
              <input type="text" placeholder="Country" className="p-3 border rounded-md w-full" />
              <textarea placeholder="Inquiry Details" className="p-3 border rounded-md w-full col-span-2" ></textarea>
              <button className="bg-orange-500 text-white rounded-md p-3">Send Message</button>
            </form>
          </div>
          
          {/* Right Section - Images & Contact Info */}
          <div className="space-y-6">
            {/* Image Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Image height={500} width={300} src="/london.png" alt="London, UK" className="rounded-lg w-full h-52 object-cover" />
                <div className="absolute bottom-2 left-2 bg-white px-3 py-1 text-sm font-semibold shadow-md rounded-md">London, UK ↗</div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                <Image height={500} width={300} src="/usa.png" alt="California, USA" className="rounded-lg w-full h-24 object-cover" />
                  <div className="absolute bottom-2 left-2 bg-white px-3 py-1 text-sm font-semibold shadow-md rounded-md">California, USA ↗</div>
                </div>
                <div className="relative">
                    <Image height={500} width={300} src="/china.png"alt="Shanghai, China" className="rounded-lg w-full h-24 object-cover" />
                  <div className="absolute bottom-2 left-2 bg-white px-3 py-1 text-sm font-semibold shadow-md rounded-md">Shanghai, China ↗</div>
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="border p-6 rounded-lg shadow-md bg-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SocialCard img={"/mail.png"} title={"Email"} text={"example@gmail.com"}/>
                <SocialCard img={"/linkdin.png"} title={"LinkedIn"} text={"@sgtmake25"}/>
                <SocialCard img={"/x.png"} title={"X"} text={"@sgtmake25"}/>
                <SocialCard img={"/call.png"} title={"Phone"} text={"+944 675 9786"}/>
                <SocialCard img={"/insta.png"} title={"Instagram"} text={"@sgtmake25"}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}



