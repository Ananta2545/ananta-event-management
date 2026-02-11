const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

/* ────────────────────────────────────────────────── */
/*  Browse Vendors                                   */
/* ────────────────────────────────────────────────── */

// GET /api/user/vendors?category=Florist
const getVendors = async (req, res, next) => {
  try {
    const filter = { role: "vendor", isActive: true };
    if (req.query.category) {
      filter.vendorCategory = req.query.category;
    }
    const vendors = await User.find(filter).select("name email vendorCategory phone");
    res.json(vendors);
  } catch (error) {
    next(error);
  }
};

// GET /api/user/vendors/:id/products
const getVendorProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      vendorId: req.params.id,
      status: "Available",
    }).sort("-createdAt");

    res.json(products);
  } catch (error) {
    next(error);
  }
};

/* ────────────────────────────────────────────────── */
/*  Orders                                           */
/* ────────────────────────────────────────────────── */

// POST /api/user/orders
const placeOrder = async (req, res, next) => {
  try {
    const {
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
    } = req.body;

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }
    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required." });
    }

    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress: shippingAddress || {},
    });

    const populatedOrder = await Order.findById(order._id).populate("userId", "name email");
    res.status(201).json({ message: "Order placed successfully.", order: populatedOrder });
  } catch (error) {
    next(error);
  }
};

// GET /api/user/orders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("items.productId", "name image")
      .sort("-createdAt");

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// GET /api/user/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("items.productId", "name image");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.json({ order });
  } catch (error) {
    next(error);
  }
};

/* ────────────────────────────────────────────────── */
/*  Guest List                                       */
/* ────────────────────────────────────────────────── */

// GET /api/user/guests
const getGuestList = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("guestList");
    res.json(user.guestList);
  } catch (error) {
    next(error);
  }
};

// POST /api/user/guests
const addGuest = async (req, res, next) => {
  try {
    const { name, email, phone, relation } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Guest name is required." });
    }

    const user = await User.findById(req.user._id);
    user.guestList.push({ name, email, phone, relation });
    await user.save();

    res.status(201).json(user.guestList);
  } catch (error) {
    next(error);
  }
};

// PUT /api/user/guests/:guestId
const updateGuest = async (req, res, next) => {
  try {
    const { name, email, phone, relation } = req.body;
    const user = await User.findById(req.user._id);

    const guest = user.guestList.id(req.params.guestId);
    if (!guest) {
      return res.status(404).json({ message: "Guest not found." });
    }

    if (name) guest.name = name;
    if (email !== undefined) guest.email = email;
    if (phone !== undefined) guest.phone = phone;
    if (relation !== undefined) guest.relation = relation;

    await user.save();
    res.json(user.guestList);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/user/guests/:guestId
const deleteGuest = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.guestList.pull({ _id: req.params.guestId });
    await user.save();

    res.json(user.guestList);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVendors,
  getVendorProducts,
  placeOrder,
  getMyOrders,
  getOrderById,
  getGuestList,
  addGuest,
  updateGuest,
  deleteGuest,
};
