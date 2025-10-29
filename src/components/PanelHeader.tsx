export default function PanelHeader({ name }: { name: string }) {
  return (
    <div className="flex flex-row justify-between items-center mb-6">
      <p className="text-3xl font-semibold">{name}</p>
      <div className="flex  flex-row items-center">
        <p className="text-xl font-medium">Tuesday, October 21, 2025</p>
        <img
          src="/images/icons/notification.png"
          alt="Notification"
          className="w-7 rotate-45 ml-5"
        />
      </div>
    </div>
  );
}
