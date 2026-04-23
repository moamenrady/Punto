const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId, // تأكد إن دي ObjectId
        ref: 'backlogs', // اسم كولكشن الفرق عندك
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    senderName: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('messages', MessageSchema);