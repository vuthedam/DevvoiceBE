import jwt from "jsonwebtoken";
import createResponse from "../utils/createResponse.js";
import { configenv } from "../configs/configenv.js";
import { User } from "../../modules/user/user.model.js";

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json(createResponse(false, 401, "Unauthorized"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, configenv.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json(createResponse(false, 401, "User not found"));
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json(createResponse(false, 401, "Invalid or expired token"));
  }
};

export default verifyToken;
