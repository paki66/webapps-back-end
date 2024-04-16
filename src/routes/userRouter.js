import express from "express";
import { signup, protect, login } from "../helpers/userHelper.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
export default router;
