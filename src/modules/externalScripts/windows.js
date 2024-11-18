const { exec, spawn } = require('child_process');
const utils = require('../utils.js');
const argosRequest = require('../../base/request');


const COMMAND_CHANGE_PASSWORD = 'net user "{{user}}" {{password}}';
const COMMAND_CHECK_SERVICE = 'sc query TermService';
const COMMAND_START_SERVICE = 'sc start "TermService"';
const COMMAND_STOP_SERVICE = 'sc stop "TermService"';
const COMMAND_READ_LOGS = "Get-EventLog -LogName {{type}} -After '{{startDate}}' -Before '{{endDate}}' | ConvertTo-Json -Depth 1";

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

async function readEventLogs(startDate, endDate, request) {
    const command = COMMAND_READ_LOGS.replace('{{type}}', 'System').replace('{{startDate}}', startDate).replace('{{endDate}}', endDate);
    await executePowerShellLogs(command, request);

    const command2 = COMMAND_READ_LOGS.replace('{{type}}', 'Application').replace('{{startDate}}', startDate).replace('{{endDate}}', endDate);
    await executePowerShellLogs(command2, request);
}

async function startService() {
    const {status, message} = await executeCommand(COMMAND_START_SERVICE);
   
    if (status) {
        argosRequest.requestStatus = 'READY';
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

async function executePowerShellLogs(command, request) {
    const powershell = spawn('powershell', ['-Command', command]);
   
    powershell.stdout.on('data', (data) => {
        try {
            const log = JSON.parse(data);

            const newData = {
                date: moment().toISOString(),
                requestId: request.requestId,
                userId: request.userId,
                argosUser: log.UserName,
                ticketId: request.ticketId,
                host: request.host,
                lotgType: 'System',
                eventId: log.EventID,
                entryType: log.EntryType,
                message: log.message,
                source: log.Source
            }
            try {
                const elasticsearchUtils = require('./elasticsearch/elasticsearchUtils');
                elasticsearchUtils.addDocument(newData, process.env.INDEX_ARGOS_PATTERN);
            } catch(error) {
                console.debug("Can't connect with ElasticSearch")
            }
        } catch(error) {
            console.log(error)
        }
    });
}

module.exports = {
    closeEnvironment,
    prepareEnvironment,
    readEventLogs
};