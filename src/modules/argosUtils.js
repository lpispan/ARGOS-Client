const win = require('./externalScripts/windows');
const linux = require('./externalScripts/linux');
const { writeError, writeInfo } = require('../modules/logs');
const { isUndefined } = require('lodash');
const moment = require('moment');
const path = require('path');
const argosRequest = require('../base/request');
const os = require('os');
require('dotenv').config({ path: path.resolve(__dirname, '../../config/custom.env') });
const cripto = require('./encrypt');
const guaca = require('./apacheGuacamole');

let logsInterval;

async function executeLogout(request) {
    argosRequest.requestId = null;

    const platform = os.platform();
    if ('win32' === platform) {
        await win.closeEnvironment();
    } else {
        await linux.closeEnvironment();
    }
    const newCredentials = {};
    newCredentials.password = "";
    newCredentials.username = "",
    await getARGOSServerData(request, newCredentials, true);
    clearInterval(logsInterval);
}

async function executeRequest(request) {
    const { requestId } = request;
    argosRequest.requestId = requestId;

    const platform = os.platform();
    if ('win32' === platform) {
       await win.prepareEnvironment();
    } else {
        await linux.prepareEnvironment();
    }
    logsInterval = setInterval(async () => {
        const startDate = moment().add(-5, 'seconds').format('YYYY-MM-DD HH:mm:ss');
        const endDate  = moment().format('YYYY-MM-DD HH:mm:ss')
       
        if ('win32' === platform) {
        await win.readEventLogs(startDate, endDate);
        } else {
            await win.readEventLogs(startDate, endDate);
        }
    }, 5 * 1000);

    const newCredentials = {};
    newCredentials.password = argosRequest.password;
    newCredentials.username = process.env.USER_NAME;

    await getARGOSServerData(request, newCredentials, false);
}

async function getARGOSServerData(request, newCredentials, isReset) {
    try {
        const token = await guaca.getToken(request);

        argosRequest.token = token.authToken;
        await sleep(1000);
        let data = await guaca.getData(request);
        data.attributes['guacd-hostname'] = isReset ? '' : data.parameters.hostname;
        data.attributes['guacd-port'] = isReset ? '' : process.env.ARGOS_PORT;
        data.parameters.password = newCredentials.password;
        data.parameters.username = newCredentials.username;
        await sleep(1000);
        await guaca.updatePassword(request, data);
        await sleep(1000);
        argosRequest.requestStatus = "READY";
    } catch (Error) {
        writeError(Error);
        argosRequest.requestStatus = "ERROR";
    }
}

function decryptRequest(request) {
    const decryptRequest = {};
    decryptRequest.requestId = cripto.decrypt(request.requestId);
    decryptRequest.ticketId = cripto.decrypt(request.ticketId);
    decryptRequest.host = cripto.decrypt(request.host);
    decryptRequest.port = cripto.decrypt(request.port);
    decryptRequest.userId = cripto.decrypt(request.userId);
    decryptRequest.dataSource = cripto.decrypt(request.dataSource);
    decryptRequest.connectionId = cripto.decrypt(request.connectionId);

    return decryptRequest;
}


function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

function validateRequest(request) {
    const { requestId, ticketId, host, port, userId, dataSource, connectionId} = request;
 
    writeInfo('executingNewRequest', {requestId});
    let status = true;
    let reason;

    if (isUndefined(requestId)) {
        writeError('missingRequestField', {fieldName: 'requestId'});
        status = status && false;
    }
    if (isUndefined(ticketId)) {
        writeError('missingRequestField', {fieldName: 'ticketId'});
        status = status && false;
    }
    if (isUndefined(userId)) {
        writeError('missingRequestField', {fieldName: 'userId'});
        status = status && false;
    }
    if (isUndefined(host)) {
        writeError('missingRequestField', {fieldName: 'host'});
        status = status && false;
    }
    if (isUndefined(port)) {
        writeError('missingRequestField', {fieldName: 'port'});
        status = status && false;
    }
    if (isUndefined(dataSource)) {
        writeError('missingRequestField', {fieldName: 'dataSource'});
        status = status && false;
    }
    if (isUndefined(connectionId)) {
        writeError('missingRequestField', {fieldName: 'connectionId'});
        status = status && false;
    }


    if (!status) {
        reason = 'Missing mandatory fields';
    } else {
        const cleanHost = host.replace('http://', '').replace('https://', '');
        if (!process.env.HOST_WHITELIST.includes(cleanHost)) {
            status = false;
            reason = 'Host indicated is not valid'
        } 
    }

    return { status, reason};
}


module.exports = {
    executeLogout,
    executeRequest,
    decryptRequest,
    validateRequest
};