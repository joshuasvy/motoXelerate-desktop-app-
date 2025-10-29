import { useEffect, useState } from "react";
import axios from "axios";
import PanelHeader from "../PanelHeader";
import AddItem from "../AddProduct";
import ProductCard from "../ProductCard";
import ProductModal from "../modals/ProductModal";

type BackendProduct = {
  _id: string;
  image: string;
  product_Name: string;
  product_Price: string;
  stock: number;
  category: string;
  product_Specification: string;
};

export default function Products() {
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [editingProduct, setEditingProduct] = useState<BackendProduct | null>(
    null
  );

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://api-motoxelerate.onrender.com/api/product"
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts(); // initial fetch

    const interval = setInterval(() => {
      if (!editingProduct) {
        fetchProducts(); // ✅ only refresh if modal is closed
      }
    }, 2000);

    return () => clearInterval(interval); // cleanup
  }, [editingProduct]);

  const handleEdit = (product: BackendProduct) => {
    setEditingProduct(product);
  };

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
            product={{
              id: product._id,
              name: product.product_Name,
              image: product.image,
              price: product.product_Price,
              stock: product.stock.toString(),
              category: product.category,
              specification: product.product_Specification,
            }}
            onEdit={() => handleEdit(product)}
          />
        ))}
      </div>

      <ProductModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onRefresh={fetchProducts}
        product={
          editingProduct && {
            id: editingProduct._id,
            name: editingProduct.product_Name,
            image: editingProduct.image,
            price: editingProduct.product_Price,
            stock: editingProduct.stock.toString(),
            specification: editingProduct.product_Specification, // ✅ added
            reviews: "4.5",
          }
        }
      />
    </div>
  );
}
