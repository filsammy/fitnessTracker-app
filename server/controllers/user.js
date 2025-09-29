const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");

const { errorHandler } = require("../errorHandler");

module.exports.registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email.includes("@")) {
            return res.status(400).send({ message: "Invalid email format" });
        }

        if (password.length < 8) {
            return res
                .status(400)
                .send({ message: "Password must be at least 8 characters long" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
        });

        const result = await newUser.save();

        return res.status(201).send({
            message: "Registered Successfully"
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email.includes("@")) {
            return res.status(400).send({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send({ message: "Incorrect email or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).send({ message: "Incorrect email or password" });
        }

        return res.status(200).send({
            access: auth.createAccessToken(user),
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        return res.status(200).send({
            user,
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};
