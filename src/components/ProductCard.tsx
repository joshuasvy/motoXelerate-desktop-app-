import type { BackendProduct } from "../types";
type ProductCardProps = {
  product: BackendProduct;
  onEdit: (product: BackendProduct) => void;
};
export default function ProductCard({ product, onEdit }: ProductCardProps) {
  if (!product.productName) {
    console.warn(`⚠️ Product ${product._id} has no name`, product);
  }
  return (
    <div className="flex flex-col justify-between bg-white h-[360px] w-full max-w-[225px] relative rounded-md shadow-sm py-4 cursor-pointer hover:shadow-md transform hover:-translate-y-2 transition-all duration-300">
      <div className="flex flex-col">
        <div className="flex justify-center">
          <img
            src={product.image}
            alt={product.productName}
            className="w-[160px] h-[160px] object-contain rounded-t-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/fallback.png";
            }}
          />
        </div>
        <div className="border border-gray-300 w-[205px]" />
        <div className="flex justify-between gap-3 px-3 my-3">
          <p className="text-[15px] font-medium line-clamp-2">
            {product.productName || "Unnamed Product"}
          </p>
          <div className="flex flex-row gap-2">
            <p className="text-[13px] text-gray-600 ">Stock:</p>
            <p className="text-[13px] text-gray-400">
              {product.stock.toString()}
            </p>
          </div>
        </div>
        <div className="absolute bottom-3 px-3">
          <div className="">
            <p className="text-[12px] text-gray-600 line-clamp-2">
              {product.specification}
            </p>
          </div>
          <div className="flex flex-row items-center gap-2 mt-3">
            <p className="text-[13px] text-gray-600">Category: </p>
            <p className="text-[13px] font-medium text-black">
              {product.category}
            </p>
          </div>
          <p className="text-lg font-medium text-red-500 mt-2">
            ₱{parseFloat(product.price.toString()).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex justify-end align-bottom px-3 relative">
        <button
          className="text-md font-medium text-green-500"
          onClick={() => {
            console.log("🟢 Edit button clicked for:", product);
            onEdit(product);
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
}
