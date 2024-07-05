import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/Apierror.js";
import { asyncHandler } from "../utils/asynchandler.js";

 export const verifyJWT=asyncHandler(async(req,res,next)=>{
   try {
    const token= req.cookies?.accesstoken || req.header("Authorisation")?.replace("Bearer ","")
 
     if(!token){
 
         throw new ApiError(401,"unauthorised request")
     }
     const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
     const user=await User.findbyId(decodedtoken?._id).select("-password -refreshToken")
 
     if(!user){
         throw new ApiError(401,"Invalid Access Token")
 
     }
     req.user=user;
     next ()
   } catch (error) {

    throw new ApiError(401,"Invalid Access Token")
    
   }
 })
