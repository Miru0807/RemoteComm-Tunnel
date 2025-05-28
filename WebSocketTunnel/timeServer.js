const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8082 });

wss.on('connection', (ws) => {
    console.log('Client connected to time server');

    const interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            const now = new Date().toLocaleTimeString();
            ws.send(`Server time: ${now}`);
        }
    }, 2000); // send every 2 seconds

    ws.on('close', () => {
        clearInterval(interval);
    });
});

console.log('Time server running on ws://localhost:8082');
 
