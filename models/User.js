const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    learn: { type: String, required: true },
    days: { type: String, required: true }
});


module.exports = mongoose.model('User', UserSchema);