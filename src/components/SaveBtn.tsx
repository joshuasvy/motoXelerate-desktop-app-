interface SaveBtnProps {
  label?: string;
  onPress: () => void;
  icon?: string;
  color?: "green" | "red"; // restrict to known Tailwind colors
}

export default function SaveBtn({
  label = "Save",
  onPress,
  icon,
  color = "green",
}: SaveBtnProps) {
  const bgColor =
    color === "red"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-green-500 hover:bg-green-600";
  const textColor = "text-white";

  return (
    <button
      onClick={onPress}
      className={`text-[16px] font-medium py-3 px-5 rounded-md shadow-sm flex justify-between items-center gap-3 ${bgColor} ${textColor}`}
    >
      {label}
      <img src={icon} alt="Save" className="w-5" />
    </button>
  );
}
