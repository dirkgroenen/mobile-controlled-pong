// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     ||  
		function( callback ){
			return window.setTimeout(callback, 1000 / 60);
		};
})();

window.cancelRequestAnimFrame = ( function() {
	return window.cancelAnimationFrame          ||
		window.webkitCancelRequestAnimationFrame    ||
		window.mozCancelRequestAnimationFrame       ||
		window.oCancelRequestAnimationFrame     ||
		window.msCancelRequestAnimationFrame        ||
		clearTimeout
} )();


var players = [],
    balls = [],
    score = [],
    cwidth = 750,
    cheight = 750,
    canvas,
    ctx,
    ny, 
    nx,
    prevpaddlehit;

var stats = new Stats();
stats.setMode(1); // 0: fps, 1: ms

// Align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );

var Pong = function(){
    var obj = this; // Catch this;
    // Init vars
    canvas = document.getElementById("pong");
    ctx = canvas.getContext("2d");
    obj.gameover = false;
    score = [];
    
    // Set arrays that hold elements
    players = [];
    balls = [];
    
    // Set canvas width and height
    canvas.height = cheight;
    canvas.widdth = cwidth;

    var init = function(){
        // Add two paddles
        players.push(new Player(0, new Paddle(), true));
        players.push(new Player(1, new Paddle(), true));
        players.push(new Player(2, new Paddle(), true));
        players.push(new Player(3, new Paddle(), true));
        
        // Add ball to the canvas; ALWAYS add the players after the paddles
        balls.push(new Ball());
        
    }();
    
    // Draw all elements
    obj.drawgame = function(){
        // Draw the balls
        balls.forEach(function(ball){
            ball.draw();
        });
        
        // Draw the paddles
        players.forEach(function(player){
            player.paddle.draw();
        });
    };
    
    // Clear the canvas
    obj.clear = function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    
    var gameloop = function(){
        stats.begin();
        // Clear canvas
        obj.clear();
        
        // Draw everyting
        obj.drawgame();
        
        stats.end();
        // Repeat loop
        if(!obj.gameover)
            requestAnimFrame(gameloop);
    };
    
    obj.start = function(){
        gameloop();
    }
    
    /* 
     * Game over stopts the game and shows the game over message
     */
    gameover = function(){
        obj.gameover = true;
        console.log({X: balls[0].x, Y: balls[0].y});
    }
};

// Start game on document ready
window.onload = function(){
    var game = new Pong();
    game.start();
};
