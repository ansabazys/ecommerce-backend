import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
      enum: ["active", "inactive"],
      default: "active",
    },
    address: { type: Object },
    //   total_purchase: {
    //     type: Number,
    //   },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
