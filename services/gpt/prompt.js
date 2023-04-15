const promptMap = {
    INIT: {
        content: 'I want to become #---# in #---# days. ask me relevant questions',
        role: 'user',
        variableCount: 2,
    },
    DIFFICULTY: {
        content: 'tell me how difficult that will be for me. Give me final answer with high / med / low',
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



module.exports = {
    getMessage,
};