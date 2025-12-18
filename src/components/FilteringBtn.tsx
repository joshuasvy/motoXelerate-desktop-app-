type FilteringBtnProps = {
  label: string;
  isActive?: boolean; // optional: highlight the active filter
  onClick: () => void;
};

export default function FilteringBtn({
  label,
  isActive = false,
  onClick,
}: FilteringBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`border px-4 py-2 rounded-md text-sm font-medium transition-colors
        ${
          isActive
            ? "bg-black text-white"
            : "border-black text-black hover:bg-gray-100"
        }
      `}
    >
      {label}
    </button>
  );
}
