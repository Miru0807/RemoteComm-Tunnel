const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });
const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected to chat server');

    ws.on('message', (message) => {
        console.log(`Broadcasting: ${message}`);
        for (const client of clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
    });
});

console.log('Chat server running on ws://localhost:8081');

