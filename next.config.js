require('dotenv').config();

module.exports = {
    devIndicators: {
        autoPrerender: false,
    },
    env: {
        API_URL: process.env.NEXT_API_URL,
        REACT_APP_API_URL: process.env.REACT_APP_API_URL
    }
}