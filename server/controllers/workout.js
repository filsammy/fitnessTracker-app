const Workout = require("../models/Workout");
const { errorHandler } = require('../errorHandler');

module.exports.addWorkout = async (req, res) => {
    try {
        const { name, duration, status } = req.body;

        if (!name || !duration) {
            return res.status(400).send({ message: "Name and duration are required" });
        }

        const newWorkout = new Workout({
            name,
            duration,
            status: status || "pending",
            userId: req.user.id,
            dateAdded: new Date()
        });

        const savedWorkout = await newWorkout.save();

        return res.status(201).send(savedWorkout);
    } catch (error) {
        return errorHandler(error, req, res);
    }
};


module.exports.getMyWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ userId: req.user.id }).sort({ dateAdded: -1 });

        return res.status(200).send({
            workouts
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.updateWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, duration, status } = req.body;

        if (duration !== undefined && typeof duration !== "string") {
            return res.status(400).send({ message: "Duration must be a string" });
        }

        const updates = {};
        if (name !== undefined) updates.name = name;
        if (duration !== undefined) updates.duration = duration;
        if (status !== undefined) updates.status = status;

        const updatedWorkout = await Workout.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedWorkout) {
            return res
                .status(404)
                .send({ message: "Workout not found or not authorized" });
        }

        return res.status(200).send({
            message: "Workout updated successfully",
            updatedWorkout,
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};



module.exports.deleteWorkout = async (req, res) => {
    try {
        const { id } = req.params;

        const workout = await Workout.findOneAndDelete({
            _id: id,
            userId: req.user.id,
        });

        if (!workout) {
            return res.status(404).send({ message: "Workout not found or not authorized" });
        }

        return res.status(200).send({
            message: "Workout deleted successfully",
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.completeWorkoutStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedWorkout = await Workout.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { status: "completed" },
            { new: true, runValidators: true }
        );

        if (!updatedWorkout) {
            return res.status(404).send({ message: "Workout not found or not authorized" });
        }

        return res.status(200).send({
            message: "Workout status updated successfully",
            updatedWorkout,
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};
