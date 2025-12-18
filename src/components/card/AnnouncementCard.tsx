import { useState } from "react";
import type { AnnouncementType } from "../../../types/AnnouncementType";

interface Props {
  announcement: AnnouncementType;
  onSelect: (id: string, checked: boolean) => void;
}

export default function AnnouncementCard({ announcement, onSelect }: Props) {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    onSelect(announcement._id, checked);
  };

  return (
    <div className="w-full bg-white shadow-md rounded-md flex flex-row gap-3 mb-3 items-center relative">
      <img
        src={announcement.image}
        alt={announcement.announcementName}
        className="w-40 h-40 object-cover rounded-l-md"
      />
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        className="form-checkbox h-4 w-4 cursor-pointer absolute right-4 top-4 text-green-600"
      />
      <div className="flex flex-col gap-3 p-4 py-6">
        <h1 className="text-xl font-semibold mb-4">
          {announcement.announcementName}
        </h1>
        <p className="text-sm line-clamp-2">{announcement.description}</p>
        <div className="flex flex-col gap-1">
          <p className="flex gap-2 text-sm text-gray-500">
            Starts in:
            <span className="text-md text-black font-medium">
              {new Date(announcement.startDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
          <p className="flex gap-2 text-sm text-gray-500">
            Ends with:
            <span className="text-md text-black font-medium">
              {new Date(announcement.endDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
