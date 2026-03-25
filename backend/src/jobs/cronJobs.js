const cron = require('node-cron');
const newsScraperService = require('../services/newsScraperService');

/**
 * Initializes all background automated jobs for the backend system.
 */
const initCronJobs = () => {
    // Run twice a day: at 08:00 and 18:00 server time
    cron.schedule('0 8,18 * * *', async () => {
        try {
            console.log('--- Cron Job Triggered: Automated AI News Gathering ---');
            await newsScraperService.runDailyAutomation();
        } catch (error) {
            console.error('CRON ERROR: Failed to run daily news automation:', error);
        }
    });

    console.log('Enabled Background Cron Jobs: [Automated News Gathering (8AM & 6PM)]');
};

module.exports = initCronJobs;
