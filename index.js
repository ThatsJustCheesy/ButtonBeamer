const keycodeToMessage = require('./keycode_to_message');

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const outSocket = require('unix-dgram').createSocket('unix_dgram');

const port = process.env.PORT;
const outSocketPath = process.env.OUTPUT_SOCKET_PATH;

app.use('/', express.static(path.join(__dirname, 'client')));

var usernames = new Map();
var userLastID = 1;

io.on('connection', (socket) => {
  const defaultUsername = `user #${userLastID++}`;
  console.error(`user connected: ${defaultUsername}`);
  usernames.set(socket.id, defaultUsername);
  io.emit('user connected', defaultUsername);
  
  socket.on('disconnect', () => {
    const currentUsername = usernames.get(socket.id);
    console.error(`user disconnected: ${currentUsername}`);
    io.emit('user disconnected', currentUsername);
  });
  
  socket.on('chat message', (message) => {
    const currentUsername = usernames.get(socket.id);
    
    if (message.startsWith('/nick ')) {
      message = message.substring('/nick'.length).trim();
      const oldUsername = currentUsername;
      usernames.set(socket.id, message);
      io.emit('nickname change', {oldName: oldUsername, newName: message});
    } else {
      io.emit('chat message', {username: currentUsername, content: message});
    }
  });
  
  socket.on('input', (input) => {
		let code = input.code;
		if (code.startsWith("Key")) code = code.substring(3);
    
    const converted = keycodeToMessage(code);
    if (converted) {
      const [eventType, eventParam] = converted;
      const eventStatus = (input.type === 'keydown') ? '1' : '0';
      const message = Buffer.from(`${eventType} ${eventStatus} ${eventParam}`);
      outSocket.send(message);
    } else {
      console.log(`No message corresponding to key code: ${code}`);
    }
  });
  
  outSocket.send(Buffer.from('hotplug 1 classic'));
});

http.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

outSocket.on('error', (err) => {
  console.error(err);
});
outSocket.on('connect', (err) => {
  console.log(`Relaying to UNIX socket at ${outSocketPath}`);
});

outSocket.connect(outSocketPath);
