let ws;

function connect(service) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
    }

    ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
        ws.send(service);
        showPopup(`Connected to ${service} service`, 'green');
    };

    let firstMessage = true;

    ws.onmessage = (event) => {
        if (service === 'time' && !firstMessage) return;
        firstMessage = false;

        const reader = new FileReader();
        reader.onload = () => {
            const msg = document.createElement('div');
            msg.textContent = reader.result;
            msg.style.padding = '5px';
            msg.style.marginBottom = '4px';
            msg.style.borderRadius = '5px';
            msg.style.background = '#f0f0f0';
            document.getElementById('messages').appendChild(msg);
            document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
        };
        reader.readAsText(event.data);
    };

    ws.onclose = () => {
        showPopup('Disconnected from server', 'red');
    };
}

function sendMessage() {
    const input = document.getElementById('input');
    const msgText = input.value.trim();
    if (ws && ws.readyState === WebSocket.OPEN && msgText) {
        ws.send(msgText);

        const msg = document.createElement('div');
        msg.textContent = `(You): ${msgText}`;
        msg.style.padding = '5px';
        msg.style.marginBottom = '4px';
        msg.style.borderRadius = '5px';
        msg.style.background = '#d0f0d0';
        document.getElementById('messages').appendChild(msg);
        document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;

        input.value = '';
    }
}

function showPopup(message, color) {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.top = '10px';
    popup.style.right = '10px';
    popup.style.backgroundColor = color;
    popup.style.color = 'white';
    popup.style.padding = '10px';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    popup.style.zIndex = 1000;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3000);
}
