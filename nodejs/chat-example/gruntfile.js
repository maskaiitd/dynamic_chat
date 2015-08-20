var io ;
clients ={};
snakes=[];
var w = 900;
var h = 500;
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
								hostname: process.env.IP,
								port: process.env.PORT,
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

            					for(var soc in clients){
									if(clients[soc].id == msg.id){
										clients[soc].snake_array = msg.snake_array;
										clients[soc].score = msg.score;
										return
									}
								};
            				});

            				socket.on('score',function(msg){
            					io.emit('score',msg);
            				});

							socket.on('create', function(msg){
								 snakes = [];
								 
								 //console.log(findClientsSocket());
								for( var soc in clients){
									snakes.push(clients[soc]);
								}
								socket.emit('before',snakes);
								socket.emit('food',food);
								clients[socket.id] = msg;
								socket.broadcast.emit('create', msg);
								
								//io.emit('moving',msg);
							    //console.log('message: ' + msg);
							  });
							socket.on('move',function(msg){
								for(var soc in clients){
									if(clients[soc].id == msg.id){
										clients[soc].d = msg.d;
										
									}
								};
								
								io.emit('move',msg);
							});


							socket.on('food',function(msg){
								food = msg;
								socket.broadcast.emit('food',msg);
							})

            				socket.on('disconnect',function(){
            					try {
            					msg = clients[socket.id]
            					delete clients[socket.id]
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