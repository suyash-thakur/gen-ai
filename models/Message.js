const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectID, ref: 'User', required: true },
    message: { type: String, required: true },
    response: { type: String }
});

module.exports = mongoose.model('Message', MessageSchema);
