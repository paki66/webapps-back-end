import db from "../db.js";

let usersCollection = db.collection("users");
const signup = async (req, res) => {
  console.log(req.body);
  let user = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password,
    repeatPassword: req.body.repeatPassword,
  };
  let result = await usersCollection.insertOne(user);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await usersCollection.findOne({ email, password });

  if (!user || password !== user.password) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }
};

export { signup, login };
