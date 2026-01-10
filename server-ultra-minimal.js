// ULTRA MINIMAL - Just open port, nothing else
const http = require('http');

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

console.log('===================================');
console.log('ULTRA MINIMAL SERVER STARTING');
console.log('Port:', PORT);
console.log('Host:', HOST);
console.log('Node version:', process.version);
console.log('===================================');

const server = http.createServer((req, res) => {
  console.log('Request received:', req.url);
  
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK - Server is running!');
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Server is Live!</h1><p>Your server is working. Check Render dashboard.</p>');
  }
});

server.listen(PORT, HOST, () => {
  console.log('===================================');
  console.log('SERVER IS LISTENING!');
  console.log(`URL: http://${HOST}:${PORT}`);
  console.log('SUCCESS!');
  console.log('===================================');
});

server.on('error', (err) => {
  console.error('===================================');
  console.error('SERVER ERROR:', err);
  console.error('===================================');
  process.exit(1);
});
