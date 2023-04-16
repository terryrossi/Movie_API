const http = require('http'),
	fs = require('fs'),
	url = require('url');

// import http from 'node:http';
// import fs from 'node:fs';
// import url from 'node:url';

http
	.createServer((request, response) => {
		let addr = request.url,
			q = url.parse(addr, true),
			filePath = '';

		fs.appendFile(
			'./log.txt',
			`URL: ${addr}
    Timestamp: ${new Date()}\n\n`,
			(err) => {
				if (err) {
					console.error(err);
				} else {
					console.log('New Record added to Log File');
				}
			}
		);
		if (q.pathname.includes('documentation')) {
			filePath = `${__dirname}/documentation.html`;
		} else {
			filePath = `index.html`;
		}
		console.log(filePath);
		fs.readFile(filePath, (err, data) => {
			if (err) {
				throw err;
			}

			response.writeHead(200, { 'content-type': 'text/html' });
			response.write(data);
			response.end();
		});
	})
	.listen(8080);
console.log('My Test Server is Running on Port 8080.');
