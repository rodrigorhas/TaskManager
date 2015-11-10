var data = [];

document.addEventListener('polymer-ready', function (){

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

	window.Toast = new Toast();

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

		if(isset(render) && render) {

			if(targetPage == 1){
				List(data);
				return;
			} else if(targetPage == 6){
				return;
			}

			var r = [];

			data.filter(function (obj) {

				for (var filter in page.test) {
					if(obj[filter] == page.test[filter]) {
						r.push(obj);
					}
				}

				return r;
			});

			List(r);
		}
	}

	function List (array) {
		$('section#page' + (window.Menu.activePage.id +1 )).find('.container').html('');

		for (var i = 0; i < array.length; i++) {
			var row = array[i];
			new Ticket({
				id: row.id,
				group: row.group,
				owner: row.name,
				content: row.note,
				timestamp: parseInt(row.date, 10),
				comments: (row.comments) ? row.comments : [],
				done: row.done,
				socket: socket
			});
		};
	}

	window.Menu = new Menu();
	
	socket = io("http://localhost:8081");

	// Add a connect listener
	socket.on('connect',function() {
		console.log('Client has connected to the server!');
		socket.emit('dataset');
		socket.emit('notifications');
		socket.emit('comments');
	});

	socket.on('dataset', function (response){
		if(!response) return console.error('no data to parse JSON - data');
		data = JSON.parse(response);

		window.Menu.changePage(null, 0, true);

		setTimeout(function () {$('.load-overlay').fadeOut('slow');}, 1);
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

		window.Toast.show(response.note + ' por ' + response.owner + ' - ' + date.getHours() + ':' + date.getMinutes() + ' em ' + fullDate);

	});

	socket.on('new_comment', function (response){
		window.Toast.show(response.owner + ' comentou o ticket N° ' + response.ticketReference);

		data.filter(function (obj) {
			if(obj.id == response.ticketReference) {
				obj.comments.unshift(response);
				obj.collapse = true;
				if(window.Menu.activePage.id != (1 && 6) ) {
					window.Menu.changePage(null, window.Menu.activePage.id ,true);
				}
			}
		})
	});

	// Add a disconnect listener
	socket.on('disconnect',function() {
		console.log('The client has disconnected!');
	});
}());