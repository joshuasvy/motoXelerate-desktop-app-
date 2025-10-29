import { useRef, useState } from "react";

export default function Testing() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // manually trigger hidden input
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  return (
    <div className="w-[400px]">
      {/* Upload Box */}
      <div
        onClick={handleBoxClick}
        className="h-[200px] border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer hover:border-blue-500 transition"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <p className="text-gray-500 text-lg font-medium">Upload an image</p>
        )}
      </div>

      {/* Hidden Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
