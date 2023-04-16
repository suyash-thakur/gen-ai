require("dotenv").config();
const mongoose = require("mongoose");
const connection_url = process.env.DB_URL;


mongoose.connect(connection_url, {

}).then(() => {
    console.log("Connected to database!");
}).catch(() => {
    console.log("Connection failed!");
});

const DailyTask = require('../models/DailyTask');
const User = require('../models/user');
const whatsapp = require('../services/whatsapp');


const sendReminder = async () => {
    const today = new Date();
    const endDate = new Date(Date.now() + 5 * 60 * 1000);

    const tasks = await DailyTask.find({
        dueAt: {
            $gte: today,
            $lt: endDate
        }
    });

    for (const task of tasks) {
        const user = await User.findById(task.user);
        const traits = {};
        traits.message1 = 'Have you completed your following task?';
        traits.message2 = task.task;
        traits.message3 = 'If yes, please reply with "Yes". If no, please reply with "No".';
        await whatsapp.trackEvent({ traits, mobileNumber: user.mobileNumber, event: 'GEN-AI-REMINDER' });
    }
}

const main = async () => {
    await sendReminder();
    process.exit(0);
}

main();