import { ReactNode } from "react";

type SectionProps = {
  title: string;
  children: ReactNode;
};

export default function Section({ title, children }: SectionProps) {
  return (
    <div className="bg-white p-6 mt-4">
      <h1 className="text-[21px] font-semibold text-gray-700 mb-6">{title}</h1>
      {children}
    </div>
  );
}
