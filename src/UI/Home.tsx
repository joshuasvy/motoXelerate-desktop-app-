import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Panel from "../components/Panel";

function Home() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Panel activeTab={activeTab} />
    </div>
  );
}

export default Home;
