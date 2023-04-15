const mongoose = require('mongoose');

const DailyTask = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectID, ref: 'User', required: true },
    task: { type: String, required: true },
    day: { type: Number, required: true },
});

module.exports = mongoose.model('DailyTask', DailyTask);
