$(function() {
  var socket = io();
  $('.message-form').submit(function(e) {
    e.preventDefault();
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  $('#input').keydown(function(e) {
    e.preventDefault();
    socket.volatile.emit('input', {type: 'keydown', code: e.code, name: e.key});
    return false;
  });
  $('#input').keyup(function(e) {
    e.preventDefault();
    socket.volatile.emit('input', {type: 'keyup', code: e.code, name: e.key});
    return false;
  });
  
  function pushMessage(message, css) {
    if (!css) css = {};
    $('#messages')
      .append($('<li>').text(message).css(css))
      .scrollTop(function() { return this.scrollHeight; });
  }
  socket.on('connect', function() {
    pushMessage("you've connected.", {color: 'green'});
  });
  socket.on('disconnect', function(reason) {
    pushMessage("📵 you've been disconnected: " + reason + ".", {color: 'red'});
  });
  socket.on('user connected', function(username) {
    pushMessage(username + ' connected.');
  });
  socket.on('user disconnected', function(username) {
    pushMessage(username + ' disconnected.');
  });
  socket.on('chat message', function(chatMessage) {
    pushMessage(chatMessage.username + ': ' + chatMessage.content);
  });
  socket.on('nickname change', function(nicknameChange) {
    pushMessage("user '" + nicknameChange.oldName + "' changed nickname to '" + nicknameChange.newName + "'.");
  });
});
