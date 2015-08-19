var io ;
clients ={};
snakes=[];
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
								port: 8000,
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
            				console.log("socket got connected");
            				//socket.emit('before',snakes);
            				//io.emit('create','create new spirit');
            				socket.on('update',function(msg){
            					console.log("yoo");
            					for(var soc in clients){
									if(clients[soc].id == msg.id){
										clients[soc].snake_array = msg.snake_array;
									}
								};
            				});
							socket.on('create', function(msg){
								console.log("socket id"+socket.id);
								 snakes = [];
								for( var soc in clients){
									snakes.push(clients[soc]);
								}
								socket.emit('before',snakes);
																
								socket.broadcast.emit('create', msg);
								clients[socket] = msg;
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

            				socket.on('disconnect',function(){
            					msg = clients[socket]
            					delete clients[socket]
            					console.dir(msg);
								io.emit('delete_snake',msg);
						  console.log('user dissconnected');
						});
          });
        }
						}
				}

		}


	});


	grunt.registerTask( "default", [ "examples" ] );


};