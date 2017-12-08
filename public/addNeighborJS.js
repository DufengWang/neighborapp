// This file contains client (aka browser) side code. Please don't modify the below line;
// it is a flag for our linter.
/* global $, io */

$(document).ready(function () {
  // This code connects to your server via websocket;
  // please don't modify it.
  window.socketURL = 'http://localhost:8080';

  window.socket = io(window.socketURL);

  window.socket.on('connect', function () {
  	var currentUsername = $('#requests').data('username');
    window.socket.emit('clientConnected', currentUsername);
  });

  $('#button').on('click', function() {
    var targetUsername = $('#input').val();
    var currentUsername = $('#requests').data('username');
    var data = [targetUsername, currentUsername];
    window.socket.emit('addUser', data);
  })

  window.socket.on('addUserRequest', function (response) {
    // $('#wrapper').html("<p>" + response + "</p>");
    $('#wrapper').html("<div class='alert alert-secondary' role='alert'>" + response + "</div>")
  })

  window.socket.on('requestHandled', function (targetUser) {
  	console.log('current user should remove ' + targetUser);
  	$('#' + targetUser).remove();
  })

  window.socket.on('requestList', function (requestList) {
  	var html = '';

  	console.log('got request list');
  	console.log(requestList);

  	for (var i=0; i < requestList.length; i++) {
  		html = html + "<div id=" + requestList[i] + "><h2>" + requestList[i] + "</h2><input data-username=" + requestList[i] + " id='accept' class='btn btn-dark btn-sm' value='ACCEPT' type='submit'>" + "</h2><input data-username=" + requestList[i] + " id='decline' class='btn btn-light btn-sm' value='DECLINE' type='submit'></div>";
  	}

  	$('#requests').html(html);
  })

  $('#requests').on('click', '#accept', function() {
  	var targetUsername = $(this).data('username');
  	var currentUsername = $('#requests').data('username');
  	var data = [targetUsername, currentUsername];

  	console.log(data);
  	window.socket.emit('acceptRequest', data);
  });

  $('#requests').on('click', '#decline', function() {
  	var targetUsername = $(this).data('username');
  	var currentUsername = $('#requests').data('username');
  	var data = [targetUsername, currentUsername];
  	window.socket.emit('declineRequest', data);
  });



});