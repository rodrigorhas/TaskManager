(function (goog, App) {

	goog.provide('App.Ticket');

	function Ticket (config) {
		this.id = config.id;
		this.group = config.group;
		this.owner = config.owner;
		this.content = config.content;

		this.socket = config.socket;

		this._done = config.done;
		this._unread = config.unread || false;

		this.comments = config.comments || [];
		this.followers = [];

		this.creation_time = {
			date: (config.timestamp) ? new Date(config.timestamp) : new Date()
		}

		this.creation_time.timestamp = this.creation_time.date.getTime();
		this.creation_time.hour = this.creation_time.date.getHours();
		this.creation_time.minute = this.creation_time.date.getMinutes();
		this.creation_time.dateToString = this.creation_time.date.getMinutes();

		this.elapsed_time = 0;

		this.dom = $(
			'<card flex '+ ((this.boolGate(this._done)) ? 'class="done"' : '') +' >\
				<card-header>\
					<div class="title">'+ this.group +'</div>\
					<small>\
					<i class="text-muted">Created by ' + this.owner +', '+ $.timeago(this.creation_time.timestamp) +'</i>\
					</small>\
					<div class="button-group right">\
						<paper-icon-button icon="fullscreen" ng-click="fs = !fs"></paper-icon-button>\
						<paper-checkbox '+ ((this._done == 1) ? 'checked' : '') +'></paper-checkbox>\
						<paper-menu-button>\
						  <paper-icon-button icon="more-vert" noink></paper-icon-button>\
						  <paper-dropdown halign="right" class="dropdown">\
						    <core-menu class="menu">7\
						      <paper-item>Arquivar</paper-item>\
						      <paper-item ng-click="deleteCard(item.id, $index, $event)">Deletar</paper-item>\
						      <paper-item>Editar</paper-item>\
						      <!--<paper-item ng-click="markAsRead(item.id)" ng-if="item.unread == 1">Marcar como lido</paper-item>\
						      <paper-item ng-click="markAsRead(item.id)" ng-if="item.unread == 0">Marcar como não lido</paper-item>-->\
						    </core-menu>\
						  </paper-dropdown>\
						</paper-menu-button>\
					</div>\
				</card-header>\
				<card-body>\
					<p>Hi man.</p>\
					<p> '+ this.content +' </p>\
				</card-body>\
				<card-footer>\
					<div class="button-group left">\
						<core-icon-button icon="communication:comment" ng-click="toggleCollapse($event, item.id)"></core-icon-button>'+this.comments.length+'\
						<core-icon-button icon="star-outline"></core-icon-button>4\
					</div>\
				</card-footer>\
				<card-collapse>\
					<ul class="infinity-list">'+ this.genComments() +'</ul>\
				</card-collapse>\
				<div class="wrapper-comment-box">\
					<div class="comment-box">\
						<paper-input label="Escreva um comentário" id="commentInput"></paper-input>\
						<paper-icon-button icon="send" id="sendCommentButton"></paper-icon-button>\
					</div>\
				</div>\
			</card>');
		
		this.attachListeners();
	}

	Ticket.prototype.done = function () {

		this._done = true;
	}

	Ticket.prototype.undone = function () {

		this._done = false;
	}

	Ticket.prototype.read = function () {

		this._unread = false;
	}

	Ticket.prototype.unread = function () {

		this._unread = true;
	}

	Ticket.prototype.addComment = function ( comment ) {
		this.comments.unshift(comment);
		this.dom.find('.infinity-list').html(this.genComments());
	}

	Ticket.prototype.boolGate = function ( input ) {

		if(input == 1)
			return true;

		return false;
	}

	Ticket.prototype.attachListeners = function () {

		var self = this;
		var commentBox = this.dom.find('#commentInput');

		function sendComment () {
			self.socket.emit('new_comment', {comment: commentBox.val(), owner: prompt('qual o seu nome ?'), time: Date.now() , ticketReference: self.id});
			commentBox.val('');
		}

		this.dom.find('core-icon-button[icon="communication:comment"]').on('click', function () {
			if(self.comments.length > 0)
				self.toggleCardCollapse();
		});

		this.dom.find('#sendCommentButton').on('click', function () {

			sendComment();
		});

		this.dom.find('paper-checkbox').on('click', function () {

			var c = $(this);

			var isChecked = (c.attr('checked') != undefined) ? true : false;

			self._done = (!isChecked) ? 1 : 0;
			App.receivedData[self.id]._done = self._done;

			self.toggleDoneStrip();

			if( !isChecked ) {

				App.receivedData[self.id]._unread = 0;
				self.socket.emit('update_ticket', {id: self.id, set: 'done=1,unread=0'});
				self.socket.emit('new_notification', {note: 'O ticket N° '+ self.id +' foi fechado.', time: Date.now(), owner: 'Alan'});
			}

			else {

				self.socket.emit('update_ticket', {id: self.id, set: 'done=0'});
				self.socket.emit('new_notification', {note: 'O ticket N° '+ self.id +' foi reaberto', time: Date.now(), owner: 'Alan'});

			}

			App.Menu.changePage(null, App.Menu.activePage.id, true);
		});

		commentBox.on('keydown', function (e) {
			var key = e.keyCode || e.which;

			if(key == 13) {
				sendComment();
			}
		});
	}

	Ticket.prototype.toggleCardCollapse = function () {
		this.dom.find('card-collapse').slideToggle(null, function (){
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

	Ticket.prototype.genComments = function () {

		var all = [];

		for (var i = 0; i < this.comments.length; i++) {
			var item = this.comments[i];
			var template = 
			'<li class="list-item">\
				<div class="top">\
					<b>'+ item.owner +':</b> '+ item.comment +
				'</div>\
				<div class="bottom">' +
					$.timeago(parseInt(item.time, 10)) + '.' +
				'</div>\
			</li>';

			all.push(template);
		};

		return all.join('');
	}

	Ticket.prototype.toggleDoneStrip = function () {

		this.dom.toggleClass('done');
	}

	Ticket.prototype.prependTo = function ( element ) {

		this.dom.prependTo(element);
	}

	App.Ticket = Ticket;

})(goog, App);