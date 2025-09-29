// src/pages/Home.js
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Container className="my-5 d-flex justify-content-center">
      <div className="home-box text-center p-5">
        <h1 className="mb-4">Welcome to Fitness Tracker</h1>
        <p className="lead mb-4">
          Track your workouts, stay motivated, and reach your fitness goals.
          Whether you're a beginner or an experienced athlete, this app helps
          you stay on top of your progress.
        </p>
        <Button as={Link} to="/login" className="custom-btn">
          Get Started
        </Button>
      </div>
    </Container>
  );
}
