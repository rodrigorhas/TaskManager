(function (goog, App) {

	goog.provide('App.Menu');

	function clearCurrentPage () {
		return new Promise(function (resolve, reject) {
			$('section#page' + (App.Menu.activePage.id++)).find('.container').html('');
			resolve();
		})
	}

	function RenderTickets (array) {
		clearCurrentPage().then(function () {
			for (var i = 0; i < array.length; i++) {
				var row = array[i];

				var pages = App.Menu._Page;
				row.prependTo('section#page' + (parseInt(pages.selected, 10) + 1) + ' .container');
			};
		});
	}

	function Menu () {
		this.pages = [
			{id: 0, title: "Caixa de entrada", icon: "markunread-mailbox", test: {_unread: 1}},
			{id: 1, title: "Todos os Tickets", icon: "assignment"},
			{id: 2, title: "Tickets concluidos", icon: "assignment-turned-in", test: {_done: 1}},
			{id: 3, title: "Tickets em aberto", icon: "assignment-late", test: {_done: 0}},
			{id: 4, title: "Tickets lidos", icon: "drafts", test: {_unread: 0}},
			{id: 5, title: "Lixeira", icon: "delete", test: {deleted: 1}},
			{id: 6, title: "Notificações", icon: "social:notifications"}
		];

		this.render();
	}

	Menu.prototype.render = function () {
		
		var self = this;

		document.addEventListener('polymer-ready', function (){
			var items = [],
				menu = $('core-menu');

			self.pages.forEach(function (page) {
				items.push('<core-item page="' + page.id + '" icon="'+ page.icon +'" label="' + page.title + '"></core-item>');
			});

			menu.append(items.join(''));
			
			menu.children('core-item').on('click', function (e) {
				self.changePage(null, $(this).attr('page'), true);
			});
		});
	}

	Menu.prototype.changePage = function (e, index, render) {

		return new Promise(function (resolve, reject) {

			var targetPage = (goog.isDefAndNotNull(index)) ? index : $(e.target).attr('page'),
			page = this.pages[targetPage];

			this._Drawer = document.querySelector('core-scaffold');
			this._Page = document.querySelector('core-animated-pages');
			this._Menu = document.querySelector('core-menu');
			
			this.activePage = page;

			this._Page.selected = targetPage;
			this._Menu.selected = targetPage;
			
			this._Drawer.closeDrawer();

			App.Toolbar.setTitle(page.title);

			resolve();

			this.filterTickets(targetPage)
				.then(function (tickets) {

					if( goog.isDefAndNotNull(render) && render ) {
						RenderTickets(tickets);
					}
				});

		}.bind(this));
	}

	Menu.prototype.filterTickets = function ( currentPage ) {
		var self = this;

		return new Promise(function (resolve) {
			var tickets = [];

			if( currentPage == 1 ) {

				resolve(App.receivedData);
			}

			else if( currentPage == 6 ) {
				return [];
			}

			tickets = App.receivedData.filter(function (ticket) {

				for (var filter in self.pages[currentPage].test) {
					if(ticket[filter] == self.pages[currentPage].test[filter]) {
						return ticket;
					}
				}
			});

			resolve(tickets);
		});
	}

	App.Menu = new Menu();

})(goog, App);