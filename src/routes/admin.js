const express = require('express');
const router = express.Router();
const { writeInfo } = require('../modules/logs');


const fs = require('fs');
const dotenv = require('dotenv');

// const app = express();
// app.use(express.json());

const ENV_PATH = './config/custom.env';

// Endpoint to get environment variables
router.get('/env', (req, res) => {
    const envConfig = dotenv.parse(fs.readFileSync(ENV_PATH));
    res.json(envConfig);
});

// Endpoint to update environment variables
router.post('/env', (req, res) => {
    const newConfig = req.body;
    let envContent = '';

    for (const key in newConfig) {
        envContent += `${key}=${newConfig[key]}\n`;
    }

    fs.writeFileSync(ENV_PATH, envContent);
    res.json({ message: 'Environment variables updated successfully.' });
});

module.exports = router;
