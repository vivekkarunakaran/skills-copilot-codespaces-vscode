//Create a web server
const http = require('http');
const fs = require('fs');
const url = require('url');

const server = http.createServer((req, res) => {
    const path = url.parse(req.url).pathname;
    if (path === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.readFile(__dirname + '/index.html', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.write('Error: File not found');
            } else {
                res.write(data);
            }
            res.end();
        });
    } else if (path === '/comments') {
        if (req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            fs.readFile(__dirname + '/comments.json', (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.write('Error: File not found');
                } else {
                    res.write(data);
                }
                res.end();
            });
        } else if (req.method === 'POST') {
            let body = '';
            req.on('data', data => {
                body += data;
            });
            req.on('end', () => {
                const comment = JSON.parse(body);
                fs.readFile(__dirname + '/comments.json', (err, data) => {
                    if (err) {
                        res.writeHead(404);
                        res.write('Error: File not found');
                    } else {
                        const comments = JSON.parse(data);
                        comments.push(comment);
                        fs.writeFile(__dirname + '/comments.json', JSON.stringify(comments), 'utf-8', err => {
                            if (err) {
                                res.writeHead(500);
                                res.write('Error: Internal Server Error');
                            } else {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.write(JSON.stringify(comments));
                            }
                            res.end();
                        });
                    }
                });
            });
        } else {
            res.writeHead(405);
            res.write('Error: Method not allowed');
            res.end();
        }
    } else {
        res.writeHead(404);
        res.write('Error: Route not found');
        res.end();
    }
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
