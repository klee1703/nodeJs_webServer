  /* 
   * To change this license header, choose License Headers in Project Properties.
   * To change this template file, choose Tools | Templates
   * and open the template in the editor.
   */
'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

let mimes = {
  'html' : 'text/html',
  '.css' : 'text/css',
  '.js'  : 'text/javascript',
  '.gif' : 'image/gif',
  '.jpg' : 'image/jpeg',
  '.png' : 'image/png'
};

// Process requests
function webserver(req, res) {
  // If the request is '/', load index.html, else load the requested file
  let baseURI = url.parse(req.url);
  let filepath = __dirname + 
    '/' + 
    (baseURI.pathname === '/' ? 'index.html' : baseURI.pathname);
  console.log("Path: " + filepath);
  
  // Check if requested file is accessible
  fs.access(filepath, fs.F_OK, error => {
    if (!error) {
      // Read file
      fs.readFile(filepath, (error, content) => {
        if (!error) {
          // Resolve content type and output file from buffer
          let contentType = mimes[path.extname[filepath]];
          res.writeHead(200, {'Content-type' : contentType});
          res.end(content, 'utf-8');
        } else {
          // Return a 500 error
          res.writeHead(500);
          res.end('The server could not read the requested file');          
        }
      });
    } else {
      // Serve a 404 (content not found)
      res.writeHead(404);
      res.end('Content not found!');
    }
  });
}

// Start HTTP server
http.createServer(webserver).listen(8081, () => {
  console.log('Server running at http://localhost:8081/');
});
  
