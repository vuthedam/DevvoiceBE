import { Router } from "express";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import {
  banUser,
  createUser,
  deleteUser,
  getUserDetail,
  getUsers,
  restoreUser,
  updateUser,
} from "./user.controller.js";
import { createUserSchema, updateUserSchema } from "./user.schema.js";

const userRouter = Router();

userRouter.post("/", validBodyRequest(createUserSchema), createUser);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserDetail);
userRouter.patch("/:id", validBodyRequest(updateUserSchema), updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.delete("/soft-delete/:id", banUser);
userRouter.patch("/restore/:id", restoreUser);

export default userRouter;
