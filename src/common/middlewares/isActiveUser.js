import createResponse from "../utils/createResponse.js";
import { USER_STATUS } from "../constants/enums.js";

const isActiveUser = (req, res, next) => {
  if (req.user?.status !== USER_STATUS.ACTIVE) {
    return res.status(403).json(createResponse(false, 403, "Your account has been banned"));
  }
  next();
};

export default isActiveUser;
