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
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold">Customer Log</h2>
        <img
          src="/images/icons/members.png"
          alt="Customer Log"
          className="w-7"
        />
      </div>

      {/* Labels */}
      <div className="grid grid-cols-[2fr_2fr_2fr_3fr_3fr_1fr] text-sm text-gray-600 font-medium mb-3">
        <div>Customer ID</div>
        <div>Name</div>
        <div>Contact</div>
        <div>Email</div>
        <div>Address</div>
        <div>Action</div>
      </div>

      {/* Values */}
      {customers.length === 0 ? (
        <p className="text-gray-500 italic">No customers found.</p>
      ) : (
        customers.map((customer) => (
          <div
            key={customer.id}
            className="grid grid-cols-[2fr_2fr_2fr_3fr_3fr_1fr] text-sm py-2 border-t border-gray-100 items-center"
          >
            <div className="font-semibold truncate">{customer.id}</div>
            <div className="font-semibold truncate">{customer.name}</div>
            <div className="font-semibold truncate">{customer.contact}</div>
            <div className="font-semibold truncate">{customer.email}</div>
            <div className="font-semibold truncate">{customer.address}</div>
            <div>
              <button
                onClick={() => handleEdit(customer)}
                className="font-semibold text-blue-700 hover:underline"
              >
                View
              </button>
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
      />
    </div>
  );
}
