// Routes.tsx
import { Routes, Route } from "react-router-dom";
import { NotificationProvider } from "../../context/NotificationProvider";
import Login from "../UI/Login";
import Home from "../UI/Home";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/home"
        element={
          <NotificationProvider>
            <Home />
          </NotificationProvider>
        }
      />
    </Routes>
  );
}
