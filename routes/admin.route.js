import { Router } from "express";
import { addAdmin, getAdmin, loginAdmin, logoutAdmin } from "../controller/AdminController/admin.controller.js";



const adminRoute=Router()


adminRoute.post("/",addAdmin)
adminRoute.post("/login",loginAdmin)
adminRoute.get("/allAdmin",getAdmin)
adminRoute.get("/logout",logoutAdmin)

export default adminRoute