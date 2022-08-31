import { Routes, Route } from "react-router-dom";

export const MainContent = () => (
  <Routes>
    <Route path="/" element={<div>Home</div>} />
    <Route path="expenses" element={<div>expenses</div>} />
    <Route path="invoices" element={<div>invoices</div>} />
  </Routes>
)