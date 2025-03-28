export const QS8 = () => {
    return <>
          <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Type</label>
            <div className="flex gap-2 mt-2">
              {["Male", "Female", "Set"].map((type) => (
                <button key={type} className="px-4 py-2 border rounded-md hover:bg-gray-100">
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Quantity (pcs)</label>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 border rounded-md">-</button>
              <span className="px-4 py-2 border rounded-md">1</span>
              <button className="px-3 py-1 border rounded-md">+</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Remarks</label>
            <textarea className="w-full p-2 border rounded-md mt-2" placeholder="Write here..."></textarea>
          </div>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-md mt-4">Add to Cart</button>
        </div>
    </>
}

export const QS10 = () => {
    return<>
      <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Type</label>
            <div className="flex gap-2 mt-2">
              {["Male", "Female", "Set"].map((type) => (
                <button key={type} className="px-4 py-2 border rounded-md hover:bg-gray-100">
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Quantity (pcs)</label>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 border rounded-md">-</button>
              <span className="px-4 py-2 border rounded-md">1</span>
              <button className="px-3 py-1 border rounded-md">+</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Remarks</label>
            <textarea className="w-full p-2 border rounded-md mt-2" placeholder="Write here..."></textarea>
          </div>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-md mt-4">Add to Cart</button>
        </div>
    </>
}

export const BulletConnector =()=>{
    return <>
          <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Type</label>
            <div className="flex gap-2 mt-2">
              {["Male", "Female", "Set"].map((type) => (
                <button key={type} className="px-4 py-2 border rounded-md hover:bg-gray-100">
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Size</label>
            <div className="px-4 py-2 border rounded-md w-max mt-2">8 mm</div>
          </div>
          <div>
            <label className="block text-sm font-medium">Quantity (pcs)</label>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 border rounded-md">-</button>
              <span className="px-4 py-2 border rounded-md">1</span>
              <button className="px-3 py-1 border rounded-md">+</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Remarks</label>
            <textarea className="w-full p-2 border rounded-md mt-2" placeholder="Write here..."></textarea>
          </div>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-md mt-4">Add to Cart</button>
        </div>
    </>
}

export const ChogoryConnector=()=>{
    return<>
         <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Quantity (pcs)</label>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 border rounded-md">-</button>
              <span className="px-4 py-2 border rounded-md">1</span>
              <button className="px-3 py-1 border rounded-md">+</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Remarks</label>
            <textarea className="w-full p-2 border rounded-md mt-2" placeholder="Write here..."></textarea>
          </div>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-md mt-4">Add to Cart</button>
        </div>
    </>
}

export const TycoConnectors=()=>{
    return <>
        <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium">Pins</label>
            <div className="flex gap-2 mt-2">
              {[1,2,3,4,5,6].map((type) => (
                <button key={type} className="px-4 py-2 border rounded-md hover:bg-gray-100">
                  {type}
                </button>
              ))}
            </div>
            <label className="block text-sm font-medium">Type</label>
            <div className="flex gap-2 mt-2">
              {["Male", "Female", "Set"].map((type) => (
                <button key={type} className="px-4 py-2 border rounded-md hover:bg-gray-100">
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Size</label>
            <div className="px-4 py-2 border rounded-md w-max mt-2">8 mm</div>
          </div>
          <div>
            <label className="block text-sm font-medium">Quantity (pcs)</label>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 border rounded-md">-</button>
              <span className="px-4 py-2 border rounded-md">1</span>
              <button className="px-3 py-1 border rounded-md">+</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Remarks</label>
            <textarea className="w-full p-2 border rounded-md mt-2" placeholder="Write here..."></textarea>
          </div>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-md mt-4">Add to Cart</button>
        </div> 
    </>
}