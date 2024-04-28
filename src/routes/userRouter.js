import express from "express";
import {
  signup,
  protect,
  login,
  changePassword,
} from "../helpers/userHelper.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch("/changePassword", changePassword);

export default router;
