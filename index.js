const keycodeToMessage = require('./keycode_to_message');

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const outSocket = process.env.OUTPUT_SOCKET_PATH ? require('unix-dgram').createSocket('unix_dgram') : null;

const port = process.env.PORT;
const outSocketPath = process.env.OUTPUT_SOCKET_PATH;

app.use('/', express.static(path.join(__dirname, 'client')));

var usernames = new Map();
var userLastID = 1;

function relay(message) {
  if (outSocket) outSocket.send(message);
  else console.log(`[TEST RELAY]: ${message}`);
}

io.on('connection', (socket) => {
  function sendSystemMessage(content) {
    socket.emit('chat message', {username: 'system', content: content});
  }
  const slashCommands = {
    help: {
      description: 'list all commands',
      run: function() {
        let helpText = '\n';
        for (command in slashCommands) {
          const args = slashCommands[command]?.args?.map(arg => `«${arg}»`).join(' ');
          helpText += `/${command} ${args ? args + ' ' : ''}– ${slashCommands[command].description}\n`
        }
        sendSystemMessage(helpText);
      }
    },
    nick: {
      rawArg: true,
      args: ['new name'],
      description: 'set your nickname',
      run: function(userId, newUsername) { 
        const oldUsername = usernames.get(userId);
        usernames.set(userId, newUsername);
        io.emit('nickname change', {oldName: oldUsername, newName: newUsername});
      }
    },
    emu: {
      rawArg: true,
      args: ['command'],
      description: 'send raw wmemulator command',
      run: function(userId, command) {
        relay(Buffer.from(command));
      }
    },
    map: {
      args: ['key', 'input type', 'input_name'],
      description: '(re)map key to input',
      run: function(userId, keycode, inputType, inputName) {
        keycodeToMessage.map(userId, keycode, [inputType, inputName]);
        sendSystemMessage(`Mapped ${keycode} to ${inputType} ${inputName}`);
      }
    },
    'map-list': {
      description: 'list key-input mappings',
      run: function(userId, keycode, inputType, inputName) {
        let listing = 'Your current key-input mappings (format: key type name):\n';
        const profile = keycodeToMessage.profile(userId);
        for (keycode in profile) {
          listing += `${keycode} ${profile[keycode].join(' ')}\n`;
        }
        sendSystemMessage(listing);
      }
    }
  };
  
  const defaultUsername = `user #${userLastID++}`;
  console.error(`user connected: ${defaultUsername}`);
  usernames.set(socket.id, defaultUsername);
  io.emit('user connected', defaultUsername);
  sendSystemMessage('use /help to list all commands')
  
  socket.on('disconnect', () => {
    const currentUsername = usernames.get(socket.id);
    console.error(`user disconnected: ${currentUsername}`);
    io.emit('user disconnected', currentUsername);
  });
  
  socket.on('chat message', (message) => {
    if (message.startsWith('/')) {
      message = message.substring('/'.length).trim();
      let spaceIndex = message.indexOf(' ');
      const command = (spaceIndex === -1) ? message : message.substring(0, spaceIndex);
      if (!(command in slashCommands)) {
        sendSystemMessage('no such command; use /help to list all commands');
        return;
      }
      const commandInfo = slashCommands[command];
      message = message.substring(command.length).trim();
      const args = commandInfo?.rawArg ? [message] : message.split(' ').filter(s => s !== '');
      const expectedArgsCount = commandInfo?.args?.length ?? 0;
      if (args.length !== expectedArgsCount) {
        sendSystemMessage(`expected ${expectedArgsCount} arguments but got ${args.length}`);
        return;
      }
      commandInfo.run(socket.id, ...args);
      return;
    } else {
      io.emit('chat message', {username: usernames.get(socket.id), content: message});
    }
  });
  
  socket.on('input', (input) => {
		let code = input.code;
		if (code.startsWith("Key")) code = code.substring(3);
    
    const converted = keycodeToMessage.convert(socket.id, code);
    if (converted) {
      const [eventType, eventParam] = converted;
      const eventStatus = (input.type === 'keydown') ? '1' : '0';
      const message = Buffer.from(`${eventType} ${eventStatus} ${eventParam}`);
      relay(message);
    } else {
      console.log(`No message corresponding to key code: ${code}`);
    }
  });
  
  relay(Buffer.from('hotplug 1 nunchuk'));
});

http.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

if (outSocket) {
  outSocket.on('error', (err) => {
    console.error(err);
  });
  outSocket.on('connect', (err) => {
    console.log(`Relaying to UNIX socket at ${outSocketPath}`);
  });

  console.log(`Attempting to connect to UNIX socket at ${outSocketPath}`);
  outSocket.connect(outSocketPath);
} else {
  console.log('TEST MODE (NOT RELAYING INPUT)\nTo relay input, set env var OUTPUT_SOCKET_PATH to a (nonempty) path value');
}

