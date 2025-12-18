import { useState } from "react";
import AddAnnouncementModal from "./modals/AddAnnouncementModal";

export default function AddAnnouncement() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-white font-medium rounded-lg shadow-md px-6 py-4 flex items-center gap-3 cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        <img
          src="/images/icons/add.png"
          alt="Add Announcement"
          className="w-6"
        />
        Add Announcement
      </button>

      <AddAnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
