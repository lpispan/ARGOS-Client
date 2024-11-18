const { exec } = require('child_process');
const utils = require('../utils.js');
const argosRequest = require('../../base/request');


const COMMAND_CHANGE_PASSWORD = 'sudo passwd -u {{password}} {{user}}';
const COMMAND_ENABLE_SERVICE = 'sudo systemctl enable sshd';
const COMMAND_CHECK_SERVICE = 'sudo systemctl status sshd';
const COMMAND_START_SERVICE = 'sudo systemctl start sshd';
const COMMAND_STOP_SERVICE = 'sudo systemctl stop sshd';
const COMMAND_READ_LOGS = "tail -n 10 {{aplication}}";

function closeEnvironment() {
    prepareUser();
    if (process.env.MANAGE_SERVICE == 'true') {
        stopService();
    }
}

async function checkService() {
    let {status, message} = await executeCommand(COMMAND_CHECK_SERVICE);

    return (status && message.includes('STOPPED')) ? await startService() : status;
}

async function prepareEnvironment() {
    const status = await prepareUser();
    
    return (status && process.env.MANAGE_SERVICE == 'true') ? await checkService() : status;
}

async function prepareUser() {
    const newPassword =  utils.passwordGenerator();
    argosRequest.password = newPassword;
    
    const command = COMMAND_CHANGE_PASSWORD.replace(`{{user}}`, process.env.USER_NAME).replace(`{{password}}`, newPassword);
  
    const {status} = await executeCommand(command);
   
    return status;
}

async function readEventLogs(startDate, endDate) {
    const commandSys = COMMAND_READ_LOGS.replace('{{type}}', '/var/log/syslog').replace('{{startDate}}', startDate).replace('{{endDate}}', endDate);;
    const {status, message} = await executeCommand(commandSys);
    const commandAuth = COMMAND_READ_LOGS.replace('{{type}}', '/var/log/auth.log').replace('{{startDate}}', startDate).replace('{{endDate}}', endDate);;
    const {statu2, message2} = await executeCommand(commandAuth);
    const commandSecure = COMMAND_READ_LOGS.replace('{{type}}', '/var/log/secure').replace('{{startDate}}', startDate).replace('{{endDate}}', endDate);
    const {status2, message3} = await executeCommand(commandSecure);
    console.log(status);
    console.log(message);
    console.log(status2);
    console.log(message2);
    console.log(status3);
    console.log(message3);
}

async function startService() {
    const {status, message} = await executeCommand(COMMAND_START_SERVICE);
   
    if (status) {
        const {status2, message2} = await executeCommand(COMMAND_ENABLE_SERVICE);
        if (status2) {
            argosRequest.requestStatus = 'READY';
        }
    }

    return status;
}


async function stopService() {
    const {status, message} = await executeCommand(COMMAND_STOP_SERVICE);

    if (status) {
        argosRequest.requestStatus = null;
        argosRequest.password = null;
    }

    return status;
}

async function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            let status = true;
            let message;

            if (error) {
                status = false;
                message = error.message;
                reject({ status, message });
                return;
            }

            if (stderr) {
                status = false;
                message = stderr;
                reject({ status, message });
                return;
            }

            message = stdout;
            resolve({ status, message });
        });
    });
}

module.exports = {
    closeEnvironment,
    prepareEnvironment,
    readEventLogs
};