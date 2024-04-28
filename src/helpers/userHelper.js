import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let usersCollection = db.collection("users");

export const signup = async (req, res) => {
  console.log(req.body);
  let passwordHash = await bcrypt.hash(req.body.password, 10);
  let user = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: passwordHash,
    role: req.body.role,
  };
  let result = await usersCollection.insertOne(user);
  if (result.acknowledged === true) {
    user._id = result.insertedId;
    createToken(user, 201, res);
  } else {
    res.status(500);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usersCollection.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    createToken(user, 200, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const user = await usersCollection.findOne(
      { email: req.body.email },
      { projection: { password: 1 } }
    );

    if (!(await bcrypt.compare(req.body.currentPassword, user.password))) {
      res.status(401).json({
        status: "fail",
        message: "Wrong current password",
      });
      return;
    }
    if (req.body.password === req.body.repeatPassword) {
      user.password = await bcrypt.hash(req.body.password, 10);
      await usersCollection.updateOne(
        { email: req.body.email },
        { $set: { password: user.password } }
      );

      createToken(user, 200, res);
    } else {
      res
        .status(401)
        .json({ status: "fail", message: "Passwords don't match." });
      return;
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: console.error(error),
    });
  }
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

let hasChangedPassword = function (JWTTimestamp) {
  if (this.password_changed_at) {
    const changed_at = parseInt(this.password_changed_at.getTime() / 1000, 10);
    return JWTTimestamp < changed_at;
  }
  return false;
};

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "You are not logged in" });
  }

  let decoded_user;
  try {
    decoded_user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const currentUser = await usersCollection.findOne({ _id: decoded_user.id });

  if (!currentUser) {
    return res
      .status(401)
      .json({ message: "User with this token no longer exists" });
  }

  if (hasChangedPassword(decoded_user.iat)) {
    return res.status(401).json({ message: "Password changed, log in again." });
  }

  req.user = currentUser;
  next();
};
