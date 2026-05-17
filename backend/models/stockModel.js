const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Asset Name is required"],
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
    },
    vendor: {
      type: String,
      required: [true, "Vendor is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"], // مثلا pcs
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      default: 0,
    },
    minimumThreshold: {
      type: Number,
      required: [true, "Min Threshold is required"],
      default: 5,
    },
    cost: {
      type: Number,
      required: [true, "Unit Cost is required"],
      default: 0,
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      enum: ["SAR", "USD", "EUR", "GBP", "AED"], // عشان نقيد اليوزر بالعملات دي بس
      default: "SAR",
    },
    location: {
      type: String,
      // الـ location مكتوب في الصورة إنه optional (اختياري) فمش هنعمله required
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Stock", stockSchema);
