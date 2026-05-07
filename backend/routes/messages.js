const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const mongoose = require('mongoose');
const User = require('../models/userModel');
const authController = require('../controllers/authController');

router.use(authController.protect);
router.use(authController.checkFeature("Chat System"));

router.get('/dms/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find messages where chatId contains the userId and has an underscore
        const messages = await Message.find({ 
            chatId: { $regex: userId }
        });

        const dmUserIds = new Set();
        messages.forEach(msg => {
            if (msg.chatId && msg.chatId.includes('_')) {
                const ids = msg.chatId.split('_');
                const otherId = ids[0] === userId ? ids[1] : ids[0];
                if (otherId && otherId.length === 24) dmUserIds.add(otherId);
            }
        });

        const users = await User.find({ _id: { $in: Array.from(dmUserIds) } }).select('name email photo role');
        
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:chatId', async (req, res) => {
    try {
        const { chatId } = req.params;
        const isValidObjectId = mongoose.Types.ObjectId.isValid(chatId);
        
        let query = isValidObjectId 
            ? { $or: [{ teamId: chatId }, { chatId: chatId }] }
            : { chatId: chatId };

        const messages = await Message.find(query); 
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;