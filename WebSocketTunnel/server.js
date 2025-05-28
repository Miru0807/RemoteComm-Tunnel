const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (clientSocket) => {
    console.log('Client connected to tunnel server');

    let targetSocket = null;

    clientSocket.once('message', (message) => {
        const service = message.toString();
        let targetPort;

        if (service === 'chat') targetPort = 8081;
        else if (service === 'time') targetPort = 8082;
        else {
            clientSocket.send('Unknown service');
            clientSocket.close();
            return;
        }

        targetSocket = new WebSocket(`ws://localhost:${targetPort}`);

        targetSocket.on('open', () => {
            console.log(`Tunnel established to ${service} service`);

            clientSocket.on('message', msg => targetSocket.send(msg));
            targetSocket.on('message', msg => clientSocket.send(msg));
        });

        targetSocket.on('error', (err) => {
            console.error('Error connecting to service:', err);
            clientSocket.close();
        });
    });

    clientSocket.on('close', () => {
        if (targetSocket) targetSocket.close();
    });
});

console.log('Tunnel server running on ws://localhost:8080');

