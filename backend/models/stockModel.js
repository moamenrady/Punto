const mongoose = require('mongoose');

const StockItemSchema = new mongoose.Schema({
  // Core Information
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true }, // Your "ID" field, usually an internal SKU
  vendor: { type: String, required: true },
  category: { type: String, required: true },
  
  // Quantities & Units
  quantity: { type: Number, default: 0, min: 0 }, // Changed "number" to "quantity"
  unit: { type: String, default: 'pcs' }, // e.g., 'meters', 'units', 'boxes'
  minimumThreshold: { type: Number, default: 5 }, // Alert level for low stock
  
  // Financials
  cost: { type: Number, required: true },
  currency: { type: String, default: 'SAR' }, // Since you're in Saudi Arabia

  // Activity Tracking
  lastAddedDate: { type: Date },
  lastRemovedDate: { type: Date }, // "last time someone took from it"
  
  // Audit Trail (Added)
  location: { type: String }, // Warehouse aisle/shelf info
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: 'In Stock'
  }
}, { timestamps: true });

// Middleware to auto-update status based on quantity
// Remove 'next' from the parameters and the call at the bottom
StockItemSchema.pre('save', async function() {
  if (this.quantity <= 0) {
    this.status = 'Out of Stock';
  } else if (this.quantity <= this.minimumThreshold) {
    this.status = 'Low Stock';
  } else {
    this.status = 'In Stock';
  }
  // No need to call next() when using an async function in modern Mongoose
});
module.exports = mongoose.model('StockItem', StockItemSchema);