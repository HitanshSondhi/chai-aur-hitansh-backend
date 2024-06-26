import { User } from "../models/user.model.js";
import { ApiError } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessTokenandRefreshToken=async(userId)=>{
    try {
       const user= await User.findById(userId)
       const accessToken=user.generateAccessToken()
       const refreshToken=user.generateRefreshToken()
       user.refreshToken=refreshToken
     await user.save({validateBeforeSave:false})

     return {accessToken,refreshToken}
        
    } catch (error) {
        throw new ApiError(500,"something went wrong while genrating token")
        
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // Get user details from frontend
    const { fullName, email, username, password } = req.body;
    console.log("email:", email);

    // Validate that no fields are empty
    if ([fullName, email, username, password].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user with the same email or username already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Check for files and their paths
    const avatarLocalpath = req.files?.avatar?.[0]?.path;
    const coverImageLocalpath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalpath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Upload avatar and cover image to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalpath);
    const coverImage = coverImageLocalpath ? await uploadOnCloudinary(coverImageLocalpath) : null;

    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar");
    }

    // Create user object and save it to the database
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    // Find created user and exclude password and refresh token from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Return created user in response
    return res.status(201).json(new Apiresponse(201, "User registered successfully", createdUser));
});

const loginUser=asyncHandler(async(req,res)=>{
    //req-body-data
    //access using username or email
    //find the user either using email or username
    //password check 
    //generate access token and refresh token 
    //cookies

    const{email,username,password}=req.body

    if (!(username||password)) {
        throw new ApiError(400,"username or password is required")

         }

   const user= await User.findOne({
            $or:[{username},{email}]
         })

         if(!user){
            throw new ApiError(404,"User does not exist")
         }

       const  isPasswordValid=  await user.isPasswordCorrect(password)

       if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
       }

    const{accessToken,refreshToken}= await generateAccessTokenandRefreshToken(user._id)
    const logedInUser =await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
        new Apiresponse(200,{
            user:logedInUser,accessToken,refreshToken
        },"User Logged in successfully")
    )



})

const logoutUser=asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            },
           

        },
        {
            new:true
        }

    )
    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new Apiresponse(200,{},"User Logged out Successfully"))

})

export {
    registerUser,
    loginUser,
    logoutUser
};
