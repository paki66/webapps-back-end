import express from "express";
import { signup } from "../helpers/userHelper.js";

const router = express.Router();

router.post("/signup", signup);

export default router;
