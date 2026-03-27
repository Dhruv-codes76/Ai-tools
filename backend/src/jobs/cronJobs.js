const cron = require('node-cron');
const newsScraperService = require('../services/newsScraperService');

/**
 * Initializes all background automated jobs for the backend system.
 */
const initCronJobs = () => {
    // Run 3x a day: 8AM (morning news), 1PM (midday update), 6PM (evening wrap)
    cron.schedule('0 8,13,18 * * *', async () => {
        try {
            console.log('--- Cron Job Triggered: Automated AI News Gathering ---');
            // Rotate starting key on each run to spread load across all 3 accounts
            newsScraperService.rotateApiKey();
            await newsScraperService.runDailyAutomation();
        } catch (error) {
            console.error('CRON ERROR: Failed to run daily news automation:', error);
        }
    });

    console.log('Enabled Background Cron Jobs: [Automated News Gathering (8AM, 1PM & 6PM)]');
};

module.exports = initCronJobs;
