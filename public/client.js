$(document).ready(function () {

  $('[data-toggle="popover"]').popover();

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