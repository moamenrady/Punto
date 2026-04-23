const express = require("express");
const router = express.Router();
const Message = require("../models/Message")
router.get('/:teamId', async (req, res) => {
    try {
        const { teamId } = req.params;
        console.log( teamId)
        // تأكد إن الـ teamId اللي جاي في الـ Params هو نفسه اللي متخزن في الـ Message document
        const messages = await Message.find({ teamId: teamId }); 
        console.log(messages)
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;