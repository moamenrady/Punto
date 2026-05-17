const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Plan = require('./models/Plan');
const Counter = require('./models/Counter');

dotenv.config({ path: './config.env' });

const MONGO_URL = process.env.MONGO_URL;

const features = [
    "Project Management",
    "Chat System",
    "Ticketing System",
    "Stock Management"
];

const getCombinations = (array) => {
    const result = [];
    const f = (prefix, chars) => {
        for (let i = 0; i < chars.length; i++) {
            result.push([...prefix, chars[i]]);
            f([...prefix, chars[i]], chars.slice(i + 1));
        }
    };
    f([], array);
    return result;
};

const seedPlans = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Connected to MongoDB for plan seeding.');

        // Clear existing plans to avoid confusion
        await Plan.deleteMany();
        // Reset plan counter
        await Counter.findOneAndUpdate({ name: 'plan' }, { seq: 0 }, { upsert: true });
        console.log('Existing plans cleared.');

        const combinations = getCombinations(features);
        
        const plansToCreate = combinations.map(combo => {
            const count = combo.length;
            let price = 0;
            if (count === 1) price = 19;
            else if (count === 2) price = 35;
            else if (count === 3) price = 49;
            else if (count === 4) price = 65;

            return {
                name: combo.join(' + '),
                value: price,
                features: combo
            };
        });

        // Sort by number of features then price
        plansToCreate.sort((a, b) => a.features.length - b.features.length);

        for (const p of plansToCreate) {
            await Plan.create(p);
        }

        console.log(`Successfully created ${plansToCreate.length} plans! 🚀`);
        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedPlans();
