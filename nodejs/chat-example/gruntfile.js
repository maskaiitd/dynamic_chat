var io ;
clients ={};
snakes=[];
var w = 1050;
var h = 650;
var cw = 10;
food = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};
module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-connect-socket.io');

	grunt.loadTasks('./tasks');

	grunt.initConfig({

		examples: {

			all: {
				
				options: {
					base: 'examples',
					excludes: ['_site','plugins']
				},

				src: ['examples/**/*.js'],
				dest: 'examples/_site/examples.json'

			}

		},

		connect: {

				root: {
						options: {
								keepalive: true,
								hostname: '*',
								port: 3000,
								socketio:true,
								onCreateServer: function(root, connect, options) {
								io = require('socket.io').listen(root);
          						io.on('connection', function(socket) {
            // do something with socket
            				
            				// io.sockets.socket(socket.id).emit('before',snakes);
            				//require('./html/js/kiwi-example-main.js');
            				//var s = require('./html/js/keyboard.js');
            				// //s.state.addchild();
            				// io.emit('before',snakes);
            				//socket.emit('before',snakes);
            				//io.emit('create','create new spirit');
            				socket.on('update',function(msg){

            					console.log(msg.id);
            					for(var soc in clients){
									if(clients[soc].id == msg.id){
										console.log(soc+" - "+msg.id);
										clients[soc].snake_array = msg.snake_array;
										clients[soc].score = msg.score;
										return
									}
								};
            				});

            				socket.on('score',function(msg){
            					console.log(msg.id);
            					io.emit('score',msg);
            				});

							socket.on('create', function(msg){
								 snakes = [];
								 console.log("socket got connected");
            				
								 //console.log(findClientsSocket());
								for( var soc in clients){
									snakes.push(clients[soc]);
								}
								socket.emit('before',snakes);
								socket.emit('food',food);
								clients[socket.id] = msg;
								console.log("socket id"+socket.id+" msg "+clients[socket.id].id);						
								socket.broadcast.emit('create', msg);
								
								//io.emit('moving',msg);
							    //console.log('message: ' + msg);
							  });
							socket.on('move',function(msg){
								for(var soc in clients){
									if(clients[soc].id == msg.id){
										clients[soc].d = msg.d;
									console.log("socket id of move : "+soc+" msg id : "+msg.id);
										
									}
								};
								
								io.emit('move',msg);
							});


							socket.on('food',function(msg){
								socket.broadcast.emit('food',msg);
							})

            				socket.on('disconnect',function(){
            					try {
            					console.log("new");
            					msg = clients[socket.id]
            					console.log(socket.id+"  -------- "+msg.id);
            					delete clients[socket.id]
            					console.log(socket.id+" this is socket "+msg.id);
            					console.dir(msg);
								io.emit('delete_snake',msg);
								}
								catch(err){
									console.log(err);
								}
						});
          });
        }
						}
				}

		}


	});


	grunt.registerTask( "default", [ "examples" ] );


};