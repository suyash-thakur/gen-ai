const express = require("express"),
    router = express.Router();
const gpt = require('../services/gpt/gpt');
const prompt = require('../services/gpt/prompt');


const pingServer = async (req, res) => {
    res.send('pong')
}
const getFeasibility = async (req, res) => {
    try {
        const { variables } = req.body;
        const message = prompt.getMessage({ promptType: 'INIT', variables });
        const response = await gpt.chatCompletion({ messages: [message] });
        res.send(response);
    } catch (error) {
        console.error(error);
        res.send('Error');
    }
}



router.get('/ping', pingServer);
router.post('/feasibility', getFeasibility);

module.exports = router;
