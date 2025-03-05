import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import EditPage from "@/pages/EditPage";
import Auth from "@/components/Auth";
import ListPage from "@/pages/ListPage";
import { BrowserRouter, Routes, Route } from 'react-router'

import "./index.scss";
const root = createRoot(document.getElementById("react-root")!);
root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />}>
          <Route index element={<EditPage />} />
          <Route path="list" element={<ListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
