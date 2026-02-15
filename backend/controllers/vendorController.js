import Product from "../models/Product.js";
import Order from "../models/Order.js";

const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ vendorId: req.user._id }).sort(
      "-createdAt",
    );
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const addProduct = async (req, res, next) => {
  try {
    const { name, price, status } = req.body;

    if (!name || price === undefined) {
      return res
        .status(400)
        .json({ message: "Product name and price are required." });
    }

    const image = req.file ? req.file.filename : "";

    const product = await Product.create({
      vendorId: req.user._id,
      name,
      price: Number(price),
      image,
      ...(status && { status }),
    });

    res.status(201).json({ message: "Product added successfully.", product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { name, price, status } = req.body;
    const product = await Product.findOne({
      _id: req.params.id,
      vendorId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (name) product.name = name;
    if (price !== undefined) product.price = Number(price);
    if (status) product.status = status;
    if (req.file) product.image = req.file.filename;

    await product.save();
    res.json({ message: "Product updated successfully.", product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      vendorId: req.user._id,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    next(error);
  }
};

const getVendorOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "items.vendorId": req.user._id })
      .populate("userId", "name email")
      .sort("-createdAt");

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "Ordered",
      "Received",
      "Ready for Shipping",
      "Out For Delivery",
      "Delivered",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status." });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const hasItems = order.items.some(
      (item) => item.vendorId.toString() === req.user._id.toString(),
    );
    if (!hasItems) {
      return res
        .status(403)
        .json({ message: "You don't have items in this order." });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated.", order });
  } catch (error) {
    next(error);
  }
};

const getVendorDashboard = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments({
      vendorId: req.user._id,
    });

    const orders = await Order.find({ "items.vendorId": req.user._id });
    const totalOrders = orders.length;

    let totalRevenue = 0;
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (
          item.vendorId &&
          item.vendorId.toString() === req.user._id.toString()
        ) {
          totalRevenue += item.price * item.qty;
        }
      });
    });

    res.json({ totalProducts, totalOrders, totalRevenue });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      vendorId: req.user._id,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export {
  getMyProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getVendorOrders,
  updateOrderStatus,
  getVendorDashboard,
};
