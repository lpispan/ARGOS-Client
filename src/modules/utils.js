const path = require('path');
const https = require('https');
require('dotenv').config({ path: path.resolve(__dirname, '../../config/custom.env') });


async function executePostRequest(host, port, path, data) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);

        const options = {
            hostname: host,
            port: port,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
            },
        };

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: responseData,
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        // Write the data to the request body
        req.write(postData);
        req.end();
    });
}

function passwordGenerator() {
    const numberSet = '0123456789';
    const specialSet = process.env.SPECIAL_CHARACTERS_ALLOW;
    const maxLength = process.env.MAX_LENGTH;
    const characters = process.env.CHARACTERS_ALLOW;
    let password = '';

    if (process.env.USE_NUMBER) {
        const randomNumber = numberSet[Math.floor(Math.random() * numberSet.length)];
        password += randomNumber;
    }
    
    if (process.env.USE_SPECIAL_CHARACTER) {
        const randomSpecialCharacter = specialSet[Math.floor(Math.random() * specialSet.length)];
        password += randomSpecialCharacter;
    }
    
    for (let i = 1; i < maxLength; i++) {
        const randomIndex = Math.floor(Math.random() * maxLength);
        password += characters[randomIndex];
    }

    password = password.split('').sort(() => Math.random() - 0.5).join('');

    return password;
}

module.exports = {
    executePostRequest,
    passwordGenerator
};