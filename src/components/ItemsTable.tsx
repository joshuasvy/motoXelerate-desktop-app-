type Item = {
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  status?: string;
};

type ItemsTableProps = {
  items: Item[];
};

export default function ItemsTable({ items }: ItemsTableProps) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-4 font-medium text-gray-700">
        <span>Product</span>
        <span>Quantity</span>
        <span>Unit Price</span>
        <span>Line Total</span>
        <span>Status</span>
      </div>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="grid grid-cols-5 gap-4 border-t text-sm py-2 mt-3"
        >
          <span>{item.description}</span>
          <span>{item.quantity}</span>
          <span>₱{item.unitPrice.toLocaleString()}</span>
          <span>₱{item.lineTotal.toLocaleString()}</span>
          <span>{item.status ?? "N/A"}</span>
        </div>
      ))}
    </div>
  );
}
