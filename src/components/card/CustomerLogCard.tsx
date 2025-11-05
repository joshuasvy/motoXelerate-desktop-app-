import { useState } from "react";
import CustomerModal from "../modals/CustomerModal";

type Customer = {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
};

type CustomerLogCardProps = {
  customers: Customer[];
};

export default function CustomerLogCard({ customers }: CustomerLogCardProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-lg">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold">Customer Log</h2>
        <img
          src="/images/icons/members.png"
          alt="Customer Log"
          className="w-7"
        />
      </div>

      <div className="flex flex-row flex-wrap gap-6 text-sm text-gray-600 font-medium mb-3 mt-2">
        <div className="w-[180px] ">Customer ID</div>
        <div className="w-[135px]  ">Name</div>
        <div className="w-[150px]  ">Contact</div>
        <div className="w-[180px]  ">Email</div>
        <div className="w-[240px]  ">Address</div>
        <div className="w-fit ml-2">Action</div>
      </div>

      {customers.map((customer) => (
        <div
          key={customer.id}
          className="flex flex-row flex-wrap gap-6 mb-3 text-sm"
        >
          <div className="w-[180px]  ">
            <p className="font-semibold truncate">{customer.id}</p>
          </div>
          <div className="w-[135px]  truncate">
            <p className="font-semibold">{customer.name}</p>
          </div>
          <div className="min-w-[150px] ">
            <p className="font-semibold">{customer.contact}</p>
          </div>
          <div className="min-w-[180px] ">
            <p className="font-semibold truncate whitespace-nowrap overflow-hidden w-[160px]">
              {customer.email}
            </p>
          </div>
          <div className="min-w-[195px] ">
            <p className="font-semibold truncate whitespace-nowrap overflow-hidden w-[240px]">
              {customer.address}
            </p>
          </div>
          <div className="w-fit  ml-2">
            <button
              onClick={() => handleEdit(customer)}
              className="font-semibold text-blue-700 hover:underline"
            >
              View
            </button>
          </div>
        </div>
      ))}

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
      />
    </div>
  );
}
