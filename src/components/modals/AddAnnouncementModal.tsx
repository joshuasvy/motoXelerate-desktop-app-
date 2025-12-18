import { useRef, useState, useEffect } from "react";
import axios from "axios";

interface AddAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAnnouncementModal({
  isOpen,
  onClose,
}: AddAnnouncementModalProps) {
  const [animateIn, setAnimateIn] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAnimateIn(true);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("announcementName", title);
      formData.append("description", message);
      formData.append("startDate", startDate);
      formData.append("endDate", expiryDate);

      // Convert base64 to Blob
      const blob = await (await fetch(imagePreview)).blob();
      formData.append("image", blob, "announcement.png");

      const response = await axios.post(
        "https://api-motoxelerate.onrender.com/api/announcement",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Posted:", response.data);
      alert("Announcement posted!");
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to post announcement.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300">
      <div
        className={`bg-white rounded-lg shadow-lg w-[850px] h-[485px] px-8 py-8 relative transform transition-all duration-300 ease-in-out ${
          animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-xl"
        >
          <img src="/images/icons/close.png" alt="Close" className="w-4" />
        </button>

        <h2 className="text-2xl font-semibold mb-6">Add New Announcement</h2>

        <div className="flex">
          <div
            onClick={handleUploadClick}
            className="w-[200px] h-[200px] mr-8 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-600 transition-all"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-contain rounded-md"
              />
            ) : (
              <p className="text-gray-500 font-medium text-center">
                Upload an Image
              </p>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex flex-col gap-3 w-[70%]">
            <label className="font-medium">Announcement</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-[15px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="font-medium">Description</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your announcement here..."
              className="w-full px-3 py-2 text-[15px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <div className="flex gap-4">
              <div className="flex flex-col w-full">
                <label className="font-medium">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-[15px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="font-medium">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 text-[15px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end mt-6">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 gap-3 flex items-center rounded-md hover:bg-blue-700 transition"
          >
            Post
            <img
              src="/images/icons/save.png"
              alt="Save"
              className="w-4 h-5 inline-block"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
