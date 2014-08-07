var Ball = function(){
    var obj = this; //catch this
    obj.vx = (Math.random() < .5) ? 260 : -260;
    obj.vy = (Math.random() < .5) ? 260 : -260;
    obj.radius = 8;
    obj.x = canvas.width / 2;
    obj.y = canvas.height / 2 + 1;
    obj.freewalls = {l: true, t: true, r: true, b: true};
    
    // Check which walls are free from players
    players.forEach(function(player){
        if(player.index == 0)
            obj.freewalls.l = false;
        if(player.index == 1)
            obj.freewalls.r = false;
        if(player.index == 2)
            obj.freewalls.t = false;
        if(player.index == 3)
            obj.freewalls.b = false;
    });
    
    /*
     * Draw the ball on the canvas and move it every step
     */
    obj.draw = function(){
        // Check for collisions on every draw if there are only two players
        obj.checkWallCollision();
        
        // Update the position
        obj.x += (obj.vx * dt);
        obj.y += (obj.vy * dt);
        
        // Draw to canvas
        ctx.beginPath();
		ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'black';
		ctx.fill();
    };
    
    /*
     * Check for collision with the walls
     */
    obj.checkWallCollision = function(){
        // Check top wall
        if((obj.y - obj.radius < 0 && (obj.vy * dt) < 0 && obj.freewalls.t) || (obj.y + obj.radius > canvas.height && (obj.vy * dt) > 0 && obj.freewalls.b))
            obj.vy = -obj.vy;
        
        if((obj.x - obj.radius < 0 && (obj.vx * dt) < 0 && obj.freewalls.l) || (obj.x + obj.radius > canvas.width && (obj.vx * dt) > 0 && obj.freewalls.r))
            obj.vx = -obj.vx;
        
        // Game over checks
        if((obj.y - obj.radius < 0 && (obj.vy * dt) < 0 && !obj.freewalls.t) || (obj.y + obj.radius > canvas.height && (obj.vy * dt) && !obj.freewalls.b))
            gameover();
                
        if((obj.x - obj.radius < 0 && (obj.vx * dt) < 0 && !obj.freewalls.l) || (obj.x + obj.radius > canvas.width && (obj.vx * dt) > 0 && !obj.freewalls.r))
            gameover();
        
        
    };
};