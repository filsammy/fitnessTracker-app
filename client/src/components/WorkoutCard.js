import { useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { Notyf } from "notyf";
import LoadingSpinner from "../components/LoadingSpinner";

export default function WorkoutCard({ workout, fetchWorkouts }) {
  const notyf = new Notyf();
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editWorkout, setEditWorkout] = useState({
    name: workout.name,
    duration: workout.duration,
    status: workout.status,
  });

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this workout?")) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/${workout._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        notyf.success("Workout deleted!");
        fetchWorkouts();
      } else {
        notyf.error(data.message || "Failed to delete workout");
      }
    } catch (err) {
      console.error(err);
      notyf.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL
}/workouts/updateWorkout/${workout._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editWorkout),
        }
      );
      const data = await res.json();
      if (res.ok) {
        notyf.success("Workout updated!");
        setShowEdit(false);
        fetchWorkouts();
      } else {
        notyf.error(data.message || "Failed to update workout");
      }
    } catch (err) {
      console.error(err);
      notyf.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://fitnessapi-q6ro.onrender.com/workouts/completeWorkoutStatus/${workout._id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        notyf.success("Workout marked as completed!");
        fetchWorkouts();
      } else {
        notyf.error(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      notyf.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const badgeClass =
    workout.status === "completed" ? "badge-completed" : "badge-pending";

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Card className="workout-card h-100">
        <Card.Body>
          <Card.Title className="workout-card-title">
            {workout.name}
            <span className={`badge ${badgeClass}`}>{workout.status}</span>
          </Card.Title>
          <Card.Text className="workout-card-text">
            Duration: {workout.duration}
          </Card.Text>
          <Card.Text className="workout-card-text">
            Added: {formatDate(workout.dateAdded)}
          </Card.Text>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <Button className="btn-edit" onClick={() => setShowEdit(true)}>
              Edit
            </Button>
            <Button className="btn-delete" onClick={handleDelete}>
              Delete
            </Button>
            {workout.status !== "completed" && (
              <Button className="btn-complete" onClick={markComplete}>
                Complete
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Form onSubmit={handleEdit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Workout</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="editWorkoutName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editWorkout.name}
                onChange={(e) =>
                  setEditWorkout({ ...editWorkout, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editWorkoutDuration">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                value={editWorkout.duration}
                onChange={(e) =>
                  setEditWorkout({ ...editWorkout, duration: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editWorkoutStatus">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={editWorkout.status}
                onChange={(e) =>
                  setEditWorkout({ ...editWorkout, status: e.target.value })
                }
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
