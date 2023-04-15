const promptMap = {
    INIT: {
        content: `You are an expert online coach.\n I want to learn #---# in #---# days. You will ask me relevant questions to know more about me. Send the questions in an array format  like this: \n {questions:  ["question 1", "question 2", "question 3"]} \n  Don't add anything else in your reply. Only send the requested json. Ask about 5-7 questions. The questions shouldn't require more than 10 words in the answer.`,
        role: 'user',
        variableCount: 2,
    },
    DIFFICULTY: {
        content: `#---# \n\n Based on my answers, you will respond with a difficulty status and tell me how difficult is for me to learn #---# in #---# days. \n\n difficultly mapping \n VERY HARD - It's not realistic to achieve this. \n HARD - We can attempt \n MED -  This is doable \n EASY - This is very easy.  Send the difficulty status in an array format like this: \n {difficulty: "easy"} \n\n Don't add anything else in your reply. Only send the requested json.`,
        role: 'user',
        variableCount: 3
    },
    ROADMAP: {
        content: `You are an expert online coach. I want to learn #---# in #---# days. help me with a roadmap for daily task list. Only respond with the exact format as follows:\n {[{"day": 1, "task": "some task"}, {"day": 2, "task": "other task"}]} \n Don't add anything else in your response`,
        role: 'user',
        variableCount: 2
    },
};



const getMessage = ({ promptType, variables }) => {
    const prompt = promptMap[promptType];
    if (!prompt) return '';
    let message = prompt.content;
    for (let i = 0; i < prompt.variableCount; i++) {
        message = message.replace('#---#', variables[i]);
    }
    return { content: message, role: prompt.role };
}

const parseToMessages = ({ responses }) => {
    const messages = [];
    for (const response of responses) {
        const { question, answer } = response;
        if (!question || !answer) {
            continue;
        }
        messages.push({
            content: question,
            role: 'assistant'
        });
        messages.push({
            content: answer,
            role: 'user'
        })
    }
    return messages
}



module.exports = {
    getMessage,
    parseToMessages
};