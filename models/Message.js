const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectID, ref: 'User', required: true },
    message: { type: String, required: true },
    role: { type: String },
    parentMessage: { type: mongoose.Schema.Types.ObjectID, ref: 'Message' },
    rank: { type: Number, required: true, },
});

module.exports = mongoose.model('Message', MessageSchema);
