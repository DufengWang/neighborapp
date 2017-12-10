$(document).ready(function () {

  window.socket = io("/".socketURL);

  window.socket.on('connect', function () {
    console.log('messages page reached');

    var currentUser = $('.container').data('username');
    var data = {socketID: socket.id, currentUser: currentUser};
    window.socket.emit('socketID', data);
  });

  window.socket.on('userSOS', function (username) {
    alert(username + ' needs help!!!');
  })

	$.ajax({
			type: 'POST',
			url: '/protected/messages',
			success: function(data) {
				var contactList = data.contactList;
				var texts = data.texts;
				var unread = data.unread

				console.log('data received');
				console.log(contactList);
				console.log(texts);

				for(var i in data.contactList) {

					var html = '';
					var html1 = '';
					var user = contactList[i];
					var currentUser = $('.container').data('username');
					var unreadAmount = 0;

					if (unread) {
						if (unread[user]) {
							unreadAmount = unread[user];
						}
					}

					// var text = "<div class='card' style='width: 20rem;'><div class='card-body'><h4 class='card-title'>" + user + "</h4><p class='ard-text'>Some quick example text to build on the card title and make up the bulk of the card's content.</p></div></div>"

					if ( Number(i) === 0 ) {

						var cardHtml = '';

						if ( texts ) {
							for (var i = 0; i < texts.length; i++) {
					  			if (texts[i][1] === 'incoming') {
					  				var text = texts[i][0];
					  				cardHtml = cardHtml + "<div class='card' style='width: 20rem;'><div class='card-body'><h4 class='card-title'>" + user + "</h4><p class='ard-text'>" + text + "</p></div></div>"
					  			} else if (texts[i][1] === 'outgoing') {
					  				var text = texts[i][0];
					  				cardHtml = cardHtml + "<div class='card' style='width: 20rem;'><div class='card-body'><h4 class='card-title'>" + "Me" + "</h4><p class='ard-text'>" + text + "</p></div></div>"
					  			}
				  			}
						}

						html = "<a class='list-group-item list-group-item-action active d-flex justify-content-between align-items-center' id='list-" + user + "-list' data-toggle='list' href='#list-" + user + "' role='tab' aria-controls='" + user + "'>" + user + "</a>"
						html1 = "<div class='tab-pane fade show active' id='list-" + user + "' role='tabpanel' aria-labelledby='list-" + user + "-list'>" + cardHtml + "</div>"
						$('.list-group').append(html);
						$('.tab-content').append(html1);
					} else {
						html = "<a class='list-group-item list-group-item-action d-flex justify-content-between align-items-center' id='list-" + user + "-list' data-toggle='list' href='#list-" + user + "' role='tab' aria-controls='" + user + "'>" + user + "</a>"
						html1 = "<div class='tab-pane fade' id='list-" + user + "' role='tabpanel' aria-labelledby='list-" + user + "-list'></div>"


						$('.list-group').append(html);
						$('.tab-content').append(html1);

						if (unreadAmount > 0) {
							var spanHtml = "<span class='badge badge-primary badge-pill'>" + unreadAmount + "</span>"
		    				$('.list-group-item#list-' + user + '-list').children($('.badge')).remove();
		    				$('.list-group-item#list-' + user + '-list').append(spanHtml);
						}
						
					}
				}
			}
		})

	$('#send').on('click', function() {
	    var text = $('#text-area').val();
	    var targetUser = $('.list-group-item.active').clone().children().remove().end().text();
	    var currentUser = $('.container').data('username');


	    var html = "<div class='card' style='width: 20rem;'><div class='card-body'><h4 class='card-title'>" + "Me" + "</h4><p class='ard-text'>" + text + "</p></div></div>"
	    $('.tab-pane.active').append(html);

	    var data = {text: text, targetUser: targetUser, currentUser: currentUser};
	    window.socket.emit('addText', data);
  	})

  	$('.list-group').on('click', '.list-group-item', function() {

  		//get the text without child nodes
  		var targetUser = $(this).clone().children().remove().end().text();
  		var currentUser = $('.container').data('username');
  		var data = {targetUser: targetUser, currentUser: currentUser};
  		var textAmount = Number($('.list-group-item#list-' + targetUser + '-list').children($('.badge')).text());

  		if ( textAmount !== 0 ) {
  			console.log('should remove badge');
  			$('.list-group-item#list-' + targetUser + '-list').children($('.badge')).remove();
  			console.log('badge removed successfully');
  		}

  		window.socket.emit('retrieveText', data);
  	});

  	window.socket.on('textList', function(texts) {
  		var texts = texts;

  		//get the text without child nodes
  		var targetUser = $('.list-group-item.active').clone().children().remove().end().text();
  		var currentUser = $('.container').data('username');
  		var html = ''

  		if (texts) {
	  		for (var i = 0; i < texts.length; i++) {
	  			if (texts[i][1] === 'incoming') {
	  				var text = texts[i][0];
	  				html = html + "<div class='card' style='width: 20rem;'><div class='card-body'><h4 class='card-title'>" + targetUser + "</h4><p class='ard-text'>" + text + "</p></div></div>"
	  			} else if (texts[i][1] === 'outgoing') {
	  				var text = texts[i][0];
	  				html = html + "<div class='card' style='width: 20rem;'><div class='card-body'><h4 class='card-title'>" + "Me" + "</h4><p class='ard-text'>" + text + "</p></div></div>"
	  			}
	  		}
  		}

  		$('.tab-pane#list-' + targetUser).html(html);
  	})

  	window.socket.on('textAdded', function(data) {

	    var user = data.targetUser;
	    var text = data.text;
	    var unread = data.unread;
	    var currentUser = $('.container').data('username');
	    var currentTabUser = $('.list-group-item.active').clone().children().remove().end().text();

	    if ( user === currentTabUser ) {
			var html = "<div class='card' style='width: 20rem;'><div class='card-body'><h4 class='card-title'>" + user + "</h4><p class='ard-text'>" + text + "</p></div></div>"
		    $('.tab-pane.active').append(html);

		    //remove unread amount
		    var response = {currentUser: currentUser, targetUser: currentTabUser};
		    window.socket.emit('removeUnread', response);
	    } else {
	    	console.log('unread amount');
	    	console.log(unread);

	    	var spanHtml = "<span class='badge badge-primary badge-pill'>" + unread + "</span>"
	    	$('.list-group-item#list-' + user + '-list').children($('.badge')).remove();
	    	$('.list-group-item#list-' + user + '-list').append(spanHtml);
	    }

  	})

});