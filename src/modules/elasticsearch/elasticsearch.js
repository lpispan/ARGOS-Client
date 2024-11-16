const { Client } = require('@elastic/elasticsearch');
const path = require('path');
const cripto = require('../encrypt');
require('dotenv').config({ path: path.resolve(__dirname, '../../../config/custom.env') });


const client = new Client({
  node:  process.env.ELASTICSEARCH_URL,
  auth: {
    username: process.env.ELASTICSEARCH_USER, 
    password: cripto.decryptAES(process.env.ELASTICSEARCH_PASSWORD),
  },
});

module.exports = client;
