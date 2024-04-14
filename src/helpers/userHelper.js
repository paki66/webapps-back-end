import db from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

const signToken = (id) => {
  return jwt.sign({ id }, "TopSecret", {
    expiresIn: 1200000,
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
    return next(new ErrorHandler("You are not logged in", 401));
  }

  const decoded_user = await promisify(jwt.verify)(token, "TopSecret");

  const currentUser = await User.findById(decoded_user.id);

  if (!currentUser) {
    return next(new ErrorHandler("User with this token no longer exists", 401));
  }

  if (hasChangedPassword(decoded_user.iat)) {
    return next(new ErrorHandler("Password changed, log in again.", 401));
  }

  req.user = currentUser;
  next();
};
