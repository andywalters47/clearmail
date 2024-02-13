const cors = require('cors');
const express = require('express');
const config = require('./config');
require('dotenv').config();

const app = express();
const port = config.settings.portNumber;

const { getLastTimestamp, saveLastTimestamp } = require('./utilities');
const { processEmails } = require('./processEmails');


async function main() {
    if (config.settings.runAsServerOrScript === 'server') {
        try {

            app.use(cors());
            app.use(express.json());
            app.use(express.urlencoded({extended: true}));

            app.get('/process-emails', async (req, res) => {
                try {
                    const timestamp = (req.query.timestamp) ? req.query.timestamp : await getLastTimestamp(config.settings.timestampFilePath);
                    const results = await processEmails(timestamp);

                    res.status(results.statusCode).send(results.message);
                } catch (error) {
                    console.error('Failed to process emails:', error);
                    res.status(500).send('Internal Server Error');
                }
            });

            app.listen(port, () => {
                console.log(`Server running at http://localhost:${port}`);
            });

        } catch (e) {
            console.error('Failed to start the server due to configuration error:', e);
        }
    } else {
        // Script mode
        const refreshIntervalMilliseconds = config.settings.refreshInterval * 1000; // Convert seconds to milliseconds

        const runProcessEmailsPeriodically = async () => {
            try {
                const timestamp = await getLastTimestamp(config.settings.timestampFilePath);
                await processEmails(timestamp);
                // Optionally, handle success, e.g., log a message or update the timestamp
            } catch (error) {
                console.error('Failed to process emails:', error);
            }
        };

        // Run immediately once, then schedule for periodic execution
        runProcessEmailsPeriodically();
        setInterval(runProcessEmailsPeriodically, refreshIntervalMilliseconds);
    }
}

main();