const express = require("express"),
    router = express.Router();
const gpt = require('../services/gpt/gpt');
const prompt = require('../services/gpt/prompt');

const User = require('../models/user');

const pingServer = async (req, res) => {
    res.send('pong')
}


const getInfoQuestion = async (req, res) => {
    try {
        const { variables, username } = req.body;

        const message = prompt.getMessage({ promptType: 'INIT', variables });
        const response = await gpt.chatCompletion({ messages: [message] });
        let isUserExist = await User.findOne({ username });
        if (!isUserExist) {
            const user = new User({
                username,
                learn: variables[0],
                days: variables[1]
            });
            await user.save();
        }
        res.send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
}

const respondInfoQuestion = async (req, res) => {
    let messages = [];
    try {
        const { responses, username } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            res.status(401).send("Error")
        }
        const initQuestion = prompt.getMessage({ promptType: 'INIT', variables: [user.learn, user.days] });
        messages = [initQuestion];
        messages = prompt.parseToMessages({ responses });
        const message = prompt.getMessage({ promptType: 'DIFFICULTY', variables: null });
        messages.push(message);
        const response = await gpt.chatCompletion({ messages });
        res.send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
}



router.get('/ping', pingServer);
router.post('/feasibility', getInfoQuestion);
router.post('/info', respondInfoQuestion);

module.exports = router;
