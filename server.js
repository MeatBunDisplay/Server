const HTTP_PORT = 80;

const http = require('http');
const fs = require('fs');

http.createServer((request, response) => {
    switch (request.url.split('?')[0]) {
        case '/index':
            fs.readFile('./index.html', 'UTF-8', (error, data) => {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.write(data);
                response.end();
            })
            break;
        case '/index.js':
            fs.readFile('./index.js', 'UTF-8', (error, data) => {
                response.writeHead(200, { 'Content-Type': 'text/javascript' });
                response.write(data);
                response.end();
            })
            break;
        case '/index.css':
            fs.readFile('./index.css', 'UTF-8', (error, data) => {
                response.writeHead(200, { 'Content-Type': 'text/css' });
                response.write(data);
                response.end();
            })
            break;
    }
}).listen(HTTP_PORT);
console.log(`HTTPサーバをポート${HTTP_PORT}番に立てたよ!!!!!`);
console.log(`http://localhost:${HTTP_PORT}/index`);