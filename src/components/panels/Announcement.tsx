import { useEffect, useState } from "react";
import axios from "axios";
import PanelHeader from "../PanelHeader";
import AddAnnouncement from "../AddAnnouncement";
import AnnouncementCard from "../card/AnnouncementCard";
import DeleteBtn from "../DeleteBtn";

export interface AnnouncementType {
  _id: string;
  announcementName: string;
  image: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function Announcement() {
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        "https://api-motoxelerate.onrender.com/api/announcement"
      );
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      await axios.post(
        "https://api-motoxelerate.onrender.com/api/announcement/delete-many",
        { ids: selectedIds }
      );
      alert("Selected announcements deleted.");
      fetchAnnouncements(); // refresh list
      setSelectedIds([]); // clear selection
    } catch (error) {
      console.error("Failed to delete announcements:", error);
      alert("Failed to delete selected announcements.");
    }
  };

  return (
    <div>
      <PanelHeader name="Announcement" />
      <div className="flex flex-row justify-between items-center pr-8 pb-5 border-b border-gray-200">
        <AddAnnouncement />
        <DeleteBtn onClick={handleDelete} disabled={selectedIds.length === 0} />
      </div>
      <div className="w-full bg-white px-8 py-6 my-5">
        {loading ? (
          <p className="text-gray-500">Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p className="text-gray-500">No announcements found.</p>
        ) : (
          announcements.map((item) => (
            <AnnouncementCard
              key={item._id}
              announcement={item}
              onSelect={handleSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}
