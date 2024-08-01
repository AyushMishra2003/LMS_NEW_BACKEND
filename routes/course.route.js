import { Router } from "express";
import { addAudience, addCourse, addMeterial, addRequirements, deleteCourse, getCourse, getSingleCourse } from "../controller/Courses/coursesController.js";



const courseRouter=Router()


courseRouter.post("/",addCourse)
courseRouter.post("/materail/:id",addMeterial)
courseRouter.post("/requirement/:id",addRequirements)
courseRouter.post("/audience/:id",addAudience)
courseRouter.get("/",getCourse)
courseRouter.get("/:id",getSingleCourse)
courseRouter.delete("/:id",deleteCourse)

export default courseRouter