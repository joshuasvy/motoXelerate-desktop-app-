import { useState } from "react";
import AddItemModal from "./modals/AddItemModal";

export default function AddItem({ name }: { name: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-white font-medium rounded-lg shadow-md px-6 py-4 flex items-center gap-3 cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        <img src="/images/icons/add.png" alt="Add Product" className="w-6" />
        {name}
      </button>

      <AddItemModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
