interface ActionBtnProps {
  type: "save" | "delete";
  onPress: () => void;
}

export default function ActionBtn({ type, onPress }: ActionBtnProps) {
  const configs = {
    save: {
      label: "Save",
      icon: "/images/icons/save.png",
      bgColor:
        "bg-green-600 hover:shadow-md transition-all duration-300 hover:scale-105",
    },
    delete: {
      label: "Delete",
      icon: "/images/icons/delete.png",
      bgColor:
        "bg-red-600 hover:shadow-md transition-all duration-300 hover:scale-105",
    },
  };

  const config = configs[type] ?? configs.save;

  return (
    <button
      type="button"
      onClick={onPress}
      className={`text-sm font-medium py-2.5 px-5 rounded-md shadow-sm flex justify-between items-center gap-3 ${config.bgColor} text-white`}
    >
      {config.label}
      <img src={config.icon} alt={config.label} className="w-5" />
    </button>
  );
}
