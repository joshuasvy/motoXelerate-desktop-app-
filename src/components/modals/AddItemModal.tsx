import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SaveBtn from "../SaveBtn";

type AddProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddItemModal({
  isOpen,
  onClose,
}: AddProductModalProps) {
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [specification, setSpecification] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => setAnimateIn(true));
    } else {
      setAnimateIn(false);
      const timeout = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!imageFile) {
        console.warn("No image file selected.");
        return alert("Please upload an image");
      }

      console.log("Uploading image to Cloudinary...");

      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "MotoXelerate");

      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dhh37ekzf/image/upload",
        formData
      );

      console.log("Cloudinary response:", uploadRes.data);

      const imageUrl = uploadRes.data.secure_url;
      if (!imageUrl) {
        console.error("Image upload failed: secure_url not returned.");
        return alert("Image upload failed.");
      }

      const productData = {
        productName: productName,
        image: imageUrl,
        price: parseFloat(price.toString().replace(/,/g, "")),
        stock: parseInt(stock.toString()),
        category: category,
        specification: specification,
      };

      if (!category) {
        alert("Please select a category.");
        return;
      }

      console.log("Submitting product to backend:", productData);

      const response = await axios.post(
        "https://api-motoxelerate.onrender.com/api/product",
        productData
      );

      console.log("Backend response:", response.data);

      alert("Product created successfully!");
      onClose();
    } catch (err) {
      console.error("Error submitting product:", err);
      if (err.response) {
        console.error("Backend error response:", err.response.data);
      }
      alert("Failed to create product.");
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300">
      <div
        className={`bg-white rounded-lg shadow-lg w-[1000px] h-[565px] px-8 py-8 relative transform transition-all duration-300 ease-in-out ${
          animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-xl"
        >
          <img src="/images/icons/close.png" alt="Close" className="w-4" />
        </button>
        <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
        <div className="flex">
          <div
            onClick={handleUploadClick}
            className="w-[200px] h-[200px] mr-8 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-600 transition-all"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-contain rounded-md"
              />
            ) : (
              <p className="text-gray-500 font-medium text-center">
                Upload an Image
              </p>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="flex flex-row gap-4 w-[70%]">
            <div className="flex flex-col w-full gap-2">
              <label>Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2 text-[15px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label>Price</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 text-[15px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col w-full gap-2">
              <div className="mb-3">
                <label>Item Stock</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3 py-2 text-[15px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full mb-2 px-3 py-2 border rounded text-gray-700"
                >
                  <option value="" disabled hidden className="text-gray-400">
                    Select Category
                  </option>
                  <option value="tires">Tires</option>
                  <option value="brake system">Brake System</option>
                  <option value="engine">Engine</option>
                  <option value="pipe">Pipe</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-5">
          <label>Specification</label>
          <textarea
            rows={4}
            value={specification}
            onChange={(e) => setSpecification(e.target.value)}
            placeholder="Describe your product"
            className="px-3 py-2 text-[15px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="mt-6">
          <SaveBtn icon="/images/icons/save.png" onPress={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
