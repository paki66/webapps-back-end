import express from "express";
import { signup, protect } from "../helpers/userHelper.js";

const router = express.Router();

router.post("/signup", signup);
//router.get("/test", protect, console.log("protectano"));
export default router;
