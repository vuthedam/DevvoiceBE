import createResponse from "../utils/createResponse.js";
import { USER_ROLE } from "../constants/enums.js";

const isAdmin = (req, res, next) => {
  if (req.user?.role !== USER_ROLE.ADMIN) {
    return res.status(403).json(createResponse(false, 403, "Forbidden: Admin only"));
  }
  next();
};

export default isAdmin;
