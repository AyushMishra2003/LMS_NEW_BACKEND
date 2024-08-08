import { Router } from "express";
import {
  addStudent,
  getStudent,
  loginStudent,
  logoutStudent,
  profile,
} from "../controller/studentController/studentController.js";

const studentRouter = Router();

studentRouter.post("/", addStudent);
studentRouter.post("/login", loginStudent);
studentRouter.get("/", getStudent);
studentRouter.get("/logout", logoutStudent);
studentRouter.get("/:id", profile);

export default studentRouter;
