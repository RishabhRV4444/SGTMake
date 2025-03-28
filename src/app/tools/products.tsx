interface Product {
    img: string;
    title: string;
    sku: string;
    price: number;
  }
  
  interface ProductsProps {
    products: Product[];
  }
  
  export default function Products({ products }: ProductsProps) {
    return (
      <div className="grid grid-cols-3 gap-4 p-4">
        {products.map((product, index) => (
          <ProductItem 
            key={index} 
            img={product.img} 
            title={product.title} 
            sku={product.sku} 
            price={product.price} 
          />
        ))}
      </div>
    );
  }
  
  interface ProductItemProps {
    img: string;
    title: string;
    sku: string;
    price: number;
  }
  
  function ProductItem({ img, title, sku, price }: ProductItemProps) {
    return (
      <div className="relative rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-all hover:shadow-sm cursor-pointer">
        {/* Image */}
        <img src={img} alt={title} className="w-full h-60 object-cover"/>
  
        {/* Info Section */}
        <div className="absolute bottom-1 m-2 p-2 bg-[#ffffff9d] backdrop-blur-md rounded-md w-60">
          <h2 className="text-md font-semibold">{title}</h2>
          <p className="text-gray-500 text-sm">SKU: {sku}</p>
          <p className="text-orange-500 font-bold">${price}</p>
        </div>
      </div>
    );
  }
  