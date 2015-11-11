(function (goog, App) {

	goog.provide('App.Menu');

	function clearCurrentPage () {
		return new Promise(function (resolve, reject) {
			$('section#page' + (App.Menu.activePage.id +1 )).find('.container').html('');
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
		
		var self = this;

		document.addEventListener('polymer-ready', function (){
			var a = [];

			for (var i = 0; i < self.pages.length; i++) {
				var p = self.pages[i];
				var tpl = '<core-item page="' + p.id + '" icon="'+ p.icon +'" label="' + p.title + '"></core-item>';
				a.push(tpl);
			};

			$('core-menu').append(a.join(''));
			
			$('core-menu > core-item').on('click', function (e) {
				self.changePage(null, $(this).attr('page'), true);
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
					RenderTickets(App.receivedData);
					return;
				} else if(targetPage == 6){
					return;
				}

				var tickets = [];

				App.receivedData.filter(function (obj) {

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

	App.Menu = new Menu();

})(goog, App);