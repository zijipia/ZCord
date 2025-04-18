const WebSocket = require("ws");

function createWebSocket(url, onOpen, onMessage, onClose, onError) {
	const ws = new WebSocket(url);
	ws.on("open", onOpen);
	ws.on("message", onMessage);
	ws.on("close", onClose);
	ws.on("error", onError);
	return ws;
}

module.exports = createWebSocket;
