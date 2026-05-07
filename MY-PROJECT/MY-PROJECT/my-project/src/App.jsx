import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Component/Login";
import Signup from "./Component/Signup";
import Home from "./Component/Home";
import Compare from "./Component/Compare";
import Features from "./Component/Features";
import BudgetFinder from "./Component/BudgetFinder";
import Challan from "./Component/Challan";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/budget" element={<BudgetFinder />} />
      <Route path="/challan" element={<Challan />} />
      <Route path="/features" element={<Features />} />
      <Route path="*" element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
