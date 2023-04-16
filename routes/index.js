const express = require("express"),
  router = express.Router();
const gpt = require('../services/gpt/gpt');
const prompt = require('../services/gpt/prompt');

const User = require('../models/user');
const DailyTask = require('../models/DailyTask');
const Message = require("../store/message");

const whatsapp = require('../services/whatsapp');

const pingServer = async (req, res) => {
  res.send('pong')
}

const getUser = async (mobileNumber) => {
  try {
    if (!mobileNumber) next();
    const user = await User.findOne({ mobileNumber });
    return user;
  } catch (error) {
    console.error(error);
  }
}

const signup = async (mobileNumber) => {
  try {
    if (!mobileNumber) throw new Error('Username or mobile number not provided');

    //randomly generate username
    const username = 'user' + Math.floor(Math.random() * 1000000) + 1;
    const user = new User({
      username,
      mobileNumber
    });
    await user.save();
    await whatsapp.trackUser({ name: username, mobileNumber });
  } catch (error) {
    console.error(error);
  }
}
const getInfoQuestion = async (req, res) => {
  try {
    const { variables, username } = req.body;

    const message = prompt.getMessage({ promptType: 'INIT', variables });
    const response = await gpt.chatCompletion({ messages: [message] });
    Message.add(message, 'INIT')
    Message.add(response, 'INIT')
    const user = req.user;
    if (!user) {
      const user = new User({
        username,
        learn: variables[0],
        days: variables[1]
      });
      await user.save();
    }
    if (user && user.learn !== variables[0] && user.days !== variables[1]) {
      user.learn = variables[0];
      user.days = variables[1];
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
    const { responses, } = req.body;
    const user = req.user;
    if (!user) throw new Error('User not found');
    let parsedResponse = '';
    for (const response of responses) {
      const { question, answer } = response;
      parsedResponse += `${question} - ${answer} \n`;
    }
    const message = prompt.getMessage({ promptType: 'DIFFICULTY', variables: [parsedResponse, user.learn, user.days] });
    messages.push(message);
    const response = await gpt.chatCompletion({ messages });
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error');
  }
}

const createRoadMap = async (req, res) => {

  try {
    const user = req.user;
    if (!user) throw new Error('User not found');
    const { learn, days } = user;
    const message = prompt.getMessage({ promptType: 'ROADMAP', variables: [learn, days] });
    const response = await gpt.chatCompletion({ messages: [message] });
    const tasks = JSON.parse(response);
    res.send(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error');
  }
}

const saveTasks = async (req, res) => {
  try {
    const { tasks } = req.body;
    const user = req.user;
    if (!user) throw new Error('User not found');

    for (const task of tasks) {
      console.log(task);
      const dailyTask = new DailyTask({
        user: user._id,
        day: task.day,
        task: task.task,
        dueAt: new Date(Date.now() + task.day * 24 * 60 * 60 * 1000)
      });
      await dailyTask.save();
    }

    res.send('ok');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error');
  }
}

router.post("/webhook", async (req, res) => {
  // Retrieve the request body
  const { body } = req;

  const data = body.data;

  if (
    body.type === "message_received" &&
    data.customer.phone_number === "8141235438"
  ) {
    console.log("incoming message");
    if (data.message === "Hey!") {
      await signup(data.customer.phone_number);
      await whatsapp.trackEvent({
        mobileNumber: data.customer.phone_number,
        event: 'GEN-AI-REMINDER',
        traits: {
          message1: 'Hey! I am your AI assistant. I will help you learn anything.',
          message2: 'I will also send you reminders to complete your tasks.',
          message3: 'Let\'s get started. What do you want to learn?',
        }
      });
    }
  }

  res.send({
    message: "Webhook received successfully",
  });
});

router.use(getUser);

router.get('/ping', pingServer);
router.post('/signup', signup);
router.post('/feasibility', getInfoQuestion);
router.post('/info', respondInfoQuestion);
router.post('/roadmap', createRoadMap);
router.post('/tasks', saveTasks);

module.exports = router;
