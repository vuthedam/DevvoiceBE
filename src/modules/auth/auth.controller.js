import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createResponse from "../../common/utils/createResponse.js";
import handleAsync from "../../common/utils/handleAsync.js";
import { User } from "../user/user.model.js";
import { configenv } from "../../common/configs/configenv.js";

export const registerAuth = handleAsync(async (req, res) => {
  const { email, password, fullName, username } = req.body;

  const existUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existUser) {
    return res
      .status(400)
      .json(createResponse(false, 400, "Email hoặc username đã tồn tại"));
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    email,
    password: hashPassword,
    fullName,
    username,
  });

  res
    .status(201)
    .json(createResponse(true, 201, "Đăng ký thành công", newUser));
});

export const loginAuth = handleAsync(async (req, res) => {
  const { email, password } = req.body;
  const existUser = await User.findOne({ email }).select("+password");

  if (!existUser) {
    return res
      .status(400)
      .json(createResponse(false, 400, "Email hoặc mật khẩu không đúng"));
  }

  const isPasswordValid = await bcrypt.compare(password, existUser.password);
  if (!isPasswordValid) {
    return res
      .status(400)
      .json(createResponse(false, 400, "Email hoặc mật khẩu không đúng"));
  }

  const accessToken = jwt.sign(
    { userId: existUser._id },
    configenv.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { userId: existUser._id },
    configenv.JWT_REFRESH_SECRET,
    { expiresIn: "15d" }
  );

  existUser.password = undefined;

  res.status(200).json({
    ...createResponse(true, 200, "Đăng nhập thành công", existUser),
    accessToken,
    refreshToken,
  });
});
