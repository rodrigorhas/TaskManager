$.fn.disableSelection = function() {

    return this.attr('unselectable', 'on')
       .css({'-moz-user-select':'-moz-none',
             '-moz-user-select':'none',
             '-o-user-select':'none',
             '-khtml-user-select':'none',
             '-webkit-user-select':'none',
             '-ms-user-select':'none',
             'user-select':'none'})
       .bind('selectstart', false);
};

var options = {console: {warning: true, debug: true, erro: true}};

function trim (string) {
	if(!isset(string)) return "";
	return string.replace(/\r\n|\n|\r/g, '<br />');
}

function $debug (debug){
	if(options.console.debug == false) return;
	for (var i = 0; i < arguments.length; i++) {
		console.debug(arguments[i]);
	};
	return "-------------- DEBUG --------------";
}

function $warn (warn){
	if(options.console.warning == false) return;
	for (var i = 0; i < arguments.length; i++) {
		console.warn(arguments[i]);
	};
	return "-------------- WARNING --------------";
}

function $error (error){
	if(options.console.error == false) return;
	for (var i = 0; i < arguments.length; i++) {
		console.error(arguments[i]);
	};
	return "-------------- ERROR --------------";
}

function isset (test) {
	if( typeof test != 'undefined' && typeof test != 'null')
		return true
	else
		return false;
}

/*Object.prototype.renameKey = function (keyName, newName) {
		
	var prop = this[keyName];

	if(isset(prop)) {
		var oldKeyValue = prop;
		delete this[keyName];
		this[newName] = oldKeyValue;
	}
}*/

String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " anos";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " meses";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " dias";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " horas";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutos";
    }
    return Math.floor(seconds) + " segundos";
}