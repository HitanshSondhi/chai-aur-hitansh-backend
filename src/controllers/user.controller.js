import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/asynchandler.js";

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
    req.files?.avatar[0]?.path

})

export
 {
    registerUser,

 }