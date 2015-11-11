(function (goog, App) {

    goog.provide('App.Utils');

    App.Utils.findOne = function ( id ) {
        for (var i = 0; i < App.receivedData.length; i++) {
            if(App.receivedData[i].id === id) {
                return App.receivedData[i].id;

                console.log('write');
            }
        };
    }

})(goog, App);