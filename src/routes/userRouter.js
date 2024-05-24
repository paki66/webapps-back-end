import express from "express";
import {
  signup,
  protect,
  login,
  changePassword,
  updateInfo,
  changeStatus,
  getUserInfo,
  getUserStatus,
  deleteProfile,
  getAllStatuses,
} from "../helpers/userHelper.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router
  .route("/changeStatus")
  .get(protect, getUserStatus)
  .patch(protect, changeStatus);
router.patch("/changePassword", protect, changePassword);
router.route("/userInfo").get(protect, getUserInfo).patch(protect, updateInfo);
router.delete("/deleteProfile", protect, deleteProfile);
router.get("/userStatuses", protect, getAllStatuses);

export default router;
