var app = angular.module('myApp', ['ng-polymer-elements','ngMaterial']), _scope;

app.controller('mainController', function($scope, $timeout, $filter){

	_scope = $scope;

	function safeApply(scope, fn) {
	    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
	}

	$scope.comments = [];
	$scope.notifications = [];
	$scope.data = [];
	var data = [];

	document.addEventListener('polymer-ready', function (){

		socket = io("http://192.168.0.56:8081");

		// Add a connect listener
		socket.on('connect',function() {
			console.log('Client has connected to the server!');
			socket.emit('dataset');
			socket.emit('notifications');
			socket.emit('comments');
		});

		/*socket.on('dataset', function (data){
			if(!data) return console.error('no data to parse JSON - data');
			$scope.$apply(function (){
				if($scope.data !== JSON.parse(data)){
					$scope.data = JSON.parse(data);
				}
			});
			setTimeout(function () {$('.load-overlay').fadeOut('slow');}, 1000);
		});*/

		socket.on('dataset', function (response){
			if(!response) return console.error('no data to parse JSON - data');
			data = JSON.parse(response);
			_scope.data = data

			$scope.changePage(null, 0, true);

			setTimeout(function () {$('.load-overlay').fadeOut('slow');}, 1);
		});

		socket.on('notifications', function (data){
			if(!data) return console.error('no data to parse JSON - notifications');
			$scope.$apply(function (){
				$scope.notifications = JSON.parse(data);
			});
		});

		socket.on('new_notification', function (data){
			$scope.$apply(function () {
				$scope.notifications.unshift(data);
				$scope.showToast(data.note + ' por ' + data.owner + ' - ' + $filter('date')(data.time, 'HH:mm') + ' em ' + $filter('date')(data.time, 'dd/MM/yyyy'));
			});
		});

		socket.on('comments', function (data){
			if(!data) return console.error('no data to parse JSON - comments');
			$scope.$apply(function () {
				$scope.comments = JSON.parse(data);
			});
		});

		socket.on('new_comment', function (data){
			$scope.$apply(function () {
				$scope.comments.unshift(data);
				$scope.showToast(data.owner + ' comentou o ticket N° ' + data.ticketReference);
			});
		});

		// Add a disconnect listener
		socket.on('disconnect',function() {
			console.log('The client has disconnected!');
		});
	});
	
	var pages = document.querySelector('core-animated-pages');
	var drawer = document.querySelector('core-scaffold');
	var menu = document.querySelector('core-menu');

	$scope.pages = [
		{id: 0, title: "Caixa de entrada", icon: "markunread-mailbox", test: {unread: 1}},
		{id: 1, title: "Todos os Tickets", icon: "assignment"},
		{id: 2, title: "Tickets concluidos", icon: "assignment-turned-in", test: {done: 1}},
		{id: 3, title: "Tickets em aberto", icon: "assignment-late", test: {done: 0}},
		{id: 4, title: "Tickets lidos", icon: "drafts", test: {unread: 0}},
		{id: 5, title: "Lixeira", icon: "delete", test: {deleted: 1}},
		{id: 6, title: "Notificações", icon: "social:notifications"}
	];

	$scope.changePage = function (e, index, render) {
		var targetPage = (isset(index)) ? index : $(e.target).attr('page');

		pages.selected = targetPage;
		menu.selected = targetPage;
		var page = $scope.pages[targetPage];
		$scope.activePage = page;
		drawer.closeDrawer();

		if(isset(render) && render) {

			if(targetPage == 1){
				List(data);
				return;
			} else if(targetPage == 6){
				return;
			}

			var r = [];

			data.filter(function (obj) {

				for (var filter in page.test) {
					if(parseInt(obj[filter], 10) === page.test[filter]) {
						r.push(obj);
					}
				}

				return r;
			});

			List(r);
		}
	}

	$scope.deleteCard = function (id, index, e) {
		$(e.target).parents('card').slideUp('fast', function (){
			socket.emit('update_ticket', {id: id, set: 'deleted=1'});
			socket.emit('new_notification', {note: 'O ticket N° '+id+' foi deletado', time: new Date().getTime(), owner: "Alan"});
		});
	}

	$scope.createTicket = function () {
		var name = prompt('ticket name');
		var group = prompt('ticket group');
		var note = prompt('ticket description');

		safeApply($scope, function () {
			$scope.data.unshift({id: $scope.data.length + 1, name: name, time: 'random', date: 'random', group: group , note: note, done: 0, unread: 1});
			console.log($scope.data);
		})
	}

	$scope.discardDraft = function (event) {
		event.target.show();
	}

	$scope.showToast = function (text) {
		var toast = document.querySelector('paper-toast');
		toast.text = text;
		toast.show();
	}

	$scope.checkKey = function (e, id) {
		if(e.keyCode == 13){
			$scope.sendNewComment($(e.target).val(), 'Alan', new Date().getTime(), id, e);

			$(e.target).val('');
			if($(e.target).parents('card').find('card-collapse').css('opacity') == 0){
				$scope.toggleCollapse(e, id);
			}
		}
	}

	function List (array) {
		$('section#page' + ($scope.activePage.id +1 )).find('.container').html('');

		for (var i = 0; i < array.length; i++) {
			var row = array[i];
			new Ticket({
				id: row.id,
				group: row.group,
				owner: row.name,
				content: row.note,
				timestamp: parseInt(row.date, 10),
				comments: (row.comments) ? row.comments : [],
				done: row.done,
				socket: socket
			});
		};
	}

});