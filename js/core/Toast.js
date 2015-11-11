(function (goog, App) {

	goog.provide('App.Toast');

	App.Toast = {
		_dom: null,

		visible: false,

		hide: function () {
			if(!this.visible) return;

			// Toast doesn't have hide method
			this._dom.dismiss();
			this.visible = false;
		},

		setText: function ( text ) {
			this._dom.text = text;
		},

		show: function () {
			if(this.visible) {
				this.hide();
			}

			this._dom.show();
			this.visible = true;
		}
	}

	document.addEventListener('polymer-ready', function (){		
		App.Toast._dom = document.querySelector('paper-toast');
	});

})(goog, App);
