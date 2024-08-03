import { Router } from "express";
import { addAudience, addCourse, addLecture, addMeterial, addRequirements, addWhatLearn, deleteCourse, deleteLecture, getCourse, getSingleCourse, updateCourse } from "../controller/Courses/coursesController.js";
import upload from "../middleware/multer.middleware.js";
const courseRouter=Router()


courseRouter.post("/",upload.single("photo"),addCourse)
courseRouter.post("/materail/:id",addMeterial)
courseRouter.post("/requirement/:id",addRequirements)
courseRouter.post("/audience/:id",addAudience)
courseRouter.post("/learn/:id",addWhatLearn)
courseRouter.get("/",getCourse)
courseRouter.get("/:id",getSingleCourse)
courseRouter.delete("/:id",deleteCourse)
courseRouter.put("/:id",updateCourse)
courseRouter.post("/addlecture/:id",upload.single("lecture"),addLecture)
courseRouter.delete("/deleteLecture/:id/:lectureId",deleteLecture)

export default courseRouter