import type { Invoice } from "../../../types/Invoice";

type InvoiceProps = {
  invoice?: Invoice;
  onBack: () => void;
};

export default function Invoice({ invoice, onBack }: InvoiceProps) {
  if (!invoice) {
    console.warn("⚠️ Invoice panel rendered without invoice data");
    return <div className="p-4 text-gray-500">No invoice data available.</div>;
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-row gap-2 items-center">
          <button onClick={onBack} aria-label="Go back">
            <img
              src="/images/icons/back.png"
              alt="Back"
              className="w-8 h-8 cursor-pointer hover:opacity-80 transition"
            />
          </button>
          <h2 className="text-2xl font-bold">
            Invoice #{invoice.invoiceNumber}
          </h2>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-6 text-sm space-y-1">
        <p>
          <span className="font-medium">Customer:</span> {invoice.customerName}
        </p>
        <p>
          <span className="font-medium">Email:</span>{" "}
          {invoice.customerEmail ?? "No email provided"}
        </p>
        <p>
          <span className="font-medium">Phone:</span>{" "}
          {invoice.customerPhone ?? "No phone provided"}
        </p>
        <p>
          <span className="font-medium">Address:</span>{" "}
          {invoice.customerAddress ?? "No address provided"}
        </p>
      </div>

      {/* Payment Info */}
      <div className="mb-6 text-sm space-y-1">
        <p>
          <span className="font-medium">Payment Method:</span>{" "}
          {invoice.paymentMethod}
        </p>
        <p>
          <span className="font-medium">Payment Status:</span>{" "}
          {invoice.paymentStatus}
        </p>
        <p>
          <span className="font-medium">Reference ID:</span>{" "}
          {invoice.referenceId ?? "N/A"}
        </p>
        {invoice.paidAt && (
          <p>
            <span className="font-medium">Paid At:</span>{" "}
            {new Date(invoice.paidAt).toLocaleString()}
          </p>
        )}
      </div>

      {/* Items Table */}
      <div className="border border-gray-300 rounded-md overflow-hidden mb-6">
        <div className="grid grid-cols-[3fr_1fr_1fr_2fr] bg-gray-100 text-sm font-medium text-gray-600 border-b border-gray-300">
          <div className="px-3 py-2">Description</div>
          <div className="px-3 py-2 text-center">Qty</div>
          <div className="px-3 py-2">Unit Price</div>
          <div className="px-3 py-2">Line Total</div>
        </div>
        {invoice.items?.length ? (
          invoice.items.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-[3fr_1fr_1fr_2fr] text-sm border-b border-gray-200"
            >
              <div className="px-3 py-2">{item.description}</div>
              <div className="px-3 py-2 text-center">{item.quantity}</div>
              <div className="px-3 py-2">
                ₱{item.unitPrice.toLocaleString()}
              </div>
              <div className="px-3 py-2">
                ₱{item.lineTotal.toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <div className="px-3 py-2 text-gray-500">No items found</div>
        )}
      </div>

      {/* Totals */}
      <div className="mb-6 text-sm space-y-1">
        <p>
          <span className="font-medium">Subtotal:</span> ₱
          {invoice.subtotal.toLocaleString()}
        </p>
        <p>
          <span className="font-medium">Total:</span> ₱
          {invoice.total.toLocaleString()}
        </p>
        <p>
          <span className="font-medium">Status:</span>{" "}
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </p>
      </div>

      {/* Audit Log */}
      <div className="border border-gray-300 rounded-md p-3 text-sm bg-gray-50">
        <h3 className="font-semibold mb-2">Audit Log</h3>
        <p>
          <span className="font-medium">Created At:</span>{" "}
          {new Date(invoice.createdAt).toLocaleString()}
        </p>
        <p>
          <span className="font-medium">Last Updated:</span>{" "}
          {new Date(invoice.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
