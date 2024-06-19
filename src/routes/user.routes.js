import { upload } from ".. /middlewares/multer.middleware.js";
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { User } from "../models/user.model.js";
import { Apierror } from "../utils/Apierror.js";

const router=Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)

   
    
// router.route("/login").post(registerUser)




export default router
