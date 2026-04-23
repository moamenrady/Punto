const dotenv = require("dotenv");
const mongoose = require("mongoose");
// const Message = require('./models/Message'); 

dotenv.config({ path: "./config.env" });
console.log("MONGO_URL =", process.env.MONGO_URL);
const DB = process.env.MONGO_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD || ""
);

// Connect to MongoDB
mongoose
  .connect(DB)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("💥 UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Load app
const app = require("./app");

// Start server
const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`🚀 App running on port ${port}...`);
});

const io = require('socket.io')(server, {
  cors: { origin: "*" } // عشان م يحصلش مشاكل مع الـ Frontend
});

const Message = require('./models/Message'); // الموديل اللي ظبطناه

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // 1. اليوزر بينضم لغرفة الفريق أول ما يفتح الشات
  socket.on('join_team', (teamId) => {
    socket.join(teamId);
    console.log(`User joined team room: ${teamId}`);
  });

  // 2. استقبال رسالة جديدة
  socket.on('send_message', async (data) => {
    try {
      const { teamId, senderId, senderName, text } = data;

      // حفظ في الداتابيز (الموديل هيحولهم لـ ObjectId تلقائي)
      const savedMessage = await Message.create({
        teamId,
        senderId,
        senderName,
        text
      });

      // إرسال الرسالة لكل اللي في الغرفة (بما فيهم الـ Timestamp الجديد)
      io.to(teamId).emit('receive_message', savedMessage);
    } catch (err) {
      console.error("Socket Error:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("💥 UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
