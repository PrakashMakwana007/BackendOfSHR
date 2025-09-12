import Menu from "../models/menu.model.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create Menu Item
const createMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price, category, available } = req.body;

  if (!name || !price) {
    throw new apiError(400, "Name and price are required.");
  }

  // ✅ Cloudinary returns `req.file.path` (full URL)
  const imageUrl = req.file ? req.file.path : null;

  const menuItem = await Menu.create({
    name,
    description,
    price,
    category,
    available,
    image: imageUrl,
  });

  return res
    .status(201)
    .json(new apiResponse(201, menuItem, "Menu item created successfully."));
});

// Get All
const getAllMenuItems = asyncHandler(async (req, res) => {
  const menuItems = await Menu.find();
  return res
    .status(200)
    .json(new apiResponse(200, menuItems, "Menu items fetched successfully."));
});

// Get By ID
const getMenuItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const menuItem = await Menu.findById(id);

  if (!menuItem) throw new apiError(404, "Menu item not found.");

  return res
    .status(200)
    .json(new apiResponse(200, menuItem, "Menu item fetched successfully."));
});

// Update
const updateMenuItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Menu.findById(id);

  if (!item) throw new apiError(404, "Menu item not found.");

  const { name, description, price, category, available } = req.body;
  const updateData = {
    name: name ?? item.name,
    description: description ?? item.description,
    price: price ?? item.price,
    category: category ?? item.category,
    available: available ?? item.available,
  };

  // ✅ update Cloudinary image if new one uploaded
  if (req.file) {
    updateData.image = req.file.path;
  }

  const updatedItem = await Menu.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return res
    .status(200)
    .json(new apiResponse(200, updatedItem, "Menu item updated successfully."));
});

// Delete
const deleteMenuItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedItem = await Menu.findByIdAndDelete(id);

  if (!deletedItem) throw new apiError(404, "Menu item not found.");

  return res
    .status(200)
    .json(new apiResponse(200, null, "Menu item deleted successfully."));
});

export {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};
  