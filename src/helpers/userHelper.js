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
  };
  let result = await usersCollection.insertOne(user);
  if (result.acknowledged === true) {
    createToken(result, user, 201, res);
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
