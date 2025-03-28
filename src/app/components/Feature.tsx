"use client"
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeatureProduct() {
    const data = [
        {
            img: "/handymans.png",
            tag: "Fasteners",
            name: "Handyman's 8 in 1 Pack",
            sku: "13D74K44M",
            price: 150.00
        },
        {
            img: "/pcb.png",
            tag: "EV Parts",
            name: "122X Radiator PCB Board",
            sku: "13D74K44M",
            price: 150.00
        },
        {
            img: "/screw.png",
            tag: "Fasteners",
            name: "Arm Screw Pack M4*12",
            sku: "13D74K44M",
            price: 150.00
        },
        {
            img: "/gear.png",
            tag: "Equipments",
            name: "Bike Gear Metals",
            sku: "13D74K44M",
            price: 150.00
        },
        
    ];

    const [index, setIndex] = useState(0);
    const nextSlide = () => setIndex((prev) => (prev + 1) % data.length);
    const prevSlide = () => setIndex((prev) => (prev - 1 + data.length) % data.length);

    return (
        <div className="p-6 bg-white mt-5">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl md:text-4xl font-semibold">Our Featured Products</h2>
                <div className="flex space-x-2">
                    <button onClick={prevSlide} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                        <ChevronLeft size={30} />
                    </button>
                    <button onClick={nextSlide} className="p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600">
                        <ChevronRight size={30} />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                {data.map((item, i) => (
                    <FeaturedCard key={i} {...item} />
                ))}
            </div>
        </div>
    );
}

const FeaturedCard = ({ img, tag, name, sku, price }) => {
    return (
        <div className="relative rounded-xl overflow-hidden shadow-lg">
            <img src={img} alt={name} className="w-full h-48 object-cover" />
            <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                {tag}
            </div>
            <div className="p-4 bg-white">
                <h3 className="font-medium text-lg">{name}</h3>
                <p className="text-sm text-gray-500">SKU: {sku}</p>
                <p className="text-lg text-orange-500 font-semibold">${price.toFixed(2)}</p>
            </div>
        </div>
    );
};