export interface AnnouncementType {
  _id: string;
  announcementName: string;
  image: string;
  description: string;
  startDate: string; // ISO string from backend
  endDate: string; // ISO string from backend
  createdAt: string;
  updatedAt: string;
}
