import Order from "../models/order.model.js";
import Menu from "../models/menu.model.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
  const { items, totalPrice, paymentMethod, address } = req.body;

  if (!items || items.length === 0) {
    throw new apiError(400, "Order must contain at least one item.");
  }

  for (const item of items) {
    const menuItem = await Menu.findById(item.menuItem);
    if (!menuItem) {
      throw new apiError(404, `Menu item not found: ${item.menuItem}`);
    }
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    totalPrice,
    paymentMethod,
    address,
  });

  return res
    .status(201)
    .json(new apiResponse(201, order, "Order placed successfully."));
});

const getAllOrders = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new apiError(403, "Access denied. Admins only.");
  }

  const orders = await Order.find()
    .populate("user", "Name email")
    .populate("items.menuItem", "name price");

    // console.log("thise is  more impo",orders);

  return res
    .status(200)
    .json(new apiResponse(200, orders, "All orders retrieved successfully."));
});

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.menuItem", "name price");

  return res
    .status(200)
    .json(new apiResponse(200, orders, "User orders retrieved successfully."));
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("items.menuItem", "name price");

  if (!order) {
    throw new apiError(404, "Order not found.");
  }

  return res
    .status(200)
    .json(new apiResponse(200, order, "Order retrieved successfully."));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new apiError(403, "Access denied. Admins only.");
  }

  const { status } = req.body;
  if (!["pending", "processing", "delivered", "cancelled"].includes(status)) {
    throw new apiError(400, "Invalid order status.");
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new apiError(404, "Order not found.");
  }

  order.status = status;
  await order.save();

  return res
    .status(200)
    .json(new apiResponse(200, order, "Order status updated successfully."));
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new apiError(404, "Order not found.");
  }

  await order.deleteOne();

  return res
    .status(200)
    .json(new apiResponse(200, null, "Order deleted successfully."));
});

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
