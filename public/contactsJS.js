$(document).ready(function () {

  window.socket = io("/");

  window.socket.on('connect', function () {
    console.log('contacts page reached');

    var currentUser = $('#container').data('username');
    window.socket.emit('getContacts', currentUser);
  });

  window.socket.on('userSOS', function (username) {
    alert(username + ' needs help!!!');
  })

  window.socket.on('contactList', function(data) {
    var html = '';

    for (var i = 0; i < data.length; i++) {
      html = html + "<p><a href='/protected/contacts/" + data[i] + "'>" + data[i] + "</a></p>";
      $('#container').html(html);
    }
  })
});