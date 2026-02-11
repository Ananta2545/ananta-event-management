const User = require("../models/User");
const Order = require("../models/Order");

/**
 * Helper – calculate membership end date from months.
 */
const calcMembershipEnd = (startDate, months) => {
  const end = new Date(startDate);
  end.setMonth(end.getMonth() + Number(months));
  return end;
};

/* ────────────────────────────────────────────────── */
/*  Vendor Management                                */
/* ────────────────────────────────────────────────── */

// GET /api/admin/vendors
const getAllVendors = async (_req, res, next) => {
  try {
    const vendors = await User.find({ role: "vendor" }).sort("-createdAt");
    res.json(vendors);
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/vendors
const addVendor = async (req, res, next) => {
  try {
    const { name, email, password, phone, vendorCategory, membershipMonths } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const months = Number(membershipMonths) || 6;
    const start = new Date();

    const vendor = await User.create({
      name,
      email,
      password,
      phone: phone || "",
      role: "vendor",
      vendorCategory: vendorCategory || "Other",
      membershipMonths: months,
      membershipStart: start,
      membershipEnd: calcMembershipEnd(start, months),
    });

    res.status(201).json({ message: "Vendor added successfully.", vendor });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/vendors/:id
const updateVendor = async (req, res, next) => {
  try {
    const { name, email, phone, vendorCategory, isActive } = req.body;
    const vendor = await User.findOne({ _id: req.params.id, role: "vendor" });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    if (name) vendor.name = name;
    if (email) vendor.email = email;
    if (phone !== undefined) vendor.phone = phone;
    if (vendorCategory) vendor.vendorCategory = vendorCategory;
    if (typeof isActive === "boolean") vendor.isActive = isActive;

    await vendor.save();
    res.json({ message: "Vendor updated successfully.", vendor });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/vendors/:id/membership
const updateMembership = async (req, res, next) => {
  try {
    const { months, action } = req.body; // action: "extend" | "cancel"
    const vendor = await User.findOne({ _id: req.params.id, role: "vendor" });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    if (action === "cancel") {
      vendor.membershipEnd = new Date();
      vendor.isActive = false;
      await vendor.save();
      return res.json({ message: "Membership cancelled.", vendor });
    }

    // Extend membership
    const m = Number(months) || 6;
    const baseDate = vendor.membershipEnd > new Date() ? vendor.membershipEnd : new Date();
    vendor.membershipMonths = m;
    vendor.membershipEnd = calcMembershipEnd(baseDate, m);
    vendor.isActive = true;

    await vendor.save();
    res.json({ message: "Membership updated successfully.", vendor });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/vendors/:id
const deleteVendor = async (req, res, next) => {
  try {
    const vendor = await User.findOneAndDelete({ _id: req.params.id, role: "vendor" });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }
    res.json({ message: "Vendor deleted successfully." });
  } catch (error) {
    next(error);
  }
};

/* ────────────────────────────────────────────────── */
/*  User Management                                  */
/* ────────────────────────────────────────────────── */

// GET /api/admin/users
const getAllUsers = async (_req, res, next) => {
  try {
    const users = await User.find({ role: "user" }).sort("-createdAt");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/users
const addUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const user = await User.create({ name, email, password, phone: phone || "", role: "user" });
    res.status(201).json({ message: "User added successfully.", user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/users/:id
const updateUser = async (req, res, next) => {
  try {
    const { name, email, phone, isActive } = req.body;
    const user = await User.findOne({ _id: req.params.id, role: "user" });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (typeof isActive === "boolean") user.isActive = isActive;

    await user.save();
    res.json({ message: "User updated successfully.", user });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, role: "user" });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
};

/* ────────────────────────────────────────────────── */
/*  Dashboard Stats                                  */
/* ────────────────────────────────────────────────── */

// GET /api/admin/stats
const getDashboardStats = async (_req, res, next) => {
  try {
    const totalVendors = await User.countDocuments({ role: "vendor" });
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalOrders = await Order.countDocuments();
    const activeVendors = await User.countDocuments({
      role: "vendor",
      isActive: true,
      membershipEnd: { $gt: new Date() },
    });
    const expiredVendors = totalVendors - activeVendors;

    res.json({ totalVendors, totalUsers, totalOrders, activeVendors, expiredVendors });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVendors,
  addVendor,
  updateVendor,
  updateMembership,
  deleteVendor,
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  getDashboardStats,
};
