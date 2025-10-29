import { useEffect, useState } from "react";
import SaveBtn from "../SaveBtn";

type Order = {
  id: string;
  name: string;
  date: string;
  total: string;
  payment: string;
  status: string;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: Order | null;
};

export default function RecentOrderModal({
  isOpen,
  onClose,
  selectedOrder,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Delay to trigger animation after mount
      requestAnimationFrame(() => setAnimateIn(true));
    } else {
      setAnimateIn(false);
      // Delay unmount until animation completes
      const timeout = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300">
      <div
        className={`bg-white rounded-lg shadow-lg w-[1100px] h-[600px] px-8 py-8 relative transform transition-all duration-300 ease-in-out ${
          animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-xl"
        >
          <img src="/images/icons/close.png" alt="Close" className="w-4" />
        </button>
        {selectedOrder && (
          <div className="">
            <h2 className="text-2xl font-semibold mb-5">Recent Orders</h2>
            <div className="flex flex-row flex-wrap gap-4 text-sm text-gray-600 font-medium mb-3">
              <div className="text-lg min-w-[160px]">Order ID</div>
              <div className="text-lg min-w-[150px]">Name</div>
              <div className="text-lg min-w-[160px]">Date</div>
              <div className="text-lg min-w-[115px]">Total</div>
              <div className="text-lg min-w-[200px]">Payment Method</div>
              <div className="text-lg min-w-[120px]">Status</div>
            </div>

            <div className="flex flex-row flex-wrap gap-4 text-sm pt-4 border-t border-gray-200">
              <div className="min-w-[160px]">
                <p className="text-[16px] font-semibold">{selectedOrder.id}</p>
              </div>
              <div className="min-w-[150px]">
                <p className="text-[16px] font-semibold">
                  {selectedOrder.name}
                </p>
              </div>
              <div className="min-w-[160px]">
                <p className="text-[16px] font-semibold">
                  {selectedOrder.date}
                </p>
              </div>
              <div className="min-w-[115px]">
                <p className="text-[16px] font-semibold">
                  {selectedOrder.total}
                </p>
              </div>
              <div className="min-w-[200px]">
                <p className="text-[16px] font-semibold">
                  {selectedOrder.payment}
                </p>
              </div>
              <div className="min-w-[120px]">
                <select
                  defaultValue={selectedOrder.status}
                  onChange={(e) => console.log("Selected:", e.target.value)}
                  className="text-[15px] font-semibold text-black cursor-pointer bg-transparent border border-gray-500 rounded-md p-1"
                >
                  <option value="For approval">For approval</option>
                  <option value="To ship">To ship</option>
                  <option value="Ship">Ship</option>
                  <option value="Completed">Completed</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        )}
        <SaveBtn />
      </div>
    </div>
  );
}
