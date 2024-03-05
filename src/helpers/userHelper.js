import db from "../db.js";

let usersCollection = db.collection("users");

export const signup = async (req, res) => {
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
