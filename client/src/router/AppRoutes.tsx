import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/Login/Login";

export const AppRoutes: React.FC = () => {
  return(
      <Routes>
        <Route path="/login" element = {<LoginPage/>}/>
        <Route path="/" element = {<LoginPage/>}/>
      </Routes>
  )
}