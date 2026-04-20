// controllers/profileController.js
const User = require("../models/userModel");

// GET — جلب البيانات
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email phone photo dept location role"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ status: "success", data: { doc: user } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT — حفظ البيانات النصية
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, dept, location } = req.body;
    if (!name || !email)
      return res.status(400).json({ message: "الاسم والإيميل مطلوبين" });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, dept, location },
      { new: true, runValidators: true }
    ).select("name email phone photo dept location role");

    res.json({ status: "success", data: { doc: user } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH — رفع الصورة
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "مفيش صورة" });

    const photoUrl = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { photo: photoUrl },
      { new: true }
    ).select("photo");

    res.json({ status: "success", data: { photo: user.photo } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE — مسح الصورة
exports.removeAvatar = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { photo: "" });
    res.json({ status: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};