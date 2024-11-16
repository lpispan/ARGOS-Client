const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config/custom.env') });
const express = require('express');
const bodyParser = require('body-parser');
const { writeDebug, writeInfo } = require('./modules/logs');
const { swaggerUi, specs } = require('./modules/swagger');

const adminRoutes = require('./routes/admin');
const defaultRoutes = require('./routes/ping');
const argosRoutes = require('./routes/argos');
const elasticsearchUtils = require('./modules/elasticsearch/elasticsearchUtils');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Load global configuration
const port = process.env.ARGOS_PORT || 3000;
const useSwagger = process.env.USE_SWAGGER || true;


writeInfo('starting');
// Manage Swagger
if (useSwagger == 'true') {
    writeDebug('swaggerActive');
    app.use('/argos-client-docs', swaggerUi.serve, swaggerUi.setup(specs));
}


//Admin endpoints
app.use('/argos-client/', adminRoutes);

//Default endpoints
app.use('/argos-client/', defaultRoutes);

//ARGOS custom endpoints
app.use('/argos-client/', argosRoutes);

app.listen(port, () => {
    writeInfo('APIReady', { port: process.env.ARGOS_PORT});
});


//Elasticsearch's connections
elasticsearchUtils.schedule(process.env.INDEX_ARGOS_PATTERN,  '../ARGOS-client/config/requestIndex.json');
elasticsearchUtils.schedule(process.env.INDEX_LOG_PATTERN, '../ARGOS-client/config/logs.json');
