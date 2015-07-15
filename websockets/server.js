var util = require("util"), http = require('http'),  io = require("socket.io"), XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest , najax = require('najax');;

var GLOBAL_USERS = [];
var	dataset;

function init(){

	var server = http.createServer(function(req, res){
		res.writeHead(200, {'content-type': 'text/html'});
		res.end("<h1>Hello Websockets</h1>");
	});

	server.listen(8081);

	var socket = io.listen(server);
	console.log('Waiting for connections...');

	var requestUrl = 'http://192.168.0.56/TaskManager/websockets/request.php';

	function refreshDataset () {
		najax(requestUrl + "?action=get_tickets", function(data){
			dataset = data;
			socket.emit('dataset', data);
		});
	}

	function refreshNotification () {
		najax(requestUrl + "?action=get_notifications", function(data){
			socket.emit('notifications', data);
		});
	}

	function sendNotification (note, time, owner) {
		socket.emit('new_notification', {note: note, time: time, owner: owner});
	}

	function refreshComments () {
		najax(requestUrl + "?action=get_comments", function(data){
			socket.emit('comments', data);
		});
	}

	function sendComment (comment, owner, time, id) {
		socket.emit('new_comment', {comment: comment, owner: owner, time: time, ticketReference: id});
	}

	function update_ticket (id, set, callback) {
		najax(requestUrl + "?action=update_ticket&id=" + id + "&set=" + set, function (){
			console.log(id,set)
			if(typeof callback == 'function'){
				callback();
			}
		});
	}

	function new_notification (note, time, owner, callback) {
		najax(requestUrl + "?action=new_notification&note=" + note + "&time=" + time + "&owner=" + owner, function (){
			if(typeof callback == 'function'){
				callback();
			}
		});
	}

	function new_comment (comment, owner, time, id, callback) {
		najax(requestUrl + "?action=new_comment&comment=" + comment + "&owner=" + owner + "&time=" + time + "&ticketReference=" + id, function (){
			if(typeof callback == 'function'){
				callback();
			}
		});
	}

	socket.on('connection', function(client){
		console.log('new client connected');

		client.on('dataset', function (client){
			console.log('sending data');
			refreshDataset();
		});

		client.on('notifications', function (client){
			console.log('sending notifications');
			refreshNotification();
		});

		/*client.on('comments', function (ticket){
			console.log('sending comments');
			refreshComments();
		});*/

		client.on('update_ticket', function (ticket){
			update_ticket(ticket.id, ticket.set, function (){
				//refreshDataset();
			});
		});

		client.on('new_notification', function (notify){
			new_notification(notify.note, notify.time , notify.owner, function (){
				sendNotification(notify.note, notify.time , notify.owner);
			});
		});

		client.on('new_comment', function (comment){
			new_comment(comment.comment, comment.owner, comment.time, comment.ticketReference, function (){
				sendComment(comment.comment, comment.owner, comment.time, comment.ticketReference);
			});
		});


		client.on('disconnect', function(event){
			GLOBAL_USERS.splice(playerById(event.id),1);
			console.log(GLOBAL_USERS);
		});

	});

} 

function playerById(id){
	for(var i=0; i<GLOBAL_USERS.length; i++){
		if(GLOBAL_USERS[i].id == id){
			return  GLOBAL_USERS[i];
		}
	};
	return false;
}

init();