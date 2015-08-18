var io ;
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
            				//require('./html/js/kiwi-example-main.js');
            				//var s = require('./html/js/keyboard.js');
            				//s.state.addchild();
            				console.log("socket got connected");
            				//io.emit('create','create new spirit');
							socket.on('create', function(msg){
								socket.broadcast.emit('create', msg);
								//io.emit('moving',msg);
							    //console.log('message: ' + msg);
							  });
							socket.on('move',function(msg){
								io.emit('move',msg)
							});

            				socket.on('disconnect',function(){
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