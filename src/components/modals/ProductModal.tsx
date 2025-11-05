import { useEffect, useState } from "react";
import axios from "axios";
import SaveBtn from "../SaveBtn";
// import StarRating from "../StarRating";

type Product = {
  image: string;
  id: string;
  name: string;
  price: string;
  stock: string;
  category: string;
  specification: string;
  reviews: string;
};

type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onRefresh: () => void;
};

export default function ProductModal({
  isOpen,
  onClose,
  product,
  onRefresh,
}: ProductModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("tires");
  const [specification, setSpecification] = useState("");

  useEffect(() => {
    if (isOpen && product) {
      setName(product.name);
      setPrice(product.price);
      setStock(product.stock);
      setCategory(product.category);
      setSpecification(product.specification);
    }
    console.log("📦 Modal open state:", isOpen);
    console.log("📦 Product passed to modal:", product);
  }, [isOpen, product]);

  const handleSave = async () => {
    if (!product) return;

    const updatedProduct = {
      productName: name,
      price: Number(price.replace(/[₱,]/g, "")),
      stock: Number(stock),
      category,
      image: product.image,
      specification,
    };

    console.log("🛠 Sending update to backend:", updatedProduct);

    try {
      const res = await axios.put(
        `https://api-motoxelerate.onrender.com/api/product/${
          product.id
        }?t=${Date.now()}`,
        updatedProduct,
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        }
      );

      console.log("✅ Backend response:", res.data);
      onClose();
      onRefresh();
    } catch (err) {
      console.error("❌ Error updating product:", err);
      alert("Failed to update product.");
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-lg w-[900px] h-[670px] px-8 py-8 relative transform transition-all duration-300 ease-in-out translate-y-0 opacity-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-xl"
        >
          <img src="/images/icons/close.png" alt="Close" className="w-4" />
        </button>

        <h2 className="text-2xl font-semibold mb-6">{product.name}</h2>
        <div className="flex gap-8">
          <img
            src={product.image}
            alt={product.name}
            className="w-[300px] h-[300px] object-contain rounded border"
          />
          <div className="flex flex-col gap-4 w-[90%]">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-[90%] border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Price</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-[90%] border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-[90%] border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className={`w-[90%] mb-2 px-3 py-2 border rounded ${
                  category === "" ? "text-gray-400" : "text-gray-700"
                }`}
              >
                <option value="" disabled hidden>
                  Select Category
                </option>
                <option value="tires">Tires</option>
                <option value="brake system">Brake System</option>
                <option value="engine">Engine</option>
                <option value="pipe">Pipe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Specification
              </label>
              <textarea
                value={specification}
                onChange={(e) => setSpecification(e.target.value)}
                rows={4}
                className="w-[90%] border border-gray-300 rounded px-3 py-2 resize-none"
                placeholder="Describe the product"
              />
            </div>

            {/* <div>
              <p className="block text-sm text-gray-600 mb-2">Reviews</p>
              <StarRating rating={parseFloat(product.reviews)} size={16} />
            </div> */}
          </div>
        </div>

        <div className="mt-6">
          <SaveBtn icon="/images/icons/save.png" onPress={handleSave} />
        </div>
      </div>
    </div>
  );
}
