interface Props {
  onClick: () => void;
  disabled: boolean;
}

export default function DeleteBtn({ onClick, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-sm font-medium rounded-lg shadow-md p-3 flex items-center gap-3 transition-all duration-300 ${
        disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-red-600 text-white hover:shadow-lg transform hover:scale-105 cursor-pointer"
      }`}
    >
      <img
        src="/images/icons/delete.png"
        alt="Delete"
        className="w-5 opacity-80"
      />
      Delete
    </button>
  );
}
