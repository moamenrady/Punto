const { faker } = require("@faker-js/faker");
const dotenv = require("dotenv");

// Load config
dotenv.config({ path: "./config.env" });

// استدعاء الموديلز
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
const mongoose = require("mongoose");

// رابط قاعدة البيانات
const MONGO_URI = process.env.MONGO_URL || "mongodb+srv://moamenrady51:moamenrady51@cluster0.bsnoz56.mongodb.net/";

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🔥 Connected to MongoDB");

    // ==========================================
    // 1. مسح البيانات القديمة
    // ==========================================
    console.log("🗑️ Clearing old data...");
    await Promise.all([
      User.deleteMany(), Team.deleteMany(), Project.deleteMany(),
      Backlog.deleteMany(), Sprint.deleteMany(), Task.deleteMany(),
      Ticket.deleteMany(), WorkingTask.deleteMany(), WeeklyShift.deleteMany(),
      Counter.deleteMany(), Plan.deleteMany(), Company.deleteMany()
    ]);

    // ==========================================
    // 2. إنشاء الخطط (Plans) - All 15 Combinations
    // ==========================================
    console.log("💎 Creating All Plan Combinations...");
    const features = [
      "Project Management",
      "Chat System",
      "Ticketing System",
      "Stock Management"
    ];

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

    const combinations = getAllCombinations(features);
    const plans = [];

    for (const combo of combinations) {
      const price = combo.length * 50;
      const name = combo.length === 4 ? "Full Suite Plan" : `${combo.join(" & ")} Plan`;
      const plan = await Plan.create({
        name,
        value: price,
        features: combo.sort()
      });
      plans.push(plan);
    }
    console.log(`✅ Created ${plans.length} plan combinations.`);

    const fullSuitePlan = plans.find(p => p.features.length === 4);

    // ==========================================
    // 3. إنشاء الشركات (Companies)
    // ==========================================
    console.log("🏢 Creating Companies...");
    const companyA = await Company.create({
      name: "Tech Corp",
      plan_id: fullSuitePlan._id,
      industry: "Technology",
      website: "techcorp.com"
    });
    const companyB = await Company.create({
      name: "Retail Solutions",
      plan_id: plans[0]._id,
      industry: "Retail",
      website: "retailsolutions.io"
    });
    const companies = [companyA, companyB];

    // ==========================================
    // 4. إنشاء المستخدمين (Users)
    // ==========================================
    console.log("👤 Creating Users...");
    const users = [];
    for (let i = 0; i < 40; i++) {
      const assignedCompany = companies[i % 2];
      const user = await User.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "password123",
        confirmPassword: "password123",
        role: i < 6 ? "admin" : "user",
        dept: faker.helpers.arrayElement(["Engineering", "Support", "QA", "Design"]),
        company_id: assignedCompany._id,
        createdAt: faker.date.past({ years: 1 })
      });
      users.push(user);
    }

    // تحديث الشركات بقائمة المستخدمين والمدراء
    for (let company of companies) {
      const companyUsers = users.filter(u => u.company_id.toString() === company._id.toString());
      const userIds = companyUsers.map(u => u._id);

      await Company.findByIdAndUpdate(company._id, {
        company_users: userIds,
        managers: [userIds[0]] // تعيين أول مستخدم كمدير للشركة
      });
      // تحديث دور أول مستخدم ليكون مديراً
      await User.findByIdAndUpdate(userIds[0], { role: "manager" });
    }

    // ==========================================
    // 5. إنشاء الفرق (Teams)
    // ==========================================
    console.log("👥 Creating Teams...");
    const teams = [];
    for (let i = 0; i < 6; i++) {
      const assignedCompany = companies[i % 2];
      const companyUsers = users.filter(u => u.company_id.toString() === assignedCompany._id.toString());

      const team = await Team.create({
        name: `${faker.commerce.department()} Team`,
        description: faker.lorem.sentence(),
        members: companyUsers.slice(0, 5).map(u => ({ user: u._id, role: "member" })),
        company_id: assignedCompany._id
      });
      teams.push(team);
    }

    // ==========================================
    // 6. إنشاء المشاريع والـ Backlogs
    // ==========================================
    console.log("📁 Creating Projects & Backlogs...");
    const projects = [];
    const backlogs = [];
    for (let i = 0; i < 4; i++) {
      const assignedCompany = companies[i % 2];
      const companyUsers = users.filter(u => u.company_id.toString() === assignedCompany._id.toString());

      const project = await Project.create({
        name: faker.company.catchPhrase(),
        description: faker.lorem.paragraph(),
        created_by: companyUsers[0]._id,
        company_id: assignedCompany._id
      });
      projects.push(project);

      const backlog = await Backlog.create({
        name: `${project.name} Backlog`,
        project_id: project._id,
        company_id: assignedCompany._id
      });
      backlogs.push(backlog);
    }

    // ==========================================
    // 7. إنشاء السبرنتات (Sprints)
    // ==========================================
    console.log("🏃 Creating Sprints...");
    const sprints = [];
    for (let project of projects) {
      const sprint = await Sprint.create({
        name: `Sprint 1 - ${project.name}`,
        project_id: project._id,
        status: "active",
        company_id: project.company_id
      });
      sprints.push(sprint);
    }

    // ==========================================
    // 8. إنشاء المهام (Tasks)
    // ==========================================
    console.log("✅ Creating Tasks...");
    for (let backlog of backlogs) {
      const assignedProject = projects.find(p => p._id.toString() === backlog.project_id.toString());
      const assignedSprint = sprints.find(s => s.project_id.toString() === assignedProject._id.toString());
      const companyUsers = users.filter(u => u.company_id.toString() === assignedProject.company_id.toString());

      for (let j = 0; j < 5; j++) {
        await Task.create({
          name: faker.hacker.verb() + " " + faker.hacker.noun(),
          description: faker.lorem.sentence(),
          status: faker.helpers.arrayElement(["To Do", "In Progress", "Completed"]),
          priority: faker.helpers.arrayElement(["low", "medium", "high"]),
          backlog_id: backlog._id,
          sprint_id: assignedSprint._id,
          assigned_to: [companyUsers[Math.floor(Math.random() * companyUsers.length)]._id],
          company_id: assignedProject.company_id
        });
      }
    }

    // ==========================================
    // 9. إنشاء التذاكر والشفتات
    // ==========================================
    console.log("🎫 Creating Tickets & Shifts...");
    for (let i = 0; i < 30; i++) {
      const creator = users[Math.floor(Math.random() * users.length)];
      await Ticket.create({
        name: `Issue: ${faker.hacker.phrase()}`,
        description: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(["open", "in-progress", "closed"]),
        category: faker.helpers.arrayElement(["Software", "Hardware", "Network", "Access"]),
        created_by: creator._id,
        company_id: creator.company_id
      });
    }

    for (let team of teams) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);

      const membersShifts = team.members.map(member => ({
        user: member.user,
        shifts: { mon: "Morning", tue: "Morning", wed: "Afternoon", thu: "Afternoon", fri: "Off", sat: "Off", sun: "Off" }
      }));

      await WeeklyShift.create({
        team_id: team._id,
        week_start: weekStart,
        members: membersShifts,
        company_id: team.company_id
      });
    }

    console.log("✅✅ All Dummy Data Seeded Successfully with Multi-Layer Security & All Plan Combinations!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seedData();