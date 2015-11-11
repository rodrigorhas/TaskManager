(function (goog, App) {

	goog.provide('App.Toast');

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

	App.Toast = new Toast();

})(goog, App);