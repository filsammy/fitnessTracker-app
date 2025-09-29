import { useState, useEffect, useCallback } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import Home from "./pages/Home";
import Workout from "./pages/Workout";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";

import "./App.css";
import { UserProvider } from "./context/UserContext";

function App() {
  const [user, setUser] = useState({ id: null, isAdmin: null });

  const unsetUser = useCallback(() => {
    localStorage.removeItem("token");
    setUser({ id: null, isAdmin: null });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://fitnessapi-q6ro.onrender.com/users/details", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser({ id: data.user._id, isAdmin: data.user.isAdmin });
        } else {
          unsetUser();
        }
      })
      .catch(() => unsetUser());
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Container className="py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/workouts" element={<Workout />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
