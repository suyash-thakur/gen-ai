const promptMap = {
    INIT: {
        content: 'I want to become #---# in #---# days. ask me relevant questions to gauge the difficulty to achieve this. There should be maximum 5 questions',
        role: 'user',
        variableCount: 2,
    },
    DIFFICULTY: {
        content: 'based on the provided info, tell me how difficult it will be for me. Give me final answer with just high / med / low',
        role: 'user',
        variableCount: 0
    }
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