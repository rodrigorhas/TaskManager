goog.provide('App.Utils');
goog.require('Application');

App.Utils = {
    findOne: function ( id ) {
        for (var i = 0; i < App.receivedData.length; i++) {
            if(App.receivedData[i].id === id) {
                return App.receivedData[i].id;

                console.log('write');
            }
        };
    },

    parseJson: function ( string ) {
    	var result;

    	try { result = JSON.parse(string); }
    	catch (e) { App.Debug.error(e); }
    	return result;
    }
}