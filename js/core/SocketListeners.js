document.addEventListener('polymer-ready', function () {

	var socket = io("http://localhost:8081");

	socket.on('connect',function() {

		App.Debug.info('Client has connected to the server!');

		socket.emit('dataset');
		socket.emit('notifications');
		socket.emit('comments');
	});

	socket.on('dataset', function ( response ) {

		if(!response) return App.Debug.Exception('No data received - Stoping application');

		var json = App.Utils.parseJson(response);

		if(!json) App.Debug.Exception('Invalid JSON - report this bug');

		App.receivedData = json;

		App.receivedData = App.receivedData.map(function ( item, index ) {
			return new App.Ticket({
				id: item.id,
				group: item.group,
				owner: item.name,
				content: item.note,
				timestamp: parseInt(item.date, 10),
				comments: item.comments,
				done: item.done,
				socket: socket
			});
		});

		App.Menu.changePage(null, 0, true).then(function () {
			App.LoadOverlay.hide();
		});
	});

	socket.on('notifications', function (data) {
		if(!data) return App.Debug.error('Something wrong with notifications');

		var notifications = JSON.parse(data);
	});

	socket.on('new_notification', function (response){
		var date = new Date(response.time);

		var day = date.getDate(),
	    	month = date.getMonth() + 1,
	    	year = date.getFullYear(),
			fullDate =  day + "/" + month + "/" + year;

		App.Toast
			.setText(
				response.note +
				' por ' +
				response.owner +
				' - ' +
				date.getHours() +
				':' +
				date.getMinutes() +
				' em ' +
				fullDate
			)
			.show();
	});

	socket.on('new_comment', function (response) {
		App.Toast
			.setText(
				response.owner +
				' comentou o ticket N° '
				+ response.ticketReference
			)
			.show();

		var ticket = App.Utils.findOne(response.ticketReference);

		if(ticket) ticket.addComment(response);
	});

	socket.on('disconnect',function() {

		App.Debug.warn('The client has disconnected!');
	});

}());