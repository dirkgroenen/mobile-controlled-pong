/*
 * The paddles that are controlled by the user or computer. Param ai sets if it's a computer or user controlled paddle
 * @param Boolean ai 
 */
var Paddle = function(){
    var obj = this; // Catch
    obj.width = 150;
    obj.height = 6;
    obj.x;
    obj.y;
    obj.direction;
    obj.ai;
    obj.position;
    obj.player;
    obj.paddlespeed = 20;
    
    // On init we determine wheter the peddle has to be vertical or horizontal
    obj.init = function(){
        // Get the number of paddles already in the game, the first paddle will always be left, the second right, the thirt top and the fourth bottom
        switch(obj.position){
            case 0:
            case 1:
                obj.direction = "vertical";
                
                // Inverse the height and width
                var oldheight = obj.height;
                obj.height = obj.width;
                obj.width = oldheight;
                break;
            case 2:
            case 3:
                obj.direction = "horizontal";
                break;
        };
        
        // Again switch the number, but know check if we have to be on the left or right
        switch(obj.position){
            case 0: // Left
                obj.x = 10;
                obj.y = (canvas.height / 2) - (obj.height / 2);
                break;
            case 1: // Right
                obj.x = canvas.width - 10 - obj.width;
                obj.y = (canvas.height / 2) - (obj.height / 2);
                break;
            case 2: // Top
                obj.y = 10;
                obj.x = (canvas.width / 2) - (obj.width / 2);
                break;
            case 3: // Bottom
                obj.y = canvas.height - 10 - obj.height;
                obj.x = (canvas.width / 2) - (obj.width / 2);
                break;
        };
    };
    
    /*
     * Draw the paddles
     */
    obj.draw = function(){    
        // Call the position updater
        obj.updatePosition();
    
        // Check for collisions
        obj.checkCollision();
    
        ctx.rect(obj.x, obj.y, obj.width, obj.height);
        ctx.fillStyle = "black";
        ctx.fill();
    };
    
    /*
     * Update the position of the paddle, based on if it's an IA or person
     */
    obj.updatePosition = function(){
        // If AI
        if(obj.ai){
            if((obj.position == 1 && balls[0].vx > 0) || (obj.position == 0 && balls[0].vx < 0)){
                if(ny){
                    /*
                    if(obj.y - 10 > ny - (obj.height / 2))
                        obj.y -= obj.paddlespeed;
                    else if(obj.y + 10 < ny - (obj.height / 2))
                        obj.y += obj.paddlespeed;
                    */
                    obj.y = ny - (obj.height / 2);
                }
                else if(!ny){
                    obj.y = balls[0].y - (obj.height / 1.2);
                }
            }
        
            if((obj.position == 2 && balls[0].vy < 0) || (obj.position == 3 && balls[0].vy > 0)){
                if(nx){
                    /*if(obj.x - 10 > nx - (obj.width / 2))
                        obj.x -= obj.paddlespeed;
                    else if(obj.x + 10 < nx - (obj.width / 2))
                        obj.x += obj.paddlespeed;*/
                    obj.x = nx - (obj.width / 2);
                }
                else if(!nx){
                    obj.x = balls[0].x - (obj.width / 1.2);
                }
            }
            
        }
    };

    /*
     * Check for a collision with the balls
     */
    obj.checkCollision = function(){
        // Check position of all the balls
        balls.forEach(function(ball){
            if(ball.x > canvas.width - 100 || ball.x < 100){
                if((ball.x + ball.radius + ball.vx > obj.x) && (ball.y > obj.y && ball.y < (obj.y + obj.height)) && obj.position == 1 && ball.vx > 0){
                    ball.vx = -ball.vx;
                    obj.collide(ball);
                }                    
                if((ball.x + ball.vx < obj.x + obj.width) && (ball.y > obj.y && ball.y < (obj.y + obj.height)) && (obj.position == 0) && ball.vx < 0){
                    ball.vx = -ball.vx;
                    obj.collide(ball);
                }
            }
            if(ball.y > canvas.height - 100 || ball.y < 100){
                if((ball.y + ball.radius + ball.vy > obj.y) && (ball.x > obj.x && ball.x < (obj.x + obj.width)) && obj.position == 3 && ball.vy > 0){
                    ball.vy = -ball.vy;
                    obj.collide(ball);
                }                    
                if((ball.y + ball.vy < obj.y + obj.height) && (ball.x > obj.x && ball.x < (obj.x + obj.width)) && (obj.position == 2) && ball.vy < 0){
                    ball.vy = -ball.vy;
                    obj.collide(ball);
                }
            }
        });
        
    };
    
    obj.collide = function(ball){
        // Register paddle position as last hit
        lastpaddlehit = obj.position;
    
        obj.player.updateScore();
        
        // Calculate the bounce angle and give new directions to the ball
        obj.calculateBounce(ball);
        
        // Calculate the next position for the paddles 
        if(lastpaddlehit != 2 && lastpaddlehit != 3)
            obj.calculatePaddleY(ball);
            
        if(lastpaddlehit != 0 && lastpaddlehit != 1)
            obj.calculatePaddleX(ball);
            
    };
    
    // Calculate the bounce angle and give new directions to the ball
    obj.calculateBounce = function(ball){
        var speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        var speedacc = (Math.abs(speed) < 20) ? 0.5 : 0;
    
        if(obj.position == 0 || obj.position == 1){
            var relativeIntersectY = (obj.y + (obj.height / 2)) - ball.y;
            var normalizedRelativeIntersectionY = (relativeIntersectY/(obj.height/2));
            var bounceAngle = normalizedRelativeIntersectionY * (5 * Math.PI / 12);
            
            speed = (ball.vx < 0) ? -speed - speedacc : speed + speedacc; // check wheter we go left or right
            
            ball.vx = speed * Math.cos(bounceAngle);
            ball.vy = speed * -Math.sin(bounceAngle);
        }
        else{
            var relativeIntersectX = (obj.x + (obj.width / 2)) - ball.x;
            var normalizedRelativeIntersectionX = (relativeIntersectX/(obj.width/2));
            var bounceAngle = normalizedRelativeIntersectionX * (5 * Math.PI / 12);
            
            speed = (ball.vy < 0) ? -speed - speedacc : speed + speedacc; // check wheter we go up or down
            
            ball.vx = speed * ((ball.vy < 0) ? Math.sin(bounceAngle) : -Math.sin(bounceAngle));
            ball.vy = speed * Math.cos(bounceAngle);
        }

    };
    
    // Calculate new position for the AI paddle (Y)
    obj.calculatePaddleY = function(ball){
        var cy = ball.vy * (735 / Math.abs(ball.vx)) + ball.y;
        var up = (ball.vy < 0);
        var b = Math.abs(Math.floor(cy / 750));
        var r = Math.abs(Math.floor(cy/b) % 2);
        var ry = cy % 750;
        //console.log({cy: cy, up: up, b: b, r: r, ry: ry});
        
        if((!up && (b == 2 && r == 1)) || b == 0)
            ny = ry;
        else if(!up)
            ny = 750 - (ry);
        else if(up && b == 1 || (b > 2))
            ny = Math.abs(ry);
        else
            ny = (ry) + 750;

        
        if(b > 0){
            if(up)
                var tnx = Math.abs(ball.x - Math.abs((ball.y/ball.vy) * ball.vx));
            else
                var tnx = Math.abs(ball.x - Math.abs(((750 - ball.y)/ball.vy) * ball.vx));
            nx = obj.affectPaddleX(tnx);
        }
        
        // Affect the paddles new Y position so it wont always try to hit the center of the paddle
        ny = obj.affectPaddleY(ny);
        
    };
    
    // Calculate new position for the AI paddle (X)
    obj.calculatePaddleX = function(ball){    
        var cx = ball.vx * (735 / Math.abs(ball.vy)) + ball.x;
        var left = (ball.vx < 0);
        var b = Math.abs(Math.floor(cx / 750));
        var r = Math.abs(Math.floor(cx/b) % 2);
        var rx = cx % 750;
        
        //console.log({cx: cx, left: left, b: b, r: r, rx: rx});
        
        if((!left && (b == 2)) || b == 0)
            nx = rx;
        else if(!left)
            nx = 750 - (rx);
        else if(left && b == 1 || (b > 2))
            nx = Math.abs(rx);
        else
            nx = (rx) + 750;

        if(b > 0){
            if(left)
                var tny = Math.abs(ball.y - Math.abs((ball.x/ball.vx) * ball.vy));
            else
                var tny = Math.abs(ball.y - Math.abs(((750 - ball.x)/ball.vx) * ball.vy));
            ny = obj.affectPaddleY(tny);
            
        }
        
        // Affect the paddles new Y position so it wont always try to hit the center of the paddle
        nx = obj.affectPaddleX(nx);
    };
    
    // Affect the paddles new Y position so it wont always try to hit the center of the paddle
    // The lower the difficulty number, the harder the player will be
    obj.affectPaddleY = function(sny){
        var deviation = ((Math.random() * (obj.height / 5)));
        deviation = (Math.random < .5) ? deviation : -deviation;
        return sny + deviation;
    };
    
    // Affect the paddles new X position so it wont always try to hit the center of the paddle
    // The lower the difficulty number, the harder the player will be
    obj.affectPaddleX = function(snx){
        var deviation = ((Math.random() * (obj.width / 5)));
        deviation = (Math.random < .5) ? deviation : -deviation;
        return snx + deviation;
    };
    
    // Move the paddle manual
    obj.move = function(x, y){
        obj.x = (x == null) ? obj.x : x - obj.width / 2;
        obj.y = (y == null) ? obj.y : y - obj.height / 2;
    };
  
};