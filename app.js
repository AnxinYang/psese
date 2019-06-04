const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const handlers = require('./handlers');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer(gate).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
const router = {
    'foo': handlers.foo,
    '404': handlers['404'],
};


// DO THIS SO HTTPS CAN USE AS WELL
function gate(req, res) {
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

        let handler = router[trimmedPath] || router['404'];
        console.log(handler)
        let promise = new Promise(function (resolve, reject) {
            let result = handler(request);
            res.writeHead(result.statusCode);
            result.request = request;
            result.error?reject(result): resolve(result);
        })
            .then(function (result) {
                res.end(JSON.stringify(result));
                console.log(`Succeeded: ${method} ${req.url} Payload: ${buffer || null}`);
                console.log(`Result: `, result);
                console.log(result.statusCode);
            })
            .catch(function (result) {
                res.end(JSON.stringify(result));
                console.log(`Failed: ${method} ${req.url} Payload: ${buffer || null}`);
                console.log(`Result: `, result);
            });

    });
}

