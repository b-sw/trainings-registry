#!/usr/bin/env node
/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
    console.error('Missing MONGO_URL in environment');
    process.exit(1);
}

const Role = {
    Admin: 'admin',
    Employee: 'employee',
    User: 'user',
};

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        role: { type: String, enum: Object.values(Role), default: Role.User, required: true },
    },
    { collection: 'users', timestamps: true },
);

const trainingSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        description: { type: String, default: '' },
        date: { type: Date, required: true },
        distance: { type: Number, required: true },
        activityType: { type: String, enum: ['running', 'cycling', 'walking'], required: true },
    },
    { collection: 'trainings', timestamps: true },
);

const User = mongoose.model('User', userSchema);
const Training = mongoose.model('Training', trainingSchema);

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 1) {
    const factor = Math.pow(10, decimals);
    return Math.round((Math.random() * (max - min) + min) * factor) / factor;
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function makeEmail(idx) {
    const n = String(idx + 1).padStart(2, '0');
    return `user${n}-${Date.now()}@box.com`;
}

function makeName(idx) {
    const n = String(idx + 1).padStart(2, '0');
    return `User ${n}`;
}

function randomPastDate(daysBack = 180) {
    const now = Date.now();
    const pastMs = randomInt(0, daysBack * 24 * 60 * 60) * 1000;
    return new Date(now - pastMs);
}

async function seed({ clear = false } = {}) {
    console.log(`Connecting to ${MONGO_URL} ...`);
    await mongoose.connect(MONGO_URL);
    console.log('Connected.');

    try {
        if (clear) {
            console.log('Clearing existing data from users and trainings collections...');
            await Promise.all([User.deleteMany({}), Training.deleteMany({})]);
            console.log('Cleared existing data.');
        }

        console.log('Generating users...');
        const userDocs = [];
        for (let i = 0; i < 20; i++) {
            userDocs.push({ email: makeEmail(i), name: makeName(i), role: Role.User });
        }

        const users = await User.insertMany(userDocs, { ordered: false });
        console.log(`Inserted ${users.length} users.`);

        const activities = ['running', 'cycling', 'walking'];
        const trainingsToInsert = [];

        console.log('Generating trainings for each user...');
        for (const user of users) {
            const count = randomInt(0, 30);
            for (let i = 0; i < count; i++) {
                trainingsToInsert.push({
                    userId: user._id.toString(),
                    description: randomChoice([
                        'Morning workout',
                        'Evening session',
                        'Tempo run',
                        'Easy ride',
                        'Trail walk',
                        'Intervals',
                        'Recovery',
                        'Long distance',
                        'Hill repeats',
                    ]),
                    date: randomPastDate(180),
                    distance: randomFloat(1, 20, 1),
                    activityType: randomChoice(activities),
                });
            }
        }

        if (trainingsToInsert.length > 0) {
            const trainings = await Training.insertMany(trainingsToInsert, { ordered: false });
            console.log(`Inserted ${trainings.length} trainings.`);
        } else {
            console.log('No trainings to insert (all users received 0 trainings).');
        }

        console.log('Seeding completed successfully.');
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

const args = process.argv.slice(2);
const clear = args.includes('--clear');

seed({ clear });
