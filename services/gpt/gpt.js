// Create endpoints for gpt completion and dalle generation
const { Configuration, OpenAIApi } = require('openai');

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    basePath: 'https://api.openai.com/v1'
});

const openai = new OpenAIApi(config);

console.log(openai);

const chatCompletion = async ({ messages }) => {
    try {
        if (!messages || messages.length === 0) throw new Error('No messages provided');
        const config = {
            model: 'gpt-3.5-turbo',
            messages,
        };
        const response = await openai.createChatCompletion(config);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error(error);
        return '';
    }
}


const imageGeneration = async ({ prompt }) => {
    try {
        if (!prompt) throw new Error('No prompt provided');
        const config = {
            prompt,
            n: 1,
            size: '512x512',
        }
        const response = await openai.imageCompletion(config);
        return response.data.images[0];
    } catch (error) {
        console.error(error);
        return '';
    }
}

module.exports = {
    chatCompletion,
    imageGeneration,
}