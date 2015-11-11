
goog.provide('App');

App.receivedData = [];

goog.addDependency('lib/jquery.min.js', ['jQuery'], []);
goog.addDependency('lib/jquery.timeago.js', ['jQuery.Timeago'], []);
goog.addDependency('utils/Utils.js', ['Utils'], []);

goog.addDependency('core/Ticket.js', ['App.Ticket'], []);
goog.addDependency('core/Menu.js', ['App.Menu'], []);
goog.addDependency('core/Toast.js', ['App.Toast'], []);

goog.addDependency('core/SocketListeners.js', ['SocketListeners'], ['App.Menu', 'App.Ticket', 'App.Toast']);

goog.require('jQuery');
goog.require('jQuery.Timeago');
goog.require('Utils');

goog.require('SocketListeners');