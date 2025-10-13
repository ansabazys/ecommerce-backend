import { createUser, getUser, getUsers, inspectUser, uptUser } from "../services/userService.js";
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
    await uptUser(id, req.body);
    res.status(200).json({message: "user updated successfully"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const registerUser = async (req, res) => {
  try {
    const { password, ...data } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(hashedPassword, data);
    res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await inspectUser(req.body);
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      const { _id, name, email } = user;
      req.session.user = { _id, name, email };
      return res.status(200).json({ message: "logged in successfully" });
    }
    res.status(401).json({ message: "login failed" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const logoutUser = async (req, res) => {
  try {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Logout failed!" });
        }
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logout successfull!" });
      });
    } else {
      res.status(404).json({ message: "session not found" }); //
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
