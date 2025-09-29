import { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { Notyf } from "notyf";
import UserContext from "../context/UserContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const notyf = new Notyf();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL
}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.access) {
        localStorage.setItem("token", data.access);

        const userRes = await fetch(`${process.env.REACT_APP_API_URL
}/users/details`, {
          headers: { Authorization: `Bearer ${data.access}` }
        });
        const userData = await userRes.json();

        if (userData.user) {
          setUser({ id: userData.user._id, isAdmin: userData.user.isAdmin });
          notyf.success("Login successful!");
        } else {
          notyf.error("Failed to retrieve user details.");
        }
      } else {
        notyf.error(data.message || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      notyf.error("Something went wrong. Try again.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  if (user.id) return <Navigate to="/workouts" />;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Form onSubmit={handleLogin} style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h1 className="text-center mb-4">Login</h1>

      <Form.Group className="mb-3" controlId="loginEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="loginPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </Form.Group>

      <Button className="custom-btn w-100" type="submit" disabled={!email || !password}>
        Login
      </Button>
    </Form>
  );
}
