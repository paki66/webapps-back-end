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
      { email: req.body.loggedEmail },
      { projection: { password: 1 } }
    );

    if (!(await bcrypt.compare(req.body.currentPassword, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Wrong current password",
      });
    }
    if (req.body.password === req.body.repeatPassword) {
      user.password = await bcrypt.hash(req.body.password, 10);
      await usersCollection.updateOne(
        { email: req.body.loggedEmail },
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

const signToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createToken = (user, statusCode, res) => {
  const token = signToken(user.email);
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
export const changeStatus = async (req, res, next) => {
  const response = await usersCollection.updateOne(
    { email: req.body.email },
    { $set: { status: req.body.statusId } }
  );
  res.status(204).json({ status: "success", data: null });
};

export const updateInfo = async (req, res) => {
  try {
    const user = await usersCollection.findOne({ email: req.body.loggedEmail });

    if (user) {
      await usersCollection.updateOne(
        { email: req.body.loggedEmail },
        {
          $set: {
            email: req.body.email,
            phone: req.body.phone,
            userType: req.body.userType,
            anniversary: req.body.anniversary,
          },
        }
      );
      res.status(200).json({
        status: "success",
        message: "Profile info successfully changed.",
      });
      return;
    } else {
      res.status(401).json({ status: "fail", message: "An error occured." });
      return;
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: console.error(error),
    });
  }
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
  console.log(decoded_user);
  const currentUser = await usersCollection.findOne({
    email: decoded_user.email,
  });

  if (!currentUser) {
    return res
      .status(401)
      .json({ message: "User with this token no longer exists" });
  }
  req.user = currentUser;
  next();
};
