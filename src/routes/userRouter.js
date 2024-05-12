import express from "express";
import {
  signup,
  protect,
  login,
  changePassword,
  updateInfo,
  changeStatus,
} from "../helpers/userHelper.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch("/changeStatus", protect, changeStatus);
router.patch("/changePassword", protect, changePassword);
router.patch("/updateInfo", protect, updateInfo);

export default router;
