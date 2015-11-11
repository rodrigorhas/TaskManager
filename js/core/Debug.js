(function (goog, App) {

	goog.provide('App.Debug');

	App.Debug = {
		enabled: true,

		error: function () {
			if(this.enabled)
				console.error.apply(console, arguments);
		},

		log: function () {
			if(this.enabled)
				console.log.apply(console, arguments);
		},

		warn: function () {
			if(this.enabled)
				console.warn.apply(console, arguments);
		},

		info: function () {
			if(this.enabled)
				console.info.apply(console, arguments);
		},

		debug: function () {
			if(this.enabled)
				console.debug.apply(console, arguments);
		},

		Exception: function ( exception ) {
			throw exception;
		}
	}

})(goog, App);