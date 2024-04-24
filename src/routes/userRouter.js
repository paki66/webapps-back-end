import express from "express";
import { signup, protect, login, changeStatus } from "../helpers/userHelper.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch("/changeStatus", changeStatus);
export default router;
