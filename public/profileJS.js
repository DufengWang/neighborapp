$(document).ready(function () {

  $("#editProfile").on('click', function(){
    console.log('button clicked');
    $.ajax({
      type: 'POST',
      url: '/protected/profile',
      success: function(data) {
        if(typeof data.redirect === 'string') {
          window.location = data.redirect
        }
      }
    })
  });

  window.socket.on('userSOS', function (username) {
    alert(username + ' needs help!!!');
  })

});