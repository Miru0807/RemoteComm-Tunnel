let socket;

function connectService() {
    const service = document.getElementById('service').value;
    const url = service === 'time' ? 'ws://localhost:8080' : 'ws://localhost:8080';
    socket = new WebSocket(url);

    socket.onmessage = (event) => {
        const messages = document.getElementById('messages');
        const li = document.createElement('li');
        li.textContent = event.data;
        messages.appendChild(li);
    };

    document.getElementById('message').disabled = service !== 'chat';
    document.querySelector('button[onclick="sendMessage()"]').disabled = service !== 'chat';
}

function sendMessage() {
    const input = document.getElementById('message');
    socket.send(input.value);
    input.value = '';
}
