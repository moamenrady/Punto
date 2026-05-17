const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// Models
const User = require("./models/userModel");
const Company = require("./models/companyModel");
const Plan = require("./models/Plan");
const Project = require("./models/projectModel");
const Team = require("./models/teamModel");
const Ticket = require("./models/ticketModel");
const Task = require("./models/taskModel");
const Counter = require("./models/Counter");
const Backlog = require("./models/backlogModel");
const Sprint = require("./models/sprintModel");
const Table = require("./models/tableModel");
const Schedule = require("./models/scheduleModel");
const Notification = require("./models/notificationModel");
const Payment = require("./models/paymentModel");
const Chat = require("./models/chatModel");
const Message = require("./models/Message");

dotenv.config({ path: "./config.env" });

const MONGO_URL = process.env.MONGO_URL;

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB for expanded seeding.");

    // 1. Get existing v2 entities
    const plans = await Plan.find({
      name: { $in: ["Basic", "Pro", "Enterprise"] },
    });
    const techFlow = await Company.findOne({ name: "TechFlow Solutions v2" });
    const users = await User.find({ company_id: techFlow?._id });
    const project = await Project.findOne({
      name: "Punto Platform Refactor v2",
    });
    const sprint = await Sprint.findOne({
      name: "Sprint 1: Infrastructure v2",
    });
    const backlog = await Backlog.findOne({ name: "Core Features v2" });

    if (!techFlow || users.length < 3) {
      console.error(
        "Basic v2 data not found. Please run the initial seeder first.",
      );
      process.exit(1);
    }

    console.log("Found existing v2 data. Adding missing collections...");

    // 2. Seed Stock (Table model)
    const stockExists = await Table.findOne({ company_id: techFlow._id });
    if (!stockExists) {
      await Table.create({
        company_id: techFlow._id,
        user_id: users[0]._id,
        filename: "Inventory_May_2026.csv",
        data: [
          new Map([
            ["Item", "MacBook Pro"],
            ["Quantity", "10"],
            ["Status", "In Stock"],
          ]),
          new Map([
            ["Item", "Dell Monitor"],
            ["Quantity", "25"],
            ["Status", "Low Stock"],
          ]),
          new Map([
            ["Item", "Logitech Mouse"],
            ["Quantity", "50"],
            ["Status", "In Stock"],
          ]),
        ],
      });
      console.log("Stock data created.");
    }

    // 3. Seed Schedules
    const scheduleExists = await Schedule.findOne({ company_id: techFlow._id });
    if (!scheduleExists) {
      const today = new Date();
      const startOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay()),
      );

      await Schedule.create({
        user_id: users[2]._id, // John Dev
        company_id: techFlow._id,
        project_id: project._id,
        week_start: startOfWeek,
        entries: [
          { day: "Sun", date: startOfWeek, shift_type: "morning" },
          {
            day: "Mon",
            date: new Date(startOfWeek.getTime() + 86400000),
            shift_type: "morning",
          },
          {
            day: "Tue",
            date: new Date(startOfWeek.getTime() + 172800000),
            shift_type: "night",
          },
          {
            day: "Wed",
            date: new Date(startOfWeek.getTime() + 259200000),
            shift_type: "off",
          },
        ],
      });
      console.log("Schedule created.");
    }

    // 4. Seed Notifications
    const notifExists = await Notification.findOne({
      company_id: techFlow._id,
    });
    if (!notifExists) {
      await Notification.insertMany([
        {
          recipient: users[1]._id,
          sender: users[2]._id,
          company_id: techFlow._id,
          type: "task",
          title: "Task Completed",
          message: "John completed the Docker environment setup.",
        },
        {
          recipient: users[0]._id,
          sender: users[3]._id,
          company_id: techFlow._id,
          type: "ticket",
          title: "New Critical Ticket",
          message: "Alice raised a VPN access issue.",
        },
      ]);
      console.log("Notifications created.");
    }

    // 5. Seed Payments
    const paymentExists = await Payment.findOne({ user_id: users[0]._id });
    if (!paymentExists) {
      await Payment.create({
        user_id: users[0]._id,
        amount: 149,
        features: [
          "Project Management",
          "Chat System",
          "Ticketing System",
          "Stock Management",
        ],
        paymentMethod: "visa",
        status: "paid",
        expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      console.log("Payment record created.");
    }

    // 6. Seed Chats & Messages
    const chatExists = await Chat.findOne({
      company_id: techFlow._id,
      type: "group",
    });
    if (!chatExists) {
      const groupChat = await Chat.create({
        type: "group",
        name: "Dev Team General",
        description: "General discussion for the development team.",
        created_by: users[1]._id,
        company_id: techFlow._id,
      });

      const msg1 = await Message.create({
        chat: groupChat._id,
        sender: users[2]._id,
        company_id: techFlow._id,
        content: "Hey everyone, I just finished the Docker setup! 🚀",
        createdAt: new Date(),
      });

      const msg2 = await Message.create({
        chat: groupChat._id,
        sender: users[1]._id,
        company_id: techFlow._id,
        content: "Great work John! Let us move to the next task.",
        createdAt: new Date(Date.now() + 1000),
      });

      groupChat.last_message = msg2._id;
      await groupChat.save();
      console.log("Chat and messages created.");
    }

    console.log("Expanded database seeding completed successfully! 🚀");
    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seed();
