const { google } = require("googleapis");
const dotenv = require("dotenv");
dotenv.config();

// Set up the Google Search API client
const customsearch = google.customsearch("v1");
const apiKey = process.env.API_KEY;
const searchEngineId = process.env.SEARCH_ENGINE_ID;

async function getSearchResults(query) {
    try {
        const res = await customsearch.cse.list({
            auth: apiKey,
            cx: searchEngineId,
            q: query,
            num: 10, // Number of results to fetch
            sort: "date:r:0", // Sort by date in reverse chronological order
            dateRestrict: "day", // Only fetch results from the last 24 hours
        });
        const items = res.data.items;
        console.log(items);
        const results = items.map((item) => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet,
        }));
        return results;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    getSearchResults,
};







