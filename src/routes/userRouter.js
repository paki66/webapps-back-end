import express from "express";
import { signup } from "../helpers/userHelper.js";
import { login } from "../helpers/userHelper.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
export default router;
