import { useEffect, useState } from "react";
import axios from "axios";
import PanelHeader from "../PanelHeader";
import AddItem from "../AddItem";
import ProductCard from "../ProductCard";
import ProductModal from "../modals/ProductModal";
import FilteringBtn from "../FilteringBtn";

interface BackendProduct {
  _id: string;
  productName: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  specification: string;
  reviews: string;
}

export default function Products() {
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [editingProduct, setEditingProduct] = useState<BackendProduct | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://api-motoxelerate.onrender.com/api/product"
      );
      setProducts(res.data);
      console.log("✅ Products fetched:", res.data);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();

    const interval = setInterval(() => {
      if (!isModalOpen) {
        fetchProducts();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isModalOpen]);

  const handleEdit = (product: BackendProduct) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const modalProduct = editingProduct
    ? {
        id: editingProduct._id,
        name: editingProduct.productName,
        image: editingProduct.image,
        price: editingProduct.price.toString(),
        stock: editingProduct.stock.toString(),
        category: editingProduct.category,
        specification: editingProduct.specification,
        reviews: editingProduct.reviews || "4.5",
      }
    : null;

  // 🧹 Apply category + search filter
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      filter === "All" || p.category.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.specification.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <PanelHeader name="Products" />
      <div className="flex justify-between items-center my-8">
        <AddItem name="Add Product" />
        {/* search input to */}
        <div className="relative w-full sm:w-[300px]">
          <img
            src="/images/icons/search.png"
            alt="Search"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-md border border-gray-400 rounded-md shadow pl-12 pr-3 py-2 w-full focus:ring-1 focus:ring-black focus:outline-none"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        {/* category filtering button */}
        <div className="flex gap-3">
          <FilteringBtn
            label="All"
            isActive={filter === "All"}
            onClick={() => setFilter("All")}
          />
          <FilteringBtn
            label="Tires"
            isActive={filter === "Tires"}
            onClick={() => setFilter("Tires")}
          />
          <FilteringBtn
            label="Brake System"
            isActive={filter === "Brake System"}
            onClick={() => setFilter("Brake System")}
          />
          <FilteringBtn
            label="Engine"
            isActive={filter === "Engine"}
            onClick={() => setFilter("Engine")}
          />
          <FilteringBtn
            label="Pipe"
            isActive={filter === "Pipe"}
            onClick={() => setFilter("Pipe")}
          />
        </div>
      </div>

      {/* Product grid */}
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-6 ">
        {" "}
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 italic">
            {" "}
            No products found for {filter}{" "}
            {searchTerm && `matching "${searchTerm}"`}.{" "}
          </p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={handleEdit}
            />
          ))
        )}{" "}
      </div>

      {isModalOpen && modalProduct && (
        <ProductModal
          isOpen={true}
          onClose={handleCloseModal}
          onRefresh={fetchProducts}
          product={modalProduct}
        />
      )}
    </div>
  );
}
