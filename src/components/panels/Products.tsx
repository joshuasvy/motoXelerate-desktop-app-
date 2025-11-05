import { useEffect, useState } from "react";
import axios from "axios";
import PanelHeader from "../PanelHeader";
import AddItem from "../AddProduct";
import ProductCard from "../ProductCard";
import ProductModal from "../modals/ProductModal";

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

  useEffect(() => {
    console.log("🧩 Modal state changed:");
    console.log("   isModalOpen:", isModalOpen);
    console.log("   editingProduct:", editingProduct);
  }, [isModalOpen, editingProduct]);

  const handleEdit = (product: BackendProduct) => {
    console.log("🟢 handleEdit called with:", product);
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("🔴 Modal closed");
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

  return (
    <div>
      <PanelHeader name="Products" />
      <div className="my-8">
        <AddItem />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={handleEdit}
          />
        ))}
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
