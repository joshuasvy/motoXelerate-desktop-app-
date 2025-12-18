type StatCardProps = {
  title: string;
  value: string;
  icon: string;
  children?: React.ReactNode;
};

export default function StatCard({
  title,
  value,
  icon,
  children,
}: StatCardProps) {
  return (
    <div className="bg-white px-4 py-5 rounded-md shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{title}</h1>
        <img src={icon} alt={title} className="w-8" />
      </div>
      <p className="text-xl font-semibold mt-3">{value}</p>
      {children}
    </div>
  );
}
