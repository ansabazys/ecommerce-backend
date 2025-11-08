import {
  createUser,
  getUser,
  getUsers,
  inspectUser,
  uptUser,
} from "../services/userService.js";
import bcrypt from "bcrypt";

export const fetchUsers = async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await getUser(id);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const resp = await uptUser(id, req.body);
    console.log(req.body);
    res.status(200).json({ message: "user updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateByUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { status, ...rest } = req.body;

    const resp = await uptUser(id, rest);
    console.log(res);
    res.status(200).json({ message: "user updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await getUser(req.session.user._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { password, ...data } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(hashedPassword, data);

    if (user) {
      const { _id, name, email } = user;
      req.session.user = { _id, name, email };
      return res.status(201).json({ message: "user created successfully" });
    }
    res.status(401).json({ message: "login failed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await inspectUser(req.body);
    if (!user) return res.status(401).json({ message: "login failed" });
    const isMatch = await bcrypt.compare(password, user.password);

    if (user.status == "inactive") {
      return res.status(401).json({ message: "Your account is disabled." });
    }

    if (user && isMatch) {
      const { _id, name, email } = user;
      req.session.user = { _id, name, email };
      return res.status(200).json(user);
    }
    res.status(401).json({ message: "login failed" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const logoutUser = async (req, res) => {
  try {
    if (req.session) {
      const role = req.session.user?.role || req.session.admin?.role
      console.log(role)
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Logout failed!" });
        }
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logout successfull!", role: role  });
      });
    } else {
      res.status(404).json({ message: "session not found" }); //
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
