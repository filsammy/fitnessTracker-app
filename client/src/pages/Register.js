import { useState, useEffect, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, Navigate } from "react-router-dom";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import UserContext from "../context/UserContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Register() {
  const { user } = useContext(UserContext);
  const notyf = new Notyf();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsActive(
      email !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword
    );
  }, [email, password, confirmPassword]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL
}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        notyf.success("Registration successful! You can now login.");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        navigate("/login");
      } else {
        notyf.error(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      notyf.error("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (user.id) {
    return <Navigate to="/workouts" />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Form onSubmit={handleSubmit} className="mx-auto my-5" style={{ maxWidth: "400px" }}>
      <h1 className="text-center mb-4">Register</h1>

      <Form.Group className="mb-3" controlId="registerEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="registerPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-4" controlId="confirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          isInvalid={confirmPassword !== "" && confirmPassword !== password}
        />
        <Form.Control.Feedback type="invalid">
          Passwords do not match
        </Form.Control.Feedback>
      </Form.Group>

      <Button className="custom-btn w-100" type="submit" disabled={!isActive}>
        Register
      </Button>
    </Form>
  );
}
