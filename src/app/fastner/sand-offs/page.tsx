'use client';

import { useState } from 'react';

const SandOffSelector = () => {
  const [selectedOptions, setSelectedOptions] = useState({
    size: '',
    length:'',
    threadLength:'',
    material: '',
    quantity: 1,
    remarks: '',
  });

  const toggleSelection = (category, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [category]: prev[category] === value ? '' : value
    }));
  };

  const handleQuantityChange = (change) => {
    setSelectedOptions((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + change),
    }));
  };

  const handleAddToCart = () => {
    console.log('Selected Options:', selectedOptions);
    alert('Item added to cart!');
  };

  return (
    <div className="p-7 max-w-lg mx-auto bg-white shadow-lg rounded-lg space-y-4">
      

      {/* Size */}
      <h2 className="text-lg font-bold">Size</h2>
      <p className='text-sm text-gray-400'>Email us for more sizes which are not available here</p>
      <div className="flex flex-wrap gap-2">
        {["M3", "M4", "M5", "M6"].map((size) => (
          <button
            key={size}
            className={`p-2 border rounded-lg transition ${
              selectedOptions.size === size ? 'bg-orange-500 text-white' : 'hover:bg-gray-200'
            }`}
            onClick={() => toggleSelection('size', size)}
          >
            {size}
          </button>
        ))}
      </div>
    
    {/* Length */}
    <h2 className="text-lg font-bold">Length (mm)</h2>
      <div className="flex flex-wrap gap-2">
        {[5, 10, 12, 15,20].map((len) => (
          <button
            key={len}
            className={`p-2 border rounded-lg transition ${
              selectedOptions.length === len ? 'bg-orange-500 text-white' : 'hover:bg-gray-200'
            }`}
            onClick={() => toggleSelection('length', len)}
          >
            {len}
          </button>
        ))}
      </div>

      {/* Thread Length */}
      <h2 className="text-lg font-bold">Thread Length (mm)</h2>
      <div className="flex flex-wrap gap-2">
        {[5, 10].map((len) => (
          <button
            key={len}
            className={`p-2 border rounded-lg transition ${
              selectedOptions.threadLength === len ? 'bg-orange-500 text-white' : 'hover:bg-gray-200'
            }`}
            onClick={() => toggleSelection('threadLength', len)}
          >
            {len}
          </button>
        ))}
      </div>
     

      {/* Material Type */}
      <h2 className="text-lg font-bold">Material Type</h2>
      <div className="flex flex-wrap gap-2">
        {["Blackened", "Zinc Coated", "Brass", "Stainless Steel"].map((material) => (
          <button
            key={material}
            className={`p-2 border rounded-lg transition ${
              selectedOptions.material === material ? 'bg-orange-500 text-white' : 'hover:bg-gray-200'
            }`}
            onClick={() => toggleSelection('material', material)}
          >
            {material}
          </button>
        ))}
      </div>

      {/* Quantity */}
      <h2 className="text-lg font-bold">Quantity (pcs)</h2>
      <div className="flex items-center gap-2">
        <button className="p-2 border rounded-lg hover:bg-gray-200" onClick={() => handleQuantityChange(-1)}>-</button>
        <span className="px-4 py-2 border rounded">{selectedOptions.quantity}</span>
        <button className="p-2 border rounded-lg hover:bg-gray-200" onClick={() => handleQuantityChange(1)}>+</button>
      </div>

      {/* Remarks */}
      <h2 className="text-lg font-bold">Remarks</h2>
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Write here"
        value={selectedOptions.remarks}
        onChange={(e) => setSelectedOptions({ ...selectedOptions, remarks: e.target.value })}
      />

      {/* Add to Cart */}
      <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-md p-2" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
};

export default SandOffSelector;
