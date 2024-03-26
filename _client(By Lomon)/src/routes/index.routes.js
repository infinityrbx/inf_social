import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layout/layout.js";
import Test from "../pages/Home.js";
import Login from "../pages/Login.js";
import Home from "../pages.js";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Layout />} />

        <Route path="/chat" element={<Home />}>
          <Route index path="/chat/test" element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
