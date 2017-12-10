// This file contains client (aka browser) side code. Please don't modify the below line;
// it is a flag for our linter.
/* global $, io */

$(document).ready(function () {
  // This code connects to your server via websocket;
  // please don't modify it.

  $('[data-toggle="popover"]').popover();

  // window.socketURL = 'http://localhost:8080';

  window.socket = io('/');

  window.socket.on('connect', function () {
    console.log('Connected to server!');
  });

  $('#submission').on('click', function() {
    var username = $('#nav').data('username');
    window.socket.emit('SOS', username);
  })

  window.socket.on('userSOS', function (username) {
    alert(username + ' needs help!!!');
  })

  //SOS button pop over
  $('.example-popover').popover({
    container: 'body'
  })

});