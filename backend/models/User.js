const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    relation: { type: String, trim: true, default: "" },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [4, "Password must be at least 4 characters"],
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "vendor", "user"],
      required: [true, "Role is required"],
    },

    /* ── Vendor-specific ── */
    vendorCategory: {
      type: String,
      enum: [
        "Caterer",
        "Decorator",
        "Photographer",
        "DJ",
        "Venue",
        "Florist",
        "Planner",
        "Other",
        "",
      ],
      default: "",
    },
    membershipStart: { type: Date },
    membershipEnd: { type: Date },
    membershipMonths: { type: Number, default: 0 },

    /* ── User-specific ── */
    guestList: [guestSchema],

    /* ── Common ── */
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/* ── Hash password before saving ── */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* ── Compare password method ── */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/* ── Remove password from JSON output ── */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
