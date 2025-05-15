import asynHandler from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/Users.modals.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (user_id) => {
  try {
    const user = await User.findById(user_id);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshtoken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // console.log(accessToken , refreshToken)
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong on sending access and refresh token "
    );
  }
};

const registerUser = asynHandler(async (req, res) => {
  // get user data from frontend
  // validation - not empty
  // check if user already exists username , email
  // check for image , avatar
  // upload them to cloudinary
  // create user object on db for entry
  // remove password and refersh token from response
  // check for user creation
  // return res

  const { fullname, email, username, password } = req.body;
  console.log("username", username, "email", email);

  // if(!fullname || !email || !username || !password){
  //     throw new ApiError("Please provide all fields" , 400)
  // }

  if (
    [fullname, username, email, password].some((fields) => fields.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  const checkExistedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (checkExistedUser) {
    throw new ApiError(409, "User Already Exist");
  }

  // check for image , avatar

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  console.log(req.files);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadFileOnCloudinary(avatarLocalPath);

  const coverImage = await uploadFileOnCloudinary(coverImageLocalPath);

  if (!avatar || !avatar.url) {
    throw new ApiError(400, "Avatar is not uploaded");
  }

  const createUser = await User.create({
    username: username.toLowerCase(),
    fullname,
    email,
    password,
    avatar: avatar.url,
    coverimage: coverImage?.url || "",
  });

  const checkUserCreated = await User.findById(createUser._id).select(
    "-password -refreshtoken" // removed in res
  );

  console.log("new user id ", createUser._id);

  if (!checkUserCreated) {
    throw new ApiError(500, "Something went wrong on user creation");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createUser, "User Created Successfully"));
});

const loginUser = asynHandler(async (req, res) => {
  console.log("req : ", req.body);

  // req body => data
  // username or email
  // find user on db
  // check password
  // provide access and refresh token
  // send cokkie

  const { username, email, password } = req.body;
  //   console.log(email);

  if (!(username || email)) {
    throw new ApiError(401, "username or email not found");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "User not found ! plz register first");
  }

  const checkPasswordIsvalidOrNot = await user.isPasswordCorrect(password);

  if (!checkPasswordIsvalidOrNot) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const logedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    // helps to make cookie not modifieble by frontend
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: logedInUser, accessToken, refreshToken },
        "User LogedIn Succesfully"
      )
    );
});

const logOutUser = asynHandler(async (req, res) => {
  const userId = req.user._id;

  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshtoken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    // helps to make cookie not modifieble by frontend
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logout Succesfully!"));
});

const accessRefreshToken = asynHandler(async (req, res) => {
  try {
    const userRefreshToken = req.cookies?.refreshToken;

    if (!userRefreshToken) {
      throw new ApiError(401, "RefreshToken not found");
    }

    const decodeToken = jwt.verify(
      userRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decodeToken) {
      throw new ApiError(401, "invalid refresh token");
    }

    const user = await User.findById(decodeToken._id);

    const { accessToken, refreshToken } = generateAccessAndRefreshToken(user);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          accessToken,
          refreshToken,
          "User Access Provided Succesfully"
        )
      )
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options);
  } catch (error) {
    throw new ApiError(
      500,
      error?.message,
      "Something went wront to provide tokens"
    );
  }
});

const updatePassword = asynHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const checkPasswordCorrect = user.isPasswordCorrect(oldPassword);

  if (!checkPasswordCorrect) {
    throw new ApiError(400, "Invalid password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "password Changed succesfully"));
});

const updateUserProfile = asynHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!(fullname || email)) {
    throw new ApiError(400, "Fullname or email is required");
  }

  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email,
      },
    },
    {
      new: true,
    }.select("-password")
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details updated succesfully"));
});

const updateUserAvatar = asynHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "File Not Found");
  }

  const avatar = uploadFileOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "error while uploading on cloudinary");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar Updadted Succefully"));
});

const updateUserCoverImage = asynHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(401, "Cover image not found");
  }

  const coverImage = uploadFileOnCloudinary(coverImageLocalPath);

  if (!coverImage) {
    throw new ApiError(400, "error while uploading on cloudinary");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverimage: coverImage.url,
      },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json(new ApiResponse(200, user, "CoverImage Changed succefully"));
});

const getUserDetails = asynHandler(async (req, res) => {
  console.log(req.user);
  
  try {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
           {userdetails:req.user} ,
          "Getting User Succesfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Unknown error",
      "Something went wrong on getting user details"
    );
  }
});

export {
  registerUser,
  loginUser,
  logOutUser,
  accessRefreshToken,
  updatePassword,
  updateUserProfile,
  updateUserAvatar,
  updateUserCoverImage,
  getUserDetails,
};


