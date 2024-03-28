import {asyncHandler} from '../../utils/asyncHandler.js' ;
import {User} from '../models/user.model.js';
import {ApiError} from '../../utils/ApiError.js';
import { jwt } from 'jsonwebtoken';
import { mongoose } from 'mongoose';
import {ApiResponse} from '../../utils/ApiResponse.js';
const generateAccessAndRefreshTokens = async(userId) => {
    
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // here we are adding refresh token in the database
        user.refreshToken = refreshToken
        // here we are saving our database with the updated field
        // since validation or password field will kick in
        // so for that reason we are write validateBeforeSave: false
        await user.save({validateBeforeSave: false})

        return {
            accessToken,
            refreshToken,
        }

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar && req.files.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })
    // here we are removing password and refreshToken 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler(async (req, res) =>{
    // extract body from req data
    // check for email or username fields
    // find the user in database
    // password check
    // if password correct - generate access and refresh token
    // send cookies - secure cookies 
    // send a response that logged in successfully

    // here we are extracting the values from the req body

    const {email, username, password} = req.body
    // console.log(email);

    // check if all the fields are give or not

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    // console.log(user);
    if (!user) {
        throw new ApiError(404, "User doesn't exist")
    }
    // now we have to check for the password so for that reason
    // we have already created an method in which we have to pass the user password
    // this method is created in the user model
    console.log(password);
    console.log(user);
    const isPasswordValid = await user.isPasswordCorrect(password)
    console.log(isPasswordValid);
    if (!isPasswordValid) {
     throw new ApiError(401, "Invalid user credentials")
     }
    // If user and password is correct we have to create access and refresh tokens
    // since we have created a method for this we just need to pass
    // the user id and we will get access and refresh token in response
   const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    // now we to send these details to the user but we cannot send all the fields 
    // that is password so we have to update
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    // send cookies
    // here we have to desing options
    // cookies can be modified generally so to avoid that 
    // we have enabls httpOnly and secure
    // now we can only modify our cookies through server
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            // this is the data field
            // why are we sending to the fronted
            // because there might be a case where fronted enginner wants to scrape
            // some data from the accessToken
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res)=>{
    // in case of logout we have to remove cookies
    // and reset access and refresh token
    // we can access cookie in req and res
    await User.findByIdAndUpdate(
        // find the user
        req.user._id,
        {
            // mongo db operator
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))

})

const refreshAccessToken = asyncHandler(async(req, res)=>{
    // pupose of refresh token is when our access token is expired
    // we can send refresh token from cookie to get access token
    const incomingRefreshToekn = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToekn) {
        throw new ApiError(401, "Unauthorized request")
    }

try {
        const decodedToken = jwt.verify(
            incomingRefreshToekn,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        if(!user) throw new ApiError(401, "Invalid refresh Token")
    
        if(incomingRefreshToekn !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, newRefreshToken},
                "Access Token refreshed"
            )
        )
} catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh Token")
}

})

const changeCurrentPassword = asyncHandler(async(req, res)=>{
    const {oldPassword, newPassword, confirmPassword} = req.body

    // if the user wants change the password it means the user is logged in
    // so we can access the user data from req.body as it has id
    // we have auth middleware in which we have id for the current user
    if(newPassword !== confirmPassword) throw new ApiError(400, "Re-enter the confirm password")
    
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect) throw new ApiError(400, "Invalid old password")

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})
const getCurrentUser = asyncHandler(async(req, res)=>{
    return res
    .status(200)
    .json(new ApiResponse
    (
        200, 
        req.user,
        "Current user fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //TODO: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
}