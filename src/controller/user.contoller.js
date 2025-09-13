import User from "../models/user.model.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// Generate Tokens
const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new apiError(404, "User not found.");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save the new refresh token to DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("GenerateTokens Error:", error.message);
    throw new apiError(500, "Error generating tokens");
  }
};
const createAdmin = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new apiError(403, "Only admins can create new admins");
  }

  const { Name, email, password, addresh } = req.body;

  if (!Name || !email || !password) {
    throw new apiError(400, "All fields are required.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new apiError(400, "User already exists.");

  const newAdmin = await User.create({
    Name,
    email,
    password,
    addresh,
    role: "admin", // only admins can assign this
  });

  const createdAdmin = await User.findById(newAdmin._id).select("-password");

  return res
    .status(201)
    .json(new apiResponse(201, { user: createdAdmin }, "Admin created successfully"));
});
// Register
const register = asyncHandler(async (req, res) => {
  const { Name, email, password, addresh, role } = req.body;

  if (!Name || !email || !password) {
    throw new apiError(400, "All fields are required.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new apiError(400, "User already exists.");

  // ✅ Only allow admin role if special secret code matches
  let userRole = "user"; // default
  if (role === "admin" && req.body.adminSecret === process.env.ADMIN_SECRET) {
    userRole = "admin";
  }

  const user = await User.create({ Name, email, password, addresh, role: userRole });

  const { accessToken, refreshToken } = await generateTokens(user._id);
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res.status(201).json(
    new apiResponse(
      201,
      { user: createdUser, accessToken, refreshToken },
      "User created successfully."
    )
  );
});
// Login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new apiError(400, "Email and password are required.");

  const user = await User.findOne({ email });
  if (!user) throw new apiError(400, "User not found");

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new apiError(400, "Invalid password.");

  const { accessToken, refreshToken } = await generateTokens(user._id);
  const userData = await User.findById(user._id).select(
    "-password -refreshToken"
  );

const cookieOptions = {
  httpOnly: true,
  secure: true,       // Must be true for HTTPS (Vercel + Render)
  sameSite: "none",   // Important for cross-origin
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};


  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new apiResponse(
        200,
        { user: userData, accessToken, refreshToken },
        "Login successful"
      )
    );
});

// Logout
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: undefined });
  
res
  .clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "none" })
  .clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none" })
  .status(200)
  .json(new apiResponse(200, null, "Logout successful"));

});

// Refresh Access Token
const refreshAccesstoken = asyncHandler(async (req, res) => {
  const incomingtoken = req.cookies.refreshToken || req.body.refreshToken;
  console.log("incomtokken", incomingtoken);

  if (!incomingtoken) {
    throw new apiError(401, "token is required");
  }

  try {
    const decodtekon = jwt.verify(
      incomingtoken,
      process.env.REFRESH_TOKEN_SECRET
    );
    console.log("decodtoken", decodtekon);

    const user = await User.findById(decodtekon?._id);

    if (!user) {
      throw new apiError(401, "token is invalid");
    }

    if (incomingtoken !== user.refreshToken) {
      throw new apiError(401, "token expired or already used");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateTokens(user._id);

    console.log("new accesstokn", accessToken);
    console.log("new refreshtokn", newRefreshToken);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "access token refreshed"
        )
      );
  } catch (error) {
    console.log("System time:", new Date());
    console.log("Unix time:", Math.floor(Date.now() / 1000));
    throw new apiError(500, "token is not valid");
  }
});

// Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) throw new apiError(400, "User not found");
  return res
    .status(200)
    .json(new apiResponse(200, req.user, "User retrieved successfully"));
});

export { register, login, logout, refreshAccesstoken, getCurrentUser , createAdmin};
