'use client';

import { useState, ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

export default function BatteryPackForm() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Battery Packs Inquiry</h1>

        {/* File Upload */}
        <div className="border border-gray-300 p-12 rounded-lg text-center bg-gray-100 mb-6">
          <input type="file" id="file" className="hidden" onChange={handleFileUpload} />
          <label
            htmlFor="file"
            className="cursor-pointer flex items-center justify-center bg-orange-100 px-4 py-2 rounded-md text-orange-600 text-sm"
          >
            <Upload className="w-5 h-5 mr-2" /> Upload Your File
          </label>
          {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Chemistry</label>
            <div className="flex gap-2 mt-1">
              {['NCM', 'NCA', 'LifePO4', 'LIPO'].map((type) => (
                <button key={type} className="px-3 py-1 border rounded-md text-sm">
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-medium">Cell Brand</label>
            <input
              type="text"
              className="w-full border p-2 rounded-md mt-1"
              placeholder="Write here"
            />
          </div>

          {[
            'Battery Series Config.(2S-200S)',
            'Battery Parallel Config.(1Ah-1000Ah)',
            'Normal Discharge Required',
            'Peak Discharge Required',
            'Charging',
            'Life-cycle Expantency',
            'Pack Voltage Nominal',
            'BMS of Choice',
            'No. of Modulus',
          ].map((field, index) => (
            <div key={index}>
              <label className="block font-medium">{field}</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md mt-1"
                placeholder="Write here"
              />
            </div>
          ))}

          <div>
            <label className="block font-medium">Dimensions (mm)</label>
            <div className="flex gap-2 mt-1">
              {['H', 'W', 'L'].map((dim) => (
                <input
                  key={dim}
                  type="text"
                  className="w-1/3 border p-2 rounded-md"
                  placeholder={dim}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block font-medium">Additional Information</label>
          <textarea
            className="w-full border p-2 rounded-md mt-1"
            placeholder="Write here"
            rows={3}
          ></textarea>
        </div>

        <button className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600">
          Submit
        </button>
      </div>
    </>
  );
}