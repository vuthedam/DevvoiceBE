import { Router } from "express";
import { loginAuth, registerAuth } from "./auth.controller.js";
import validBodyRequest from "../../common/utils/validBodyRequest.js";
import { loginAuthSchema, registerAuthSchema } from "./auth.schema.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validBodyRequest(registerAuthSchema),
  registerAuth
);

authRouter.post("/login", validBodyRequest(loginAuthSchema), loginAuth);

export default authRouter;
