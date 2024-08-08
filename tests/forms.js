const { axiosClient } = require('./utils/axiosClient');
const dashboard = require('./utils/dashboardInstance');

(async () => {
    await dashboard.start();

    try {
        const client = await axiosClient;
    } catch (error) {
        console.error('Request error:', error);
    }
})();
