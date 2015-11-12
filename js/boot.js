
goog.provide('App');

App.receivedData = [];

goog.addDependency('lib/socket.io.min.js', ['Socket.io'], []);
goog.addDependency('lib/jquery.min.js', ['jQuery'], []);
goog.addDependency('lib/jquery.timeago.js', ['jQuery.Timeago'], ['jQuery']);

goog.addDependency('core/Utils.js', ['App.Utils'], []);
goog.addDependency('core/Ticket.js', ['App.Ticket'], []);
goog.addDependency('core/Menu.js', ['App.Menu'], []);
goog.addDependency('core/Toast.js', ['App.Toast'], []);
goog.addDependency('core/Debug.js', ['App.Debug'], []);
goog.addDependency('core/App.js', ['Application'], []);
goog.addDependency('config.js', ['App.Config'], ['App.Debug']);

goog.addDependency('core/SocketListeners.js', ['SocketListeners'], ['App.Menu', 'App.Ticket', 'App.Toast', 'App.Utils', 'App.Debug']);

goog.require('jQuery');
goog.require('jQuery.Timeago');
goog.require('Socket.io');

goog.require('App.Config');

goog.require('Application');
goog.require('SocketListeners');