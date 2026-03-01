import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../src/pages/Login.jsx";
import Callback from "../src/pages/Callback.jsx";
import Dashboard from "../src/pages/Dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App