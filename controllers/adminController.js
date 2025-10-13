import {
  create,
  inspectAdmin,
  remove,
  update,
} from "../services/adminService.js";
import bcrypt from "bcrypt";

export const registerAdmin = async (req, res) => {
  try {
    const { password, ...data } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await create(hashedPassword, data);
    res.status(201).json({ message: "admin created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.session.admin.role === "admin") {
      const { role, ...data } = req.body;
      if(role) {
        return res.status(401).json({message: "you are not authenticated"})
      }
      console.log(data)
      await update(id, data);
      return res.status(200).json({ message: "admin updated successfully" });
    }
    await update(id, req.body);
    res.status(200).json({ message: "admin updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { password, email } = req.body;
    const admin = await inspectAdmin(email);

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log(isMatch)
    
    if (admin && isMatch) {
      req.session.admin = {
        _id: admin._id,
        name: admin.name,
        role: admin.role,
      };
      return res.status(200).json({ message: "Logged in successfully" });
    }
    res.status(401).json({ message: "Login failed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await remove(id);
    if(result === null) {
        res.status(409).json({ message: "admin is already deleted"});
    }
    res.status(200).json({ message: "admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
