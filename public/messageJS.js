// This file contains client (aka browser) side code. Please don't modify the below line;
// it is a flag for our linter.
/* global $, io */

$(document).ready(function () {
  // This code connects to your server via websocket;
  // please don't modify it.
$('.info-btn').on('click', function () {
    $("#Messages").toggleClass('col-sm-12 col-sm-9');
});

});