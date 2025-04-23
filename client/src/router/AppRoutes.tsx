import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/Login/Login";
import RegisterPage from "../pages/Register/Register";
import ProtectedRouter from "./ProtectedRouter";
import Chat from "../pages/Chat/Chat";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/chat"
        element={
          <ProtectedRouter>
            <Chat />
          </ProtectedRouter>
        }
      />
    </Routes>
  );
};
