import mongoose, { Schema } from "mongoose";
import { USER_ROLE, USER_STATUS } from "../../common/constants/enums.js";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [255, "Full name cannot exceed 255 characters"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [50, "Username cannot exceed 50 characters"],
      match: [
        /^[a-z0-9_]+$/,
        "Username can only contain lowercase letters, numbers and underscore",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [255, "Email cannot exceed 255 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      type: String,
      default: null,
      trim: true,
      maxlength: [500, "Avatar URL cannot exceed 500 characters"],
    },
    role: {
      type: String,
      enum: {
        values: Object.values(USER_ROLE),
        message: "Role must be either admin or user",
      },
      default: USER_ROLE.USER,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(USER_STATUS),
        message: "Status must be either active or banned",
      },
      default: USER_STATUS.ACTIVE,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.index({ status: 1, role: 1 });

export const User = mongoose.model("User", userSchema);
