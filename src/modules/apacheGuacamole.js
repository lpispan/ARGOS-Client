const http = require('http');
const querystring = require('querystring');
const argosRequest = require('../base/request');
const path = require('path');
const os = require('os');
require('dotenv').config({ path: path.resolve(__dirname, '../../config/custom.env') });
const cripto = require('./encrypt');

async function getToken(request) {
  const loginData = querystring.stringify({
      username: process.env.ARGOS_SERVER_USER,
      password: cripto.decryptAES(process.env.ARGOS_SERVER_PASSWORD),
    });
 
  const options = {
    hostname: request.host.replace('http://', '').replace('https://', ''),
    port: request.port,
    path: '/guacamole/api/tokens',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };
  

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          reject(`Error parsing response data: ${error}`);
        }
      });
    });
    req.on('error', (error) => {
      reject(`Error executing request: ${error}`);
    });
    req.write(loginData);
    req.end();
  });
}


async function getData(request) {
  const options = {
    hostname: request.host.replace('http://', '').replace('https://', ''),
    port: request.port,
    path: `/guacamole/api/session/data/${request.dataSource}/connections/${request.connectionId}?token=${argosRequest.token}`,
    method: 'GET',
    headers: {
       'Content-Type': 'application/json',
    }
  };
 
  const options2 = {
    hostname: request.host.replace('http://', '').replace('https://', ''),
    port: request.port,
    path: `/guacamole/api/session/data/${request.dataSource}/connections/${request.connectionId}/parameters?token=${argosRequest.token}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  };
      
  
  const connectionData = new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          reject(`Error parsing response data: ${error}`);
        }
      });
    });
    req.on('error', (error) => {
      reject(`Error executing request: ${error}`);
    }); 
    req.end();
  });

  const connectionParameterData = new Promise((resolve, reject) => {
    const req = http.request(options2, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          reject(`Error parsing response data: ${error}`);
        }
      });
    });
    req.on('error', (error) => {
      reject(`Error executing request: ${error}`);
    }); 
    req.end();
  });
    
 
  const [repsonse1, response2] = await Promise.all([connectionData, connectionParameterData]);

  repsonse1.parameters = response2;

  return repsonse1;
}

async function updatePassword(request, data) {
  return new Promise((resolve, reject) => {
    const putData = JSON.stringify(data);

    const options = {
      hostname: request.host.replace('http://', '').replace('https://', ''),
      port: request.port,
      path: `/guacamole/api/session/data/${request.dataSource}/connections/${request.connectionId}?token=${argosRequest.token}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(putData)
      }
    };
    
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
    
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseData);
        } else {
          reject(`Error: ${res.statusCode}, ${responseData}`);
        }
      });
    });
    req.on('error', (error) => {
      reject(`Error executing request: ${error}`);
    }); 
    req.write(putData);
    req.end();
  });
}


module.exports = {
   getToken,
   getData,
   updatePassword
};