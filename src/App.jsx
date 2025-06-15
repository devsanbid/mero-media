import HomePage from "./pages/Homepage.jsx"
import LoginPage from "./pages/Login.jsx"
import RegisterPage from "./pages/Register.jsx"
import { Routes, Route, Link } from "react-router-dom"
import {Dashboard} from "./pages/Dashboard.jsx"
import { DataTableComponent } from "./pages/DataTable.jsx"

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/data" element={<DataTableComponent />} />
    </Routes>
  )
}

export default App
