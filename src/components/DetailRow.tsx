type DetailRowProps = {
  label: string;
  value: string | number | React.ReactNode;
};

export default function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div>
      <h2 className="text-gray-700">{label}</h2>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
