import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, default: 1, min: 1 },
    image: { type: String, default: "" },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Order must have at least one item",
      },
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: 0,
    },
    status: {
      type: String,
      enum: ["Ordered", "Received", "Ready for Shipping", "Out For Delivery", "Delivered"],
      default: "Ordered",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI"],
      required: [true, "Payment method is required"],
    },

    /* ── Shipping Details ── */
    shippingAddress: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
