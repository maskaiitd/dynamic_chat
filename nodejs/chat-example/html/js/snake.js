$(document).ready(function(){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
	//Lets save the cell width in a variable for easy control
	var cw = 10;
	var d;
	var food;
	var score;
	
	//Lets create the snake now
	var snake_array; //an array of cells to make up the snake
	var snake_multi=[];
	function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
	function init(snake_attr)
	{
	
		// id = prompt("Please enter your name", "hello world");
		

		// d = "right"; //default direction
		// create_snake();
		//create_food(); //Now we can see the food particle
		//finally lets display the score
		score = 0;
		//Lets move the snake now using a timer which will trigger the paint function
		//every 60ms
		snake_multi.push(snake_attr);
		msg = snake_attr;
		$("#users").append('<div class="user_score" id=client_' + msg.id + ' ' +
                            'style="min-height:50px;color:white;line-height: 15px;text-align: center;background:'+msg.colour+'" >'+msg.id+'<br/> score - '+ msg.score+'</div>');
    	
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 100);
		setInterval(update,1000);
	}
	//init();
	socket = io();
  console.dir(socket);
  id = prompt("Please enter your name", "hello world");
  //init();
  snake_array = create_snake();
  score = 0 ;
  d = "right";
  colour = getRandomColor();
  snake = {id:id,snake_array:snake_array,score:score,d:d,colour:colour};
  console.dir(snake)
   setTimeout(function () {socket.emit('create', snake);init(snake);}, 1500);
  
  
  
    socket.on('create', function(msg){
      console.log("create");
    	console.dir(msg);
    	snake_multi.push(msg);
    	 $("#users").append('<div class="user_score" id=client_' + msg.id + ' ' +
                            'style="min-height:50px;color:white;line-height: 15px;text-align: center;background:'+msg.colour+'" >'+msg.id+'<br/> score - '+ msg.score+'</div>');
    	console.log(snake_multi);
  //   if(idlist.indexOf(msg) == -1){
  //   state.newchild(msg);
  //   idlist.push(msg);
  //     }
   });

    socket.on('before',function(msgs){
    	console.log("load before snakes");
    	for(var i = 0; i<msgs.length;i++){
    		snake_multi.push(msgs[i]);
    		msg = msgs[i];
    		$("#users").append('<div class="user_score" id=client_' + msg.id + ' ' +
                            'style="min-height:50px;color:white;line-height: 15px;text-align: center;background:'+msg.colour+'" >'+msg.id+'<br/> score - '+ msg.score+'</div>');
    	
    	}
    });

    socket.on('food',function(foo){
    	console.log("food : "+foo);
    	console.dir(foo);
    	food = foo;
    });


    socket.on('score',function(msg){
    	var obj = $('#client_'+msg.id).text(msg.id+"\n score - "+msg.score);
    	obj.html(obj.html().replace(/\n/g,'<br/>'));
    });



    socket.on('delete_snake',function(msg){
    	console.log("user dissconected hh");
    	console.log(msg);
    	for(var i = 0; i<snake_multi.length;i++){
    		if(snake_multi[i].id == msg.id){
    			console.log("deleted "+snake_multi);
    			snake_multi.splice(i,1);
    			$('#client_'+msg.id).remove();
    			return true;
    		}
    	}
    });
    socket.on('move',function(msg){
    	for(var k =0 ; k < snake_multi.length; k++){
    		if(snake_multi[k].id == msg.id){
    			snake_multi[k].d = msg.d;
    			return true;
    		}
    	};

    });
  
	
	function create_snake()
	{
		var length = 5; //Length of the snake
		var snake_array = []; //Empty array to start with
		var x_init =  Math.round(Math.random()*(w-cw)/cw);
		var y_init =  Math.round(Math.random()*(h-cw)/cw);
		for(var i = x_init; i>=x_init-length+1; i--)
		{
			//This will create a horizontal snake starting from the top left
			snake_array.push({x: i, y:y_init});
		}
		return snake_array
	}
	
	//Lets create the food now
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};
		socket.emit('food',food);
		//This will create a cell with x/y between 0-44
		//Because there are 45(450/10) positions accross the rows and columns
	}
	
	function update(){
		socket.emit('update',snake_multi[0] );
	}
	//Lets paint the snake now
	function paint()
	{
		//To avoid the snake trail we need to paint the BG on every frame
		//Lets paint the canvas now
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
		for (var j=0; j < snake_multi.length; j++){
			
			sn_array = snake_multi[j].snake_array;
			sn_d = snake_multi[j].d;
			sn_color = snake_multi[j].colour;
		
		
		//The movement code for the snake to come here.
		//The logic is simple
		//Pop out the tail cell and place it infront of the head cell
		var nx = sn_array[0].x;
		var ny = sn_array[0].y;
		//These were the position of the head cell.
		//We will increment it to get the new head position
		//Lets add proper direction based movement now
		if(sn_d == "right") nx++;
		else if(sn_d == "left") nx--;
		else if(sn_d == "up") ny--;
		else if(sn_d == "down") ny++;
		
		//Lets add the game over clauses now
		//This will restart the game if the snake hits the wall
		//Lets add the code for body collision
		//Now if the head of the snake bumps into its body, the game will restart
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw ){
			if(nx==-1){
				nx = w/cw-1
			}
			if(nx == w/cw){
				nx = 0
			}
			if(ny==-1){
				ny = h/cw-1
			}
			if(ny == h/cw){
				ny = 0
			}
		}
		
		
		//Lets write the code to make the snake eat the food
		//The logic is simple
		//If the new head position matches with that of the food,
		//Create a new head instead of moving the tail
		if(j==0){
		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			snake_multi[0].score = snake_multi[0].score+1;
			//Create new food
			socket.emit('score',snake_multi[0] );
			create_food();
		}
		else
		{
			var tail = sn_array.pop(); //pops out the last cell
			tail.x = nx; tail.y = ny;
		}
	}
	else{
		var tail = sn_array.pop(); //pops out the last cell
			tail.x = nx; tail.y = ny;
	}
		//The snake can now eat the food.
		
		sn_array.unshift(tail); //puts back the tail as the first cell
		snake_multi[j].snake_array= sn_array;
			for(var i = 0; i < sn_array.length; i++)
			{
				var c = sn_array[i];
			//Lets paint 10px wide cells
				paint_cell(c.x, c.y,sn_color);
			}
		
		//Lets paint the food
		try{
		paint_cell(food.x, food.y,"red");
	}
	catch(err){
		console.log(err);
	}
		//Lets paint the score
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);
		

		}
			}
		
	
	//Lets first create a generic function to paint cells
	function paint_cell(x, y,color)
	{
		ctx.fillStyle = color;
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	function check_collision(x, y, array)
	{
		//This function will check if the provided x/y coordinates exist
		//in an array of cells or not
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	//Lets add the keyboard controls now
	$(document).keydown(function(e){
		var key = e.which;
		//We will add another clause to prevent reverse gear
		d = snake_multi[0].d;
		if(key == "37" && d != "right"){ 
				socket.emit('move',{id:id,snake_array:snake_multi[0].snake_array,d:"left"} );
			}
		else if(key == "38" && d != "down") {
			socket.emit('move',{id:id,snake_array:snake_multi[0].snake_array,d:"up"} );
		}
		else if(key == "39" && d != "left"){
			socket.emit('move',{id:id,snake_array:snake_multi[0].snake_array,d:"right"} );
		}
		else if(key == "40" && d != "up") {
			socket.emit('move',{id:id,snake_array:snake_multi[0].snake_array,d:"down"} );
		}
		//The snake is now keyboard controllable
	})
	
	
	
	
	
	
	
})
