const User = require("../models/userModel");

// Deactivate — تعطيل مؤقت
exports.deactivateAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.json({ status: "success", message: "Account deactivated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete — حذف نهائي
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ status: "success", message: "Account deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Export — تصدير البيانات
exports.exportData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email phone dept location role createdAt"
    );
    res.json({ status: "success", data: { doc: user } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};