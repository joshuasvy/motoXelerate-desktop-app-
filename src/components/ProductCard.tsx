type Product = {
  image: string;
  id: string;
  name: string;
  price: string;
  stock: string;
  category: string;
};

type ProductCardProps = {
  product: Product;
  onEdit: (product: Product) => void;
};

export default function ProductCard({ product, onEdit }: ProductCardProps) {
  return (
    <div className="bg-white h-full max-h-[360px] w-full max-w-[225px] rounded-md shadow-sm py-4 cursor-pointer hover:shadow-md transform hover:-translate-y-2 transition-all duration-300">
      <div>
        <img
          src={product.image}
          alt={product.name}
          className="w-[270px] h-[180px] object-contain rounded-t-xl"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/fallback.png";
          }}
        />
      </div>
      <div className="border border-gray-300 mx-3 my-4" />
      <div className="px-3">
        <div className="flex justify-between">
          <p className="text-[17px] font-medium line-clamp-2 border overflow-hidden">
            {product.name}
          </p>
          <div className="flex flex-row gap-3 mt-2">
            <p className="text-sm text-gray-600 ">Stock:</p>
            <p className="text-sm text-gray-400">{product.stock}</p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 mt-5">
          <p className="text-[13px] text-gray-600">Category: </p>
          <p className="text-md font-medium text-black">{product.category}</p>
        </div>
        <p className="text-lg font-medium text-red-500">{product.price}</p>
      </div>
      <div className="flex justify-end px-3">
        <button
          className="text-md font-medium text-green-500"
          onClick={() => onEdit(product)}
        >
          Edit
        </button>
      </div>
    </div>
  );
}
