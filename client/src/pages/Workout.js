import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { Notyf } from "notyf";
import UserContext from "../context/UserContext";
import WorkoutCard from "../components/WorkoutCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Workout() {
  const { user } = useContext(UserContext);
  const notyf = new Notyf();

  const [workouts, setWorkouts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newWorkout, setNewWorkout] = useState({ name: "", duration: "" });
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = async () => {
    if (!user.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/workouts/getMyWorkouts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setWorkouts(data.workouts || []);
    } catch (err) {
      console.error(err);
      notyf.error("Failed to fetch workouts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user]);

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    if (!newWorkout.name || !newWorkout.duration) {
      notyf.error("Name and duration are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/workouts/addWorkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newWorkout),
      });
      const data = await res.json();
      if (data._id) {
        setWorkouts([data, ...workouts]);
        notyf.success("Workout added!");
        setShowModal(false);
        setNewWorkout({ name: "", duration: "" });
      } else {
        notyf.error(data.message || "Failed to add workout");
      }
    } catch (err) {
      console.error(err);
      notyf.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="my-4">
      <Row className="mb-3">
        <Col>
          <h1 className="text-center">My Workouts</h1>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col className="text-center">
          <Button onClick={() => setShowModal(true)} className="btn-add-workout text-dark" id="addWorkout">
            Add Workout
          </Button>
        </Col>
      </Row>

      <Row>
        {workouts.length ? (
          workouts.map((workout) => (
            <Col key={workout._id} xs={12} md={6} lg={4} className="mb-3">
              <WorkoutCard workout={workout} fetchWorkouts={fetchWorkouts} />
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-center">No workouts yet. Add one!</p>
          </Col>
        )}
      </Row>

      {/* Modal for adding workout */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleAddWorkout}>
          <Modal.Header closeButton>
            <Modal.Title>Add Workout</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="workoutName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Workout name"
                value={newWorkout.name}
                onChange={(e) =>
                  setNewWorkout({ ...newWorkout, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="workoutDuration">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. 30 min"
                value={newWorkout.duration}
                onChange={(e) =>
                  setNewWorkout({ ...newWorkout, duration: e.target.value })
                }
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Workout
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
