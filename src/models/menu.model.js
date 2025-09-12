import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    category: {
      type: String,
      enum: ["Gujarati", "Punjabi", "South Indian", "Chinese", "Snacks", "Other"],
      default: "Other",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String, // store URL of food image
    },
  },
  { timestamps: true }
);

const Menu = mongoose.model("Menu", menuSchema);
export default Menu;
