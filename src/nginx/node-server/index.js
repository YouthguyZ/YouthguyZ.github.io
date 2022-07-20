const http = require('http')

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  const currentDate = new Date().toLocaleDateString();
  const html = `
    <h1>${currentDate}</h1>
    <img src="/jerry.jpg" width="200px" height="200px" />
  `
  res.end(html);
}).listen(7777)