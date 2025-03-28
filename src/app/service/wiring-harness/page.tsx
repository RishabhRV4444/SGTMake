"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";

export default function WiringHarnessForm() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    leftConnector: { housing: "", terminal: "", newConnector: "" },
    rightConnector: { housing: "", terminal: "", newConnector: "" },
    wire: { awg: "", length: "", color: "Black", twisted: false, customColor: "" },
    quantity: 1,
  });

  const handleFileUpload = (e) => setFile(e.target.files[0]);
  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };
  
  const handleSubmit = () => console.log("Form Data:", formData);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Wiring Harness</h1>

        {/* File Upload Section */}
        <div className="border border-gray-300 p-12 rounded-lg text-center bg-gray-100 mb-6">
          <input type="file" id="file" className="hidden" onChange={handleFileUpload} />
          <label htmlFor="file" className="cursor-pointer flex items-center justify-center bg-orange-100 px-4 py-2 rounded-md text-orange-600 text-sm">
            <Upload className="w-5 h-5 mr-2" /> Upload Your File
          </label>
          {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-md">Get a Quote</button>

        {/* Process Section */}
        <h2 className="text-2xl my-6">Our Process</h2>
        <div className="flex flex-wrap gap-4">
          {processSteps.map((step, index) => (
            <Card key={index} img={step.img} title={step.title} />
          ))}
        </div>

        {/* Cable Selection Form */}
        <h2 className="text-2xl my-6">Cable Selection</h2>
       <p className="text-slate-400 text-sm mt-3">Please fill in the part number according to your cable requirements. If you are not sure about the specific part number of the housing, Click here.</p>

       <div className="">
        <ConnectorForm side={"Left"}/>
       </div>


        {/* Wire Selection */}
        <div className="">
        <WireForm/>
        </div>
        

        <div className="">
        <ConnectorForm side={"Rigth"}/>
       </div>

        {/* Quantity Selection */}
        <h2 className="text-xl mt-6">Quantity</h2>
        <div className="flex items-center gap-4">
          <button onClick={() => setFormData((prev) => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}>-</button>
          <span>{formData.quantity}</span>
          <button onClick={() => setFormData((prev) => ({ ...prev, quantity: prev.quantity + 1 }))}>+</button>
        </div>

        {/* Submit Button */}
        <button className="bg-orange-500 text-white px-4 py-2 rounded-md mt-6" onClick={handleSubmit}>
          Confirm Cable Plan
        </button>
      </div>
    </>
  );
}

// Card Component
function Card({ img, title }) {
  return (
    <div className="rounded-lg border p-3 flex flex-col items-center w-35 text-center">
      <Image width={55} height={55} src={img} alt={title} className="mb-2" />
      <span className="font-bold text-sm">{title}</span>
    </div>
  );
}

// Process Steps Data
const processSteps = [
  { img: "/customcable.png", title: "Custom Cables" },
  { img: "/confirmplan.png", title: "Confirm Plan" },
  { img: "/production.png", title: "In Production" },
  { img: "/transpot.png", title: "Transportation" },
  { img: "/delivered.png", title: "Delivered" },
];

 function ConnectorForm({side}) {
    return (
      <div className="p-7 border rounded-xl mt-4 bg-[#FAFAFA]">
        <div className="flex items-center space-x-6">
          {/* Left Connector Label */}
          <span className="font-semibold text-lg">{side} connector</span>
  
          {/* Housing Part Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Housing Part</label>
            <select className="border rounded-md px-3 py-2 w-48">
              <option>Select</option>
            </select>
          </div>
  
          {/* Terminal Part Number Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Terminal Part Number</label>
            <select className="border rounded-md px-3 py-2 w-48">
              <option>Select</option>
            </select>
          </div>
  
          {/* Add New Connector Button */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Add New Connector</label>
            <button className="flex items-center border rounded-md px-4 py-2 w-48 text-gray-500">
              + Add
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  function WireForm() {
    return (
      <div className=" p-4 border rounded-xl mt-4 bg-[#FAFAFA]">
        <div className="flex flex-col">
          {/* Wire Label */}
          <span className="font-semibold text-lg mb-4">Wire</span>
  
          <div className="flex items-center space-x-6">
            {/* AWG Dropdown */}
            <div className="flex flex-col">
              <label className="text-sm font-medium">AWG</label>
              <select className="border rounded-md px-3 py-2 w-48">
                <option>Select</option>
              </select>
            </div>
  
            {/* Length Dropdown */}
            <div className="flex flex-col">
              <label className="text-sm font-medium">Length</label>
              <select className="border rounded-md px-3 py-2 w-48">
                <option>Select</option>
              </select>
            </div>
  
            {/* Color Options */}
            <div className="flex flex-col">
              <label className="text-sm font-medium">Color</label>
              <div className="flex space-x-2">
                <button className="border rounded-md px-4 py-2 bg-gray-200 text-black">Black</button>
                <button className="border rounded-md px-4 py-2 bg-gray-200 text-black">Black</button>
                <button className="border rounded-md px-4 py-2 bg-gray-200 text-black">Black</button>
              </div>
            </div>
          </div>
  
          <div className="flex items-center space-x-6 mt-5">
            {/* Twisted Option */}
            <div className="flex flex-col">
              <label className="text-sm font-medium">Twisted</label>
              <div className="flex space-x-2">
                <button className="border rounded-md px-4 py-2 bg-gray-200 text-black">Yes</button>
                <button className="border rounded-md px-4 py-2 bg-gray-200 text-black">No</button>
              </div>
            </div>
  
            {/* Customize Color Input */}
            <div className="flex flex-col">
              <label className="text-sm font-medium">Customize Color</label>
              <input
                type="text"
                placeholder="Enter Color"
                className="border rounded-md px-3 py-2 w-48"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }