const { loadTranslations } = require('./language');
const path = require('path');
const moment = require('moment');
const os = require('os')
require('dotenv').config({ path: path.resolve(__dirname, '../../config/custom.env') });
const actualRequest = require('../base/request');
const { isNull, isUndefined } = require('lodash');
const language = process.env.LANGUAGE || 'en';
const translations = loadTranslations(language);


const writeInfo = (message, extraInfo = undefined) => {
    console.log(generateLogLine('info', message, extraInfo));
};

const writeError = (message, extraInfo = undefined) => {
    console.error(generateLogLine('info', message, extraInfo));
}
const writeDebug = (message, extraInfo = undefined) => {
    console.debug(generateLogLine('info', message, extraInfo));
};

const writeWarning = (message, extraInfo = undefined) => {
    console.warn(generateLogLine('warn', message, extraInfo));
}

const generateLogLine = (messageType, messageKey, extraInfo, action = 'configuration') => {
    let message = isUndefined(translations[messageKey]) ? messageKey : translations[messageKey];
    if (!isUndefined(extraInfo)) {
        Object.keys(extraInfo).forEach(key => {
            message = message.replace(`{{${key}}}`, extraInfo[key]);
        })
    }
  
    const log = {
        date: moment().toISOString(),
        action: action,
        host: os.hostname,
        messageType: messageType,
        requestId: isNull(actualRequest.requestId) ? 'global' : actualRequest.requestId,
        message: message
    }
    try {
        const elasticsearchUtils = require('./elasticsearch/elasticsearchUtils');
        elasticsearchUtils.addDocument(log, process.env.INDEX_LOG_PATTERN);
    } catch(error) {
        console.debug("Can't connect with ElasticSearch")
    }

    return log.date + "|" + log.host + "|" + log.requestId + "|" + log.messageType + "|" + log.message;
}

module.exports = {
    writeDebug,
    writeError,
    writeInfo,
    writeWarning
};