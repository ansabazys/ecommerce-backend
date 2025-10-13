import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "deactive"],
    default: "active",
  },
//   total_purchase: {
//     type: Number,
//   },
}, {timestamps: true});

const User = mongoose.model("User", userSchema)
export default User;