const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');

const handlers = require('./handlers');

const SERVER = {
    router: {
        'foo': handlers.foo,
        '404': handlers['404'],
    },
    init: function (config = {}) {
        return new Promise(function (resolve, reject) {
            SERVER.initHttp(config)
                .then(SERVER.initHttps)
                .then(resolve);
        })

    },
    initHttp: function(config){
        return new Promise(function (resolve, reject) {
            SERVER.httpServer = http.createServer(SERVER.server);
            SERVER.httpServer.listen(config.httpPort, config.hostname, () => {
                console.log(`[${process.pid}] Server running at http://${config.hostname}:${config.httpPort}/ with ${config.envName} mode.`);
                resolve(config);
            });
        })
    },
    initHttps: function(config){
        return new Promise(function (resolve, reject) {
            if (config.httpsKey && config.httpsCert) {
                const httpsOptions = {
                    key: fs.readFileSync(config.httpsKey),
                    cert: fs.readFileSync(config.httpsCert),
                };
                SERVER.httpsServer = https.createServer(httpsOptions, SERVER.server);
                SERVER.httpsServer.listen(config.httpsPort, config.hostname, () => {
                    console.log(`[${process.pid}] Server running at https://${config.hostname}:${config.httpsPort}/ with ${config.envName} mode.`);
                });
            } else {
                console.log(`WARNING: No https key and certificate found. Https server is NOT running.`);
            }
            resolve(config);
        })
    },
    server: function (req, res) {
        let parsedUrl = url.parse(req.url, true);
        let path = parsedUrl.pathname;
        let trimmedPath = path.replace(/^\/+|\/+$/g,'');
        let method = req.method.toLowerCase();
        let queryString = parsedUrl.query;
        let headers = req.headers;
        let decoder = new StringDecoder('utf-8');
        let buffer = '';

        req.on('data', function (d) {
            buffer += decoder.write(d);
        });

        req.on('end', function () {
            buffer += decoder.end();
            let request = {
                headers: headers,
                queryString: queryString,
                requestedMethod: method,
                requestedPath: trimmedPath,
                payload:  buffer,
            };

            let handler = SERVER.router[trimmedPath] || handlers[trimmedPath] || SERVER.router['404'];
            new Promise(function (resolve, reject) {
                let result = handler(request);
                res.writeHead(result.statusCode, {
                    'Content-Type': 'application/json'
                });
                result.request = request;
                result.error?reject(result): resolve(result);
            })
                .then(function (result) {
                    res.end(JSON.stringify(result));
                    console.log(`Succeeded[${result.statusCode}]: ${method} ${req.url} Payload: ${buffer || null}`);
                    console.log(`Result: `, result);
                })
                .catch(function (result) {
                    res.end(JSON.stringify(result));
                    console.log(`Failed[${result.statusCode}]: ${method} ${req.url} Payload: ${buffer || null}`);
                    console.log(`Result: `, result);
                });

        });
    }
};

module.exports = SERVER;



