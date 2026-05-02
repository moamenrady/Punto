const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load config
dotenv.config({ path: "./config.env" });

// Load models
const Counter = require("./models/Counter");
const User = require("./models/userModel");
const Team = require("./models/teamModel");
const Project = require("./models/projectModel");
const Backlog = require("./models/backlogModel");
const Sprint = require("./models/sprintModel");
const Task = require("./models/taskModel");
const Ticket = require("./models/ticketModel");
const WorkingTask = require("./models/WorkingTask");
const WeeklyShift = require("./models/scheduleModel");
const Plan = require("./models/Plan");
const Company = require("./models/companyModel");

const MONGO_URI = process.env.MONGO_URL || "mongodb+srv://moamenrady51:moamenrady51@cluster0.bsnoz56.mongodb.net/";

const FEATURES = [
  "Project Management",
  "Chat System",
  "Ticketing System",
  "Stock Management"
];

async function cleanAndSeedPlans() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🔥 Connected to MongoDB");

    // 1. Clear ALL collections
    console.log("🗑️ Clearing ALL data from all collections...");
    await Promise.all([
      User.deleteMany(), Team.deleteMany(), Project.deleteMany(),
      Backlog.deleteMany(), Sprint.deleteMany(), Task.deleteMany(),
      Ticket.deleteMany(), WorkingTask.deleteMany(), WeeklyShift.deleteMany(),
      Counter.deleteMany(), Plan.deleteMany(), Company.deleteMany()
    ]);
    console.log("✅ Collections cleared.");

    // 2. Generate all combinations (15 total)
    console.log("💎 Generating static plans...");
    const getAllCombinations = (arr) => {
      const result = [];
      const f = (prefix, chars) => {
        for (let i = 0; i < chars.length; i++) {
          result.push([...prefix, chars[i]]);
          f([...prefix, chars[i]], chars.slice(i + 1));
        }
      };
      f([], arr);
      return result;
    };

    const combinations = getAllCombinations(FEATURES);

    for (const combo of combinations) {
      const price = combo.length * 50;
      const sortedFeatures = [...combo].sort();
      const name = combo.length === 4 ? "Full Suite" : `${sortedFeatures.join(" + ")} Plan`;
      
      await Plan.create({
        name,
        value: price,
        features: sortedFeatures
      });
    }

    console.log(`✅ Created ${combinations.length} static plans successfully.`);
    console.log("🚀 System is now clean and ready for new users.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

cleanAndSeedPlans();
