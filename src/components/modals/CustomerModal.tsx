import { useEffect, useState } from "react";

type Customer = {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
  orderId: string;
  product: string;
  date: string;
  total: number;
  payment: string;
  status: string;
};

type CustomerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
};

export default function CustomerModal({
  isOpen,
  onClose,
  customer,
}: CustomerModalProps) {
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen && customer) {
      setMounted(true);
      requestAnimationFrame(() => setAnimateIn(true));
    } else {
      setAnimateIn(false);
      const timeout = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, customer]);

  if (!mounted || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className={`bg-white rounded-lg shadow-lg w-[1450px] h-[700px] p-6 relative transform transition-all duration-300 ease-in-out ${
          animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-7 right-6 text-gray-500 hover:text-gray-800 text-xl"
        >
          <img src="/images/icons/close.png" alt="Close" className="w-5" />
        </button>
        {customer && (
          <div className="overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">Customer Profile</h2>
            <div className="flex">
              <div className="flex flex-col w-[500px] h-[580px] border-r-2 border-gray-400">
                <div className="py-20">
                  <img
                    src="/images/logo/Starter pfp.jpg"
                    alt="Logo"
                    className="w-[180px] object-fill justify-center mx-auto rounded-full"
                  />
                </div>
                <div className="flex justify-between px-11">
                  <div className="flex flex-col">
                    <p className="text-[17px] font-medium whitespace-nowrap mb-2">
                      Customer ID
                    </p>
                    <p className="text-[17px] font-medium mb-2">Name</p>
                    <p className="text-[17px] font-medium mb-2">Contact</p>
                    <p className="text-[17px] font-medium mb-2">Email</p>
                    <p className="text-[17px] font-medium mb-2">Address</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[17px] font-medium mb-2">
                      <span>
                        : <span>{customer.id}</span>
                      </span>
                    </p>
                    <p className="text-[17px] font-medium mb-2">
                      <span>
                        : <span>{customer.name}</span>
                      </span>
                    </p>
                    <p className="text-[17px] font-medium mb-2">
                      <span>
                        : <span>{customer.contact}</span>
                      </span>
                    </p>
                    <p className="text-[17px] font-medium mb-2">
                      <span>
                        : <span>{customer.email}</span>
                      </span>
                    </p>
                    <p className="text-[17px] font-medium whitespace-wrap w-[205px]">
                      <span>
                        : <span>{customer.address}</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div className="px-6">
                  <div className="flex flex-row gap-4 text-sm text-gray-600 font-medium mb-3">
                    <div className="text-md min-w-[130px]">Order ID</div>
                    <div className="text-md min-w-[140px]">Product</div>
                    <div className="text-md min-w-[140px]">Date</div>
                    <div className="text-md min-w-[115px]">Total</div>
                    <div className="text-md line-clamp-2 min-w-[160px]">
                      Payment Method
                    </div>
                    <div className="text-md min-w-[120px]">Status</div>
                  </div>
                  <div className="flex flex-row flex-wrap gap-4 text-sm mt-2">
                    <div className="min-w-[130px]">
                      <p className="text-md font-semibold whitespace-nowrap truncate w-[100px]">
                        {customer.orderId}
                      </p>
                    </div>
                    <div className="min-w-[140px]">
                      <p className="text-md font-semibold whitespace-nowrap truncate w-[120px]">
                        {customer.product}
                      </p>
                    </div>
                    <div className="min-w-[140px]">
                      <p className="text-md font-semibold">{customer.date}</p>
                    </div>
                    <div className="min-w-[115px]">
                      <p className="text-md font-semibold">{customer.total}</p>
                    </div>
                    <div className="min-w-[160px]">
                      <p className="text-md] font-semibold">
                        {customer.payment}
                      </p>
                    </div>
                    <div className="min-w-[120px]">
                      <p className="text-md font-semibold">{customer.status}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-700 mx-6 h-[270px]">
                  <div className="mt-4">
                    <div className="flex flex-row gap-4 text-sm text-gray-600 font-medium mb-3">
                      <div className="text-md min-w-[130px]">Service ID</div>
                      <div className="text-md min-w-[140px]">Service</div>
                      <div className="text-md min-w-[140px]">Price</div>
                      <div className="text-md line-clamp-2 min-w-[115px]">
                        Payment Method
                      </div>
                      <div className="text-md  min-w-[160px]">Date</div>
                      <div className="text-md min-w-[120px]">Status</div>
                    </div>

                    <div className="flex flex-row flex-wrap gap-4 text-sm mt-2">
                      <div className="min-w-[130px]">
                        <p className="text-md font-semibold whitespace-nowrap truncate w-[100px]">
                          {customer.orderId}
                        </p>
                      </div>
                      <div className="min-w-[140px]">
                        <p className="text-md font-semibold whitespace-nowrap truncate w-[120px]">
                          {customer.product}
                        </p>
                      </div>
                      <div className="min-w-[140px]">
                        <p className="text-md font-semibold">{customer.date}</p>
                      </div>
                      <div className="min-w-[115px]">
                        <p className="text-md font-semibold">
                          {customer.total}
                        </p>
                      </div>
                      <div className="min-w-[160px]">
                        <p className="text-md] font-semibold">
                          {customer.payment}
                        </p>
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-md font-semibold">
                          {customer.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
