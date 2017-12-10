var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#000000";
ctx.fillRect(0,0,10,10);
//ctx.fillRect(0,10,10,10);
//ctx.fillRect(0,20,10,10);

var game_paused = true;
var game_seconds = 0;
var egg_position = [50,50];

var enemies = [
  // each index is an enemy array - 1: guid 2: x coord 3: y coord
];

var sword_swung = false;

var character_position = [0,0];
var tail_position = [
  [0,10],
  [0,20]
]
var character_direction = 2;
var character_length = 3;

var snake_movement;

/*
function toggle_pause(){
  if (game_paused){
    console.log("unpausing!");
    snake_movement = window.setInterval(function(){
      switch(character_direction){
        case 0:
          //console.log("Up!");
          move_character(character_position[0],(character_position[1]-10));
          break;
        case 1:
          //console.log("Down!");
          move_character(character_position[0],(character_position[1]+10));
          break;
        case 2:
          //console.log("Right!");
          move_character((character_position[0]+10),character_position[1]);
          break;
        case 3:
          //console.log("Left!");
          move_character((character_position[0]-10),character_position[1]);
          break;
      }
      if (character_position[0] == egg_position[0] && character_position[1] == egg_position[1]){
        add_egg();
        add_tail();
      }
    }, 200);
    game_paused = false;
  }
  else{
    console.log("pausing!");
    game_paused = true;
    window.clearInterval(snake_movement);
  }
}
*/

// Character Functions
// Character Functions

//Key Detection
document.onkeydown = function(evt) {
    evt = evt || window.event;
    switch(evt.key){
      //case "ArrowUp":
      case "w":
        //console.log("Up!");
        move_character(character_position[0],(character_position[1]-10));
        character_direction = 0;
        break;
      //case "ArrowDown":
      case "s":
        //console.log("Down!");
        move_character(character_position[0],(character_position[1]+10));
        character_direction = 1;
        break;
      //case "ArrowRight":
      case "d":
        //console.log("Right!");
        move_character((character_position[0]+10),character_position[1]);
        character_direction = 2;
        break;
      //case "ArrowLeft":
      case "a":
        //console.log("Left!");
        move_character((character_position[0]-10),character_position[1]);
        character_direction = 3;
        break;
      case "ArrowUp":
      swing_sword('up');
        break;
      case "ArrowDown":
      swing_sword('down');
        break;
      case "ArrowLeft":
      swing_sword('left');
        break;
      case "ArrowRight":
      swing_sword('right');
        break;
        //console.log("space!");
        //toggle_pause();
      //break;
      /*case "f":
        add_tail();
        break;*/
    }
};

function move_character(x,y){
  // test
  //console.log(x);
  //console.log(y);
  //debugger;
  // edge detection
  if (x < 0 || y < 0) { return; }
  if (x > 190 || y > 90) {return; }
  if (sword_swung){ return;}
  // delete old character
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(character_position[0],character_position[1],10,10);

  // draw new character
  ctx.fillStyle = "#000000";
  ctx.fillRect(x,y,10,10);

  /*
  // add old character position to top of tail position
  tail_position.unshift(character_position);
  // remove extra position at end
  var to_delete = tail_position.pop();
  tail_position = tail_position;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(to_delete[0],to_delete[1],10,10);
  ctx.fillStyle = "#000000";
  */
  //redraw tail
  /*
  for (var z = 0; z < tail_position.length; z++){
    var position = tail_position[z];
    //console.log(position);
    ctx.fillRect(position[0],position[1],10,10);
  }*/


  // save the current position
  character_position = [x,y];

};

function swing_sword(direction){
  var coordinates = [];
  coordinates.push(character_position[0])
  coordinates.push(character_position[1]);
  //debugger;
  ctx.fillStyle = "#0000ff";
  switch(direction)
  {
    case 'up':
    coordinates[1] = coordinates[1] - 10;
    break;
    case 'down':
    coordinates[1] = coordinates[1] + 10;
    break;
    case 'left':
    coordinates[0] = coordinates[0] - 10;
    break;
    case 'right':
    coordinates[0] = coordinates[0] + 10;
    break;
  }
  //draw sword
  if (!sword_swung){
    //debugger;
    ctx.fillRect(coordinates[0],coordinates[1],10,10);
    sword_swung = true;
    for (var x = 0; x < enemies.length; x++){
      var index = enemies[x];
      if (index[1] ==  coordinates[0] && index[2] ==  coordinates[1])
      {
        console.log('enemy hit!');
      }
    }
    window.setTimeout(function(){
      //erase sword
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(coordinates[0],coordinates[1],10,10);
        sword_swung = false;
    },100);
  }
}

// Character Functions
// Character Functions

// ***************************************************

var enemy1 = new goblin(1,50,50);

function goblin(guid,x,y){
  this.id = guid;
  this.x = x;
  this.y = y;
  enemies.push([guid,x,y]);
  this.draw = function(newx,newy){
    if (newx < 0 || newy < 0) { return; }
    if (newx > 190 || newy > 90) {return; }

    // delete old character
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x,y,10,10);

    // draw new character
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(newx,newy,10,10);

    // save the current position
    x = newx;
    y = newy;
    for (var z = 0; z < enemies.length; z++){
        if (enemies[z][0] == guid){
          enemies[z][1] = newx;
          enemies[z][2] = newy;
        }
    }
  }
  this.chase = function(){
    this.interval = window.setInterval(function(){
      if (zdistance(x,y)<150){
        //debugger;
        var direction = directiontocharacter(x,y);
        switch (direction){
          case 'up':
            draw(x,(y-10));
          break;
          case 'down':
            draw(x,(y+10));
          break;
          case 'left':
            draw((x-10),y);
          break;
          case 'right':
            draw((x+10),y);
          break;
        }
      }
      function draw(newx,newy){
        if (newx < 0 || newy < 0) { return; }
        if (newx > 190 || newy > 90) {return; }
        // delete old character
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x,y,10,10);
        // draw new character
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(newx,newy,10,10);
        // save the current position
        x = newx;
        y = newy;
      }
    },1000);
  }
}

function zdistance(enemyx,enemyy){
  //debugger;
  var x2 = Math.pow((enemyx - character_position[0])*1,2);
  var y2 = Math.pow((enemyy - character_position[1])*1,2);
  var distance = Math.round(Math.sqrt(x2 + y2));
  if (distance < 15) {distance = 1000;}
  return distance;
}

function directiontocharacter(enemyx,enemyy){
  //debugger;
  var x = enemyx - character_position[0];
  var y = enemyy - character_position[1];
  var xdirection, ydirection;
  var finaldirection = '';
  if (x > 0){xdirection = 'left';}
  if (x == 0) {xdirection = '';}
  if (x < 0) {xdirection = 'right'}
  if (y > 0){ydirection = 'up';}
  if (y == 0) {ydirection = '';}
  if (y < 0) {ydirection = 'down'}
  if (xdirection == ''){
    y > 0 ? finaldirection = 'up' : finaldirection = 'down';
    return finaldirection;
  }
  if (ydirection == ''){
    x > 0 ? finaldirection = 'left' : finaldirection = 'right';
    return finaldirection;
  }
  else{
    if ((x*1) > (y*1)){
      y > 0 ? finaldirection = 'up' : finaldirection = 'down';
    }
    if ((y*1) > (x*1)){
      x > 0 ? finaldirection = 'left' : finaldirection = 'right';
    }
    else {
      y > 0 ? finaldirection = 'up' : finaldirection = 'down';
    }
   }

   return finaldirection;
}


/*
function add_tail(){
  //debugger;
  // find where the new tail position should be
  var arr_length = tail_position.length;
  var end_position = tail_position[(arr_length-1)];
  var second_end_position = tail_position[(arr_length-2)];
  var prefered_direction; // top, bottom, right, left
  if (end_position[0] > second_end_position[0]){
    prefered_direction = 2 //add extra to right
  }
  if (end_position[0] < second_end_position[0]){
    prefered_direction = 3 //add extra to left
  }
  if (end_position[1] > second_end_position[1]){
    prefered_direction = 1 //add extra to bottom
  }
  if (end_position[1] < second_end_position[1]){
    prefered_direction = 0 //add extra to top
  }
  if (end_position[0] == 190 || end_position[0] == 0){
    // touching to left
    if (end_position[0] == 0 && prefered_direction == 3){prefered_direction=2;}
    // touching to right
    if (end_position[0] == 190 && prefered_direction == 2){prefered_direction=3;}
  }
  if (end_position[1] == 90 || end_position[1] == 0){
    //touching to top
    if (end_position[0] == 0 && prefered_direction == 0){prefered_direction=1;}
    // touching to bottom
    if (end_position[0] == 90 && prefered_direction == 1){prefered_direction=0;}
  }
  var new_position = [];
  switch(prefered_direction){
    case 0:
     new_position.push(end_position[0]);
     new_position.push(end_position[1]-10);
    break;
    case 1:
     new_position.push(end_position[0]);
     new_position.push(end_position[1]+10);
    break;
    case 2:
     new_position.push(end_position[0]+10);
     new_position.push(end_position[1]);
    break;
    case 3:
     new_position.push(end_position[0]-10);
     new_position.push(end_position[1]);
    break ;
  }

  // add new position to tail_positions
  tail_position.push(new_position);
  ctx.fillStyle = "#000000";
  ctx.fillRect(new_position[0],new_position[1],10,10);
}
*/
/*
function add_egg(){
  var x_rand = getRandomArbitrary(1,200);
  var y_rand = getRandomArbitrary(1,100);
  function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
  }
  var x_rand = Math.floor((x_rand / 10)) * 10;
  var y_rand = Math.floor((y_rand / 10)) * 10;
  egg_position = [x_rand,y_rand];
  debugger;
  if (character_position[0] == egg_position[0] && character_position[1] == egg_position[1])
  {
   add_egg();
  }
  if (tail_position.indexOf(egg_position) !== -1)
  {
    add_egg();
  }
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(x_rand,y_rand,10,10);
}
*/
/*
add_egg();
*/
