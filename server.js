import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        const message = JSON.parse(data);
        // Broadcast the movement to everyone EXCEPT the sender
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === 1) {
                client.send(JSON.stringify(message));
            }
        });
    });
});

console.log("Socket server running on port 8080");