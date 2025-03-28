"use client"
import { useState } from "react";
import Connector from "./Connectors";

export default function WireSelector() {
  const [activeTab, setActiveTab] = useState("Harness Wires");
  
  const tabs = ["Harness Wires", "Silicon Wires", "Connectors"];

  return (
    <>
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Connectors & Wires</h2>
      <div className="flex space-x-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 border rounded ${
              activeTab === tab ? "border-orange-500 text-orange-500" : "border-gray-300"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {activeTab === "Harness Wires" && <WireOptions sizes={["0.35 SQ mm", "0.50 SQ mm", "1 SQ mm"]} colors={["Red", "Black", "Yellow", "Green", "Blue", "Pink", "Brown", "White"]} lengths={[5, 10, 30]} />}
      {activeTab === "Silicon Wires" && <WireOptions sizes={["8 AWG", "10 AWG", "12 AWG", "14 AWG"]} colors={["Red", "Black"]} lengths={[5, 10, 30]} />}
      {activeTab === "Connectors" &&  <div><Connector/></div> }
    </div>
    </>
  );
}

function WireOptions({ sizes, colors, lengths }: { sizes: string[]; colors: string[]; lengths: number[] }) {
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [length, setLength] = useState<number | null>(null);
  const [remarks, setRemarks] = useState("");

  return (
    <div>
     
      <div className="border-t pt-4">
        <h3 className="font-semibold">Size</h3>
        <div className="flex space-x-2 mt-2">
          {sizes.map((s) => (
            <button
              key={s}
              className={`px-3 py-1 border rounded ${size === s ? "bg-orange-500 text-white" : "border-gray-300"}`}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="border-t pt-4">
        <h3 className="font-semibold">Color</h3>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {colors.map((c) => (
            <button
              key={c}
              className={`px-3 py-1 border rounded ${color === c ? "bg-orange-500 text-white" : "border-gray-300"}`}
              onClick={() => setColor(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="border-t pt-4">
        <h3 className="font-semibold">Length (m)</h3>
        <div className="flex space-x-2 mt-2">
          {lengths.map((l) => (
            <button
              key={l}
              className={`px-3 py-1 border rounded ${length === l ? "bg-orange-500 text-white" : "border-gray-300"}`}
              onClick={() => setLength(l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="border-t pt-4">
        <h3 className="font-semibold">Remarks</h3>
        <textarea
          className="w-full border p-2 mt-2 rounded"
          placeholder="Write here"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>
      <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded">Add to Cart</button>
    </div>
  );
}
