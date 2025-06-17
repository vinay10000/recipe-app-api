import { CronJob } from 'cron';
import { ENV } from './env.js';

// Cron job to keep the server awake by pinging the health endpoint every 10 minutes
const keepAliveJob = new CronJob(
  '*/10 * * * *', // Every 10 minutes
  async () => {
    try {
      const baseUrl = ENV.API_URL || `http://localhost:${ENV.PORT}`;
      const response = await fetch(`${baseUrl}/api/health`);
      
      if (response.ok) {
        console.log(`✅ Keep-alive ping successful at ${new Date().toISOString()}`);
      } else {
        console.log(`⚠️ Keep-alive ping returned status ${response.status} at ${new Date().toISOString()}`);
      }
    } catch (error) {
      console.error(`❌ Keep-alive ping failed at ${new Date().toISOString()}:`, error.message);
    }
  },
  null, // onComplete
  false, // start immediately
  'America/New_York' // timezone
);

// Function to start all cron jobs
export const startCronJobs = () => {
  console.log('🕒 Starting cron jobs...');
  keepAliveJob.start();
  console.log('✅ Keep-alive cron job started (runs every 10 minutes)');
};

// Function to stop all cron jobs
export const stopCronJobs = () => {
  console.log('🛑 Stopping cron jobs...');
  keepAliveJob.stop();
  console.log('✅ All cron jobs stopped');
};
