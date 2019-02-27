// app.js
const fs= require('fs');
const http = require('http');

fs.readFile('../../index.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(8000);
});

console.log('Node server running on port 8000');  