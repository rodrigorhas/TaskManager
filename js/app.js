var app = angular.module('myApp', ['ng-polymer-elements','ngMaterial']);

app.controller('mainController', function($scope, $filter){

	$scope.comments = [];
	$scope.notifications = [];
	$scope.data = [];

	document.addEventListener('polymer-ready', function (){

		socket = io("http://192.168.0.56:8081");

		// Add a connect listener
		socket.on('connect',function() {
			console.log('Client has connected to the server!');
			socket.emit('dataset');
			socket.emit('notifications');
			socket.emit('comments');
		});

		socket.on('dataset', function (data){
			if(!data) return console.error('no data to parse JSON - data');
			$scope.$apply(function (){
				if($scope.data !== JSON.parse(data)){
					$scope.data = JSON.parse(data);
				}
			});
			setTimeout(function () {$('.load-overlay').fadeOut('slow');}, 1000);
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
	
	/* fix ng-polymer-elements */

	function bootstrap() {
		angular.bootstrap(wrap(document), ['ng-polymer-elements-example']);
	}

	if(angular.isDefined(document.body.attributes['unresolved'])) {
		var readyListener = function() {
			bootstrap();
			window.removeEventListener('polymer-ready', readyListener);
		}
		window.addEventListener('polymer-ready', readyListener);
	} else {
		bootstrap();
	}

	/* /fix ng-polymer-elements */

	var pages = document.querySelector('core-animated-pages');
	var drawer = document.querySelector('core-scaffold');
	var menu = document.querySelector('core-menu');

	$scope.pages = [
		{id: 0, title: "Caixa de entrada", icon: "markunread-mailbox"},
		{id: 1, title: "Todos os Tickets", icon: "assignment"},
		{id: 2, title: "Tickets concluidos", icon: "assignment-turned-in"},
		{id: 3, title: "Tickets em aberto", icon: "assignment-late"},
		{id: 4, title: "Tickets lidos", icon: "drafts"},
		{id: 5, title: "Lixeira", icon: "delete"},
		{id: 6, title: "Notificações", icon: "social:notifications"}
	];

	$scope.activePage = $scope.pages[0];
	pages.selected = $scope.activePage.id;
	menu.selected = $scope.activePage.id;

	$scope.changePage = function (e) {
		var targetPage = $(e.target).attr('page');
		pages.selected = targetPage;
		$scope.activePage = $scope.pages[targetPage];
		drawer.closeDrawer();
	}

	$scope.deleteCard = function (id, index, e) {
		$(e.target).parents('card').slideUp('fast', function (){
			socket.emit('update_ticket', {id: id, set: 'deleted=1'});
			socket.emit('new_notification', {note: 'O ticket N° '+id+' foi deletado', time: new Date().getTime(), owner: "Alan"});
		});
	}

	$scope.createTicket = function () {
		$scope.data.push({id: $scope.data.length + 1, name: prompt('ticket name'), time: 'random', date: 'random', group: prompt('ticket group') , note: prompt('ticket description'), done: 0, unread: 1});
	}

	$scope.markAsRead = function (id, index) {
		if($scope.data[$scope.returnCard(id)].unread == 1){
			socket.emit('update_ticket', {id: id, set: 'unread=0'});
			socket.emit('new_notification', {note: 'O ticket N° '+id+' foi marcado como lido', time: new Date().getTime(), owner: "Alan"});
		}else{
			socket.emit('update_ticket', {id: id, set: 'unread=1'});
			socket.emit('new_notification', {note: 'O ticket N° '+id+' foi marcado como não lido', time: new Date().getTime(), owner: "Alan"});
		}
	}

	$scope.recoverCard = function (id){
		socket.emit('update_ticket', {id: id, set: 'deleted=0'});
		socket.emit('new_notification', {note: 'O ticket N° '+id+' foi restaurado', time: new Date().getTime(), owner: "Alan"});
	}

	$scope.status = function (id){
		for (var i = 0; i < $scope.data.length; i++) {
			if($scope.data[i].id == id){
			}
		};		
	}

	$scope.toggleDoneState = function (id){
		if($scope.data[$scope.returnCard(id)].done == 0){
			socket.emit('update_ticket', {id: id, set: 'done=1,unread=0'});
			socket.emit('new_notification', {note: 'O ticket N° '+id+' foi fechado.', time: new Date().getTime(), owner: "Alan"});
		}else{
			socket.emit('update_ticket', {id: id, set: 'done=0'});
			socket.emit('new_notification', {note: 'O ticket N° '+id+' foi reaberto', time: new Date().getTime(), owner: "Alan"});
		}	
	}

	$scope.transform = function (done){
		if(done == 1){
			return true;
		}else{
			return false;
		}
	}

	$scope.returnCard = function (id) {
		for (var i = 0; i < $scope.data.length; i++) {
			if($scope.data[i].id == id){
				return i;
			}
		}
	}

	$scope.discardDraft = function (event) {
		event.target.show();
	}

	$scope.showToast = function (text) {
		var toast = document.querySelector('paper-toast');
		toast.text = text;
		toast.show();
	}

	$scope.toggleCollapse = function (e, id) {

		$(e.target).parents('card').find('card-collapse').slideToggle(null, function (){
			if($(this).css('opacity') == 0){
				$(this).css({opacity: 1});
				$(this).animate({
				    scrollTop: 0
				}, 500)
			}else{
				$(this).css({opacity: 0});
			}
		});
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

	$scope.sendNewComment = function (c, owner, time, id, e) {
		if(time == 'timestamp'){ time = new Date().getTime(); };
		socket.emit('new_comment', {comment: c, owner: owner, time: time , ticketReference: id});
		$('[ng-model="commentInput"]').val('');

		if($(e.target).parents('card').find('card-collapse').css('opacity') == 0){
			$scope.toggleCollapse(e, id);
		}
	}

});