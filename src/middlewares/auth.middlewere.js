import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'
import apiError from '../utils/apiError.js';
import  asyncHandler from '../utils/asyncHandler.js'

export const protect = asyncHandler (async (req , res , next )=>{
    const token = req.cookies?.accessToken  ||
    req.header("Authorization")?.replace("Bearer ", "");

    if(!token){
        throw new apiError(401 ,"no access token provided")
    }

    let decoded ; 
    try { 
        decoded = jwt.verify(token ,process.env.ACCESS_TOKEN_SECRET)
        // console.log("Decoded token in protect middleware:", decoded);

    } catch (error) {
        throw new apiError(401 ,"invailid  access token")
    }
    const user = await User.findById(decoded._id).select(
        "-password -refreshToken "
    )
    if(!user){
        throw new apiError(401 ,"user no longer exist")
    }

    req.user = user
    next()
})  