const axios = require('axios');
const { requestSessionCookie } = require('./cookieManager');

const createAxiosClient = async () => {
    // Retrieve the session cookie value
    const sessionCookie = await requestSessionCookie();

    // Configure and return the axios instance
    return axios.create({
        baseURL: 'http://127.0.0.1:3000', // Set the base URL for your API
        withCredentials: true, // Enable sending cookies with requests
        headers: {
            Cookie: `sessionId=${sessionCookie};`, // Set the Cookie header with the session ID
        },
    });
};

// Export the axios client as a promise
module.exports = {
    createAxiosClient,
};
