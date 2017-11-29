// This file contains client (aka browser) side code. Please don't modify the below line;
// it is a flag for our linter.
/* global $, io */

$(document).ready(function () {
  // This code connects to your server via websocket;
  // please don't modify it.
  window.socketURL = 'http://localhost:8080';

  window.socket = io(window.socketURL);

  window.socket.on('connect', function () {
    console.log('contacts page reached');

    var currentUser = $('#container').data('username');
    window.socket.emit('getContacts', currentUser);
  });

  window.socket.on('contactList', function(data) {
    var html = '';

    for (var i = 0; i < data.length; i++) {
      // html = html + '<p>' + data[i] + '</p>';
      html = html + "<p><a href='/protected/contacts/" + data[i] + "'>" + data[i] + "</a></p>";
      $('#container').html(html);
    }
  })
});