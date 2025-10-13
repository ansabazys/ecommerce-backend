import { inspectAdmin } from "../services/adminService.js";
import { inspectUser } from "../services/userService.js";

const checkExist = async (req, res, next) => {
  try {
    const user = req.originalUrl.includes("admin")
      ? await inspectAdmin(req.body.email)
      : await inspectUser(req.body);
    if (user === null) {
      return next();
    }
    res.status(409).json({ message: "Email is already exist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default checkExist;
