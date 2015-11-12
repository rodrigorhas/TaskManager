document.addEventListener('polymer-ready', function () {
	App.LoadOverlay = {
		_dom: $('.load-overlay'),

		show: function () {

			this._dom.fadeIn('slow');
		},

		hide: function () {

			this._dom.fadeOut('slow');
		}
	}

	App.Toolbar = {
		_dom: $('#activePageTitle'),

		setTitle: function ( title ) {

			this._dom.html(title);
		}
	}
});