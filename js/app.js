var data = [];

document.addEventListener('polymer-ready', function () {

	function Toast () {
		var _this = this;
		document.addEventListener('polymer-ready', function (){		
			_this.dom = document.querySelector('paper-toast');
		});
	}

	Toast.prototype.show = function (text) {
		this.dom.text = text;
		this.dom.show();
	}

	function Menu () {
		this.pages = [
			{id: 0, title: "Caixa de entrada", icon: "markunread-mailbox", test: {unread: 1}},
			{id: 1, title: "Todos os Tickets", icon: "assignment"},
			{id: 2, title: "Tickets concluidos", icon: "assignment-turned-in", test: {done: 1}},
			{id: 3, title: "Tickets em aberto", icon: "assignment-late", test: {done: 0}},
			{id: 4, title: "Tickets lidos", icon: "drafts", test: {unread: 0}},
			{id: 5, title: "Lixeira", icon: "delete", test: {deleted: 1}},
			{id: 6, title: "Notificações", icon: "social:notifications"}
		];

		this.render();
	}

	Menu.prototype.render = function () {
		
		var _this = this;

		document.addEventListener('polymer-ready', function (){
			var a = [];

			for (var i = 0; i < _this.pages.length; i++) {
				var p = _this.pages[i];
				var tpl = '<core-item page="' + p.id + '" icon="'+ p.icon +'" label="' + p.title + '"></core-item>';
				a.push(tpl);
			};

			$('core-menu').append(a.join(''));
			
			$('core-menu > core-item').on('click', function (e) {
				_this.changePage(null, $(this).attr('page'), true);
			});
		});
	}

	Menu.prototype.changePage = function (e, index, render) {

		return new Promise(function (resolve, reject) {
			var targetPage = (isset(index)) ? index : $(e.target).attr('page'),
			page = this.pages[targetPage];

			this._Drawer = document.querySelector('core-scaffold');
			this._Page = document.querySelector('core-animated-pages');
			this._Menu = document.querySelector('core-menu');
			
			this.activePage = page;

			this._Page.selected = targetPage;
			this._Menu.selected = targetPage;
			
			this._Drawer.closeDrawer();

			$('#activePageTitle').html(page.title);

			resolve();

			if(isset(render) && render) {

				if(targetPage == 1){
					RenderTickets(data);
					return;
				} else if(targetPage == 6){
					return;
				}

				var tickets = [];

				data.filter(function (obj) {

					for (var filter in page.test) {
						if(obj[filter] == page.test[filter]) {
							tickets.push(obj);
						}
					}

					return tickets;
				});

				RenderTickets(tickets);
			}
		}.bind(this));
	}

	var Menu = new Menu();
	var Toast = new Toast();
	var socket = io("http://localhost:8081");

	function clearCurrentPage () {
		return new Promise(function (resolve, reject) {
			$('section#page' + (Menu.activePage.id +1 )).find('.container').html('');
			resolve();
		})
	}

	function RenderTickets (array) {
		clearCurrentPage().then(function () {
			for (var i = 0; i < array.length; i++) {
				var row = array[i];

				var pages = Menu._Page;
				row.prependTo('section#page' + (parseInt(pages.selected, 10) + 1) + ' .container');
			};
		});
	}

	// Add a connect listener
	socket.on('connect',function() {
		console.log('Client has connected to the server!');
		socket.emit('dataset');
		socket.emit('notifications');
		socket.emit('comments');
	});

	socket.on('dataset', function ( response ) {
		if(!response) return console.error('No data to parse JSON - data');
		data = JSON.parse(response);

		data = data.map(function ( item, index ) {
			return new Ticket({
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

		Menu.changePage(null, 0, true).then(function () {
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

		Toast.show(response.note + ' por ' + response.owner + ' - ' + date.getHours() + ':' + date.getMinutes() + ' em ' + fullDate);
	});

	socket.on('new_comment', function (response) {
		console.log(response);
		Toast.show(response.owner + ' comentou o ticket N° ' + response.ticketReference);

		data.filter(function (ticket) {
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