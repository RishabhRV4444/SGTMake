"use client"
import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import Footer from "../components/Footer";
import CustomerReview from "../components/Review";

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <div className="container px-4 py-12">
                <div className="">

                    <section class="">
                        <div class="max-w-2xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                Empowering Innovation <br /> Through Precision Manufacturing
                            </h1>
                            <p className="mt-4 text-lg text-gray-600">
                                SGTMake is your trusted partner for high-quality industrial components,
                                equipment, and manufacturing services.
                            </p>
                        </div>
                    </section>
                </div>

                <div className="mt-10 rounded-xl overflow-hidden shadow-lg">
                    <Image src="/about1.png" width={1920} height={900} alt="About Us" className="w-full object-cover" />
                </div>

                <div className="mt-16">
                    <ServeCard
                        img="/car.png"
                        head="Our Story: Building the Future"
                        desc="SGTMake is a leading provider of industrial components, tools, equipment, and comprehensive manufacturing services. We specialize in delivering precision-engineered solutions to a diverse range of industries, from automotive and electric vehicles to medical and beyond. Founded in [Year], SGTMake began with a vision to bridge the gap between innovative ideas and reliable manufacturing. Over the years, we've grown from a small workshop to a state-of-the-art facility, driven by our commitment to quality and customer satisfaction."
                    />
                    <ServeCard2
                        img="/car.png"
                        head="What’s Our Mission"
                        desc="Our mission is to empower our clients to achieve their goals by providing exceptional manufacturing solutions, fostering innovation, and building lasting partnerships. We are dedicated to delivering uncompromising quality, competitive pricing, and reliable service. We strive to be more than just a supplier; we aim to be a collaborative partner, understanding our clients' unique challenges and working alongside them to develop tailored solutions that drive their success."
                    />
                </div>
                <CustomerReview/>
            </div>
            <Footer />
        </>
    );
}

export const ServeCard = ({ img, head, desc }) => {
    return (
        <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow p-6 m-5">
            <div className="md:w-1/2 w-full rounded-2xl overflow-hidden">
                <Image src={img} alt={head} height={500} width={500} className="object-cover rounded-xl" />
            </div>
            <div className="mt-7 md:mt-0 flex flex-col justify-center md:w-1/2 w-full">
                <h2 className="text-2xl font-bold mb-4">{head}</h2>
                <p className="text-gray-600 text-lg">{desc}</p>
            </div>
        </div>
    );
};

export const ServeCard2 = ({ img, head, desc }) => {
    return (
        <div className="flex flex-col-reverse md:flex-row items-center bg-white rounded-2xl shadow p-6 m-5">
            <div className="mt-7 md:mt-0 flex flex-col justify-center md:w-1/2 w-full">
                <h2 className="text-2xl font-bold mb-4">{head}</h2>
                <p className="text-gray-600 text-lg">{desc}</p>
            </div>
            <div className="md:w-1/2 w-full rounded-2xl overflow-hidden">
                <Image src={img} alt={head} height={500} width={500} className="object-fit rounded-xl" />
            </div>
        </div>
    );
};  