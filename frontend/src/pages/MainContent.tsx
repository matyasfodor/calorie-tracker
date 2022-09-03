import { Routes, Route } from "react-router-dom";
import { RequireAdmin } from "../components/RequireAdmin";
import { AdminEntries } from "./AdminEntries";
import { FoodEntries } from "./FoodEntries";

export const MainContent = () => (
  <Routes>
    <Route path="/" element={<div>Home</div>} />
    <Route path="food-entries" element={<FoodEntries/>} />
    
      <Route path="admin-entries" element={
      <RequireAdmin>
        <AdminEntries/>
      </RequireAdmin>
      } />
    
  </Routes>
)