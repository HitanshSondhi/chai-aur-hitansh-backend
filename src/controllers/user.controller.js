import { upload } from ".. /middlewares/multer.middleware.js";
import { User } from "../models/user.model.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser=asynchandler(async(req,res)=>{
    //get user detail from frontend
    //validation-not empty
    //check if user is unique
    //check for images ,check of avatar
    //upload them to cloudinary 
    //create user object-create entery in db calls
    //remove password and refresh token field from response
    //check for user creation 
    //return user

    const {fullname,email,username,password}=req.body
    console.log("email:",email);

    // if(fullname===""){
    //     throw new Apierror(400,"full name is required")
    // }
    if (
        [fullname,email,username,password].some((field)=>field?.trim()==="")
    ) {
        throw new Apierror(400,"All fields are required")
    }
    const existedUser= User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new Apierror(409,"User with email or username aleardy exist")

        
    }
    const avatarLocalpath=req.files?.avatar[0]?.path
   const coverImageLocalpath= req.files?.coverImage[0]?.path


   if(!avatarLocalpath){
    throw new Apierror(400,"Avatar file is required")
   }

   const avatar=await uploadOnCloudinary(avatarLocalpath)
   const coverImage=await uploadOnCloudinary(coverImageLocalpath )

   if(!avatar){
    throw new Apierror(400,"Avatar file is required")
   }

   const user=await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url||"",
    email,
    password,
    username:username.toLowercase()
   })

  const createdUser= await user.findId(user._id).select(
    "-password -refreshToken"
  )
  if(!createdUser){
    throw new Apierror(500,"something went wrong while registering a user")

  }
  return res.status(201).json()

})

export
 {
    registerUser,

 }