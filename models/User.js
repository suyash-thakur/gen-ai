const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true, unique: true },
    learn: { type: String, required: true },
    days: { type: String, required: true }
});




module.exports = mongoose.model('User', UserSchema);