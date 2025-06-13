import HomePage from "./pages/Homepage.jsx"
import LoginPage from "./pages/Login.jsx"
import RegisterPage from "./pages/Register.jsx"
import { Routes, Route, Link } from "react-router-dom"

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}

export default App
