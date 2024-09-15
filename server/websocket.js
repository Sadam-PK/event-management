const WebSocket = require('ws');

// Create a WebSocket server and attach it to the HTTP server
function createWebSocketServer(httpServer) {
  const wss = new WebSocket.Server({ server: httpServer });

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
      console.log(`Received message => ${message}`);
      // Broadcast message to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
}

module.exports = createWebSocketServer;
