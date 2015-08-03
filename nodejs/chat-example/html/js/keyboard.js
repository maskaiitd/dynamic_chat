
state = new Kiwi.State('Play');

state.preload = function () {
	
	this.addSpriteSheet('player', './assets/img/anime/princess.png', 150, 117);
};

	state.create = function () {
	this.play_group = new Kiwi.Group( this );
	this.addChild( this.play_group );
	this.player = new Kiwi.GameObjects.Sprite(this, this.textures.player, 275, 150);
	this.player.animation.add( 'walk', [ 1, 2, 3, 4, 5, 6 ], 0.15, true, true );
	this.player.animation.add( 'stop', [ 0 ], 1, true, true );
	
	this.addChild(this.player);
	this.play_group.addChild(this.player);
	//this.player.animation.play( 'walk' );
	this.player.id = Math.random()+"";
	console.dir( this.player );

	this.keyboard = this.game.input.keyboard;
	this.speed = 3;


	this.game.input.keyboard.onKeyDownOnce.add( this.keyDownOnce, this );
	this.game.input.keyboard.onKeyUp.add( this.keyUp, this );
/*
	this.message = new Kiwi.GameObjects.Textfield ( this, "Use 'wasd' or the arrow keys to move the character.", 15, 15, "#000", 16 );
	this.addChild( this.message );

	this.textDown = new Kiwi.GameObjects.Textfield ( this, "Key has not been pressed", 15, 50, "#000", 16 );
	this.addChild( this.textDown );

	this.textUp = new Kiwi.GameObjects.Textfield ( this, "Key has not been released", 15, 85, "#000", 16 );
	this.addChild( this.textUp );

*/
	// Creating Keys
	this.rightKey = this.keyboard.addKey(Kiwi.Input.Keycodes.D);
	this.rightArrowKey = this.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT, true);

	this.leftKey = this.keyboard.addKey(Kiwi.Input.Keycodes.A);
	this.leftArrowKey = this.keyboard.addKey(Kiwi.Input.Keycodes.LEFT, true);

	this.upKey = this.keyboard.addKey(Kiwi.Input.Keycodes.W);
	this.upArrowKey = this.keyboard.addKey(Kiwi.Input.Keycodes.UP, true);

	this.downKey = this.keyboard.addKey(Kiwi.Input.Keycodes.S);
	this.downArrowKey = this.keyboard.addKey(Kiwi.Input.Keycodes.DOWN, true);





};


state.newchild = function(p_id) {
	s = new Kiwi.GameObjects.Sprite(this, this.textures.player, 275, 150);
	s.animation.add( 'walk', [ 1, 2, 3, 4, 5, 6 ], 0.15, true, true );
	s.animation.add( 'stop', [ 0 ], 1, true, true );
	this.addChild(s);
	s.id= p_id;
	this.play_group.addChild(s);
	console.log(p_id);

};
state.keyDownOnce = function(keyCode, key) {
	//console.log(socket);
		this.player.animation.play( 'walk' );
		
	//this.textDown.text = "Keycode : " + keyCode + " has been pressed.";
};

state.keyUp = function(keyCode, key) {
	this.player.animation.play( 'stop' );
	//this.textUp.text = "Keycode : " + keyCode + " has been released. Held for: " + (key.timeUp - key.timeDown) + " milliseconds.";
};

state.update = function () {
	Kiwi.State.prototype.update.call( this );

	// Checks every frame what key is down and moves player in the correct direction.
	if( this.rightKey.isDown || this.rightArrowKey.isDown ){
		this.player.x += this.speed;
		//console.log(socket+" "+io);
		socket.emit('moving',{id:this.player.id,x: this.player.x, y : this.player.y});
		//socket.broadcast.emit('moving', 'move dude move');
	//	this.player.animation.play( 'walk' );
	} 

	if( this.leftKey.isDown || this.leftArrowKey.isDown ){
		this.player.x -= this.speed;
		socket.emit('moving',{id:this.player.id,x: this.player.x, y : this.player.y});
		
	//	this.player.animation.play( 'walk' );
	} 

	if( this.upKey.isDown || this.upArrowKey.isDown ){
		this.player.y -= this.speed;
		socket.emit('moving',{id:this.player.id,x: this.player.x, y : this.player.y});
		
	//	this.player.animation.play( 'walk' );
	}
	if( this.downKey.isDown || this.downArrowKey.isDown ){
		this.player.y += this.speed;
		socket.emit('moving',{id:this.player.id,x: this.player.x, y : this.player.y});
		
	}  
};

var gameOptions = {
	width: 768,
	height: 512
};

var game = new Kiwi.Game('game-container', 'keyboard', state, gameOptions);


