'use client';

import { useState } from 'react';
import { Upload, Plus, Minus } from 'lucide-react';

export default function CNCOrderForm() {
  const [selectedTab, setSelectedTab] = useState<string>('CNC Machining');
  const [material, setMaterial] = useState<string | null>(null);
  const [surfaceFinish, setSurfaceFinish] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [remarks, setRemarks] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const tabs: string[] = ['CNC Machining', 'Laser Cutting', '3D Designing'];
  const materials: string[] = ['MS Steel', 'Aluminium', 'Copper', 'Plastic'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleSubmit = () => {
    const collectedData = { selectedTab, material, surfaceFinish, quantity, remarks, file };
    console.log('Submitted Data:', collectedData);
  };

  return (
    <>
      <div className="p-6 max-w-lg mx-auto font-sans">
        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedTab === tab ? 'border border-orange-500 text-orange-500' : 'border border-gray-300 text-gray-700'
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* File Upload */}
        <div className="border border-gray-300 p-12 rounded-lg text-center mb-4 bg-gray-100">
          <input type="file" id="file" className="hidden" onChange={handleFileUpload} />
          <label
            htmlFor="file"
            className="cursor-pointer flex items-center justify-center bg-orange-100 px-4 py-2 rounded-md text-orange-600 text-sm"
          >
            <Upload className="w-5 h-5 mr-2" /> Upload Your File
          </label>
          {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
        </div>

        {/* Material Selection */}
        <div className="mb-4">
          <p className="font-medium mb-2">Material</p>
          <div className="flex gap-2">
            {materials.map((mat) => (
              <button
                key={mat}
                className={`px-3 py-1 rounded-md text-sm ${
                  material === mat ? 'bg-orange-500 text-white' : 'border border-gray-300 text-gray-700'
                }`}
                onClick={() => setMaterial(mat)}
              >
                {mat}
              </button>
            ))}
          </div>
        </div>

        {/* Surface Finish */}
        <div className="mb-4">
          <p className="font-medium mb-2">Surface Finish</p>
          <div className="flex gap-2">
            <button 
              className={`px-4 py-2 rounded-md ${surfaceFinish === 'Yes' ? 'bg-orange-500 text-white' : 'border border-gray-300 text-gray-700'}`}
              onClick={() => setSurfaceFinish('Yes')}
            >Yes</button>
            <button 
              className={`px-4 py-2 rounded-md ${surfaceFinish === 'No' ? 'bg-orange-500 text-white' : 'border border-gray-300 text-gray-700'}`}
              onClick={() => setSurfaceFinish('No')}
            >No</button>
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <p className="font-medium mb-2">Quantity (pcs)</p>
          <div className="flex items-center gap-3">
            <button className="p-2 border border-gray-300 rounded-md" onClick={decrementQuantity}><Minus /></button>
            <span className="text-lg">{quantity}</span>
            <button className="p-2 border border-gray-300 rounded-md" onClick={incrementQuantity}><Plus /></button>
          </div>
        </div>

        <div className="mb-4">
          <p className="font-medium mb-2">Remarks</p>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2"
            rows={3}
            placeholder="Write here"
            value={remarks}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRemarks(e.target.value)}
          ></textarea>
        </div>

        <button className="bg-orange-500 text-white w-full py-2 rounded-md text-sm font-medium" onClick={handleSubmit}>
          Add to Cart
        </button>
      </div>
    </>
  );
}
