const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Helper – calculate membership end date from months.
 */
const calcMembershipEnd = (startDate, months) => {
  const end = new Date(startDate);
  end.setMonth(end.getMonth() + Number(months));
  return end;
};

/**
 * Helper – generate JWT.
 */
const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

/* ────────────────────────────────────────────────── */
/*  POST  /api/auth/register                         */
/* ────────────────────────────────────────────────── */
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, vendorCategory, membershipMonths } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!["admin", "vendor", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid registration role." });
    }

    // Check duplicate
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Build user data
    const userData = { name, email, password, phone: phone || "", role };

    if (role === "vendor") {
      if (!vendorCategory) {
        return res.status(400).json({ message: "Category is required for vendors." });
      }
      const months = Number(membershipMonths) || 6;
      userData.vendorCategory = vendorCategory;
      userData.membershipMonths = months;
      userData.membershipStart = new Date();
      userData.membershipEnd = calcMembershipEnd(new Date(), months);
    }

    const user = await User.create(userData);
    const token = generateToken(user);

    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
};

/* ────────────────────────────────────────────────── */
/*  POST  /api/auth/login                            */
/* ────────────────────────────────────────────────── */
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Optionally enforce role match
    if (role && user.role !== role) {
      return res.status(401).json({ message: `This account is not a ${role} account.` });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account has been deactivated." });
    }

    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
};

/* ────────────────────────────────────────────────── */
/*  GET  /api/auth/me                                */
/* ────────────────────────────────────────────────── */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
