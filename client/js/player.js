/*
 * The player can be human or computer and always have one paddle
 * The index is the position of the player in the players array
 * @param Boolean ai 
 */
var Player = function(index, paddle, ai){
    var obj = this; // Catch this
    obj.paddle = paddle;
    obj.index = index;
    obj.ai = ai;
    obj.score = 0;
    
    obj.attachControls = function(){
        canvas.addEventListener("mousemove", function(e){
            if(obj.index == 0 || obj.index == 1)
                obj.paddle.move(null, e.y);
            else
                obj.paddle.move(e.x, null);
            
        }); 
    };
    
    var init = function(){ 
        obj.paddle.player = obj; // Attach player to paddle
    
        // Check if the player is human or not
        if(!obj.ai){
            obj.paddle.ai = false;
            obj.attachControls();
        }
        else{
            // Tell the paddle it's AI
            obj.paddle.ai = true;
        }
        
        // Set paddle position
        obj.paddle.position = obj.index;
        
        // Init the paddle
        obj.paddle.init();
    }();
    
    obj.updateScore = function(){
        obj.score++;
    };
      
};