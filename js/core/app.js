document.addEventListener('polymer-ready', function () {

	var socket = io("http://localhost:8081");

	// Add a connect listener
	socket.on('connect',function() {
		console.log('Client has connected to the server!');
		socket.emit('dataset');
		socket.emit('notifications');
		socket.emit('comments');
	});

	socket.on('dataset', function ( response ) {

		if(!response) return console.error('No data to parse JSON - data');
		App.receivedData = JSON.parse(response);

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
			$('.load-overlay').fadeOut('slow');
		});
	});

	socket.on('notifications', function (data){
		if(!data) return console.error('no data to parse JSON - notifications');

		var notifications = JSON.parse(data);
	});

	socket.on('new_notification', function (response){
		var date = new Date(response.time);

		var day = date.getDate(),
	    	month = date.getMonth() + 1,
	    	year = date.getFullYear(),
			fullDate =  day + "/" + month + "/" + year;

		App.Toast.show(response.note + ' por ' + response.owner + ' - ' + date.getHours() + ':' + date.getMinutes() + ' em ' + fullDate);
	});

	socket.on('new_comment', function (response) {
		console.log(response);
		App.Toast.show(response.owner + ' comentou o ticket N° ' + response.ticketReference);

		App.receivedData.filter(function (ticket) {
			if(ticket.id == response.ticketReference) {
				//ticket.addComment(response)

				/*if(Menu.activePage.id != (1 && 6) ) {
					Menu.changePage(null, Menu.activePage.id ,true);
				}*/
			}
		})
	});

	// Add a disconnect listener
	socket.on('disconnect',function() {
		console.log('The client has disconnected!');
	});
}());