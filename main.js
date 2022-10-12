title = "Aliens";

description = `
    Kill Aliens
  Avoid Red Ships


[Tap] Shift Right
  
`;

characters = [
` 
  cc
 llll
 llll
llllll
ll  ll
yy  yy
yy  yy
`,`
 gggg
g gg g
gggggg
gg  gg
gg  gg
`,`
 RRRR
R RR R
RRRRRR
RR  RR
RR  RR
`,
];

const gamesize = {
  WIDTH: 125,
  HEIGHT: 150
};

options = {
  viewSize: {x:gamesize.WIDTH, y:gamesize.HEIGHT},
  seed: 1,
  isPlayingBgm: true,
  theme: "pixel"

};

let player;
let aliens;
let friendly;
let movingRight = true;
let alienSpeed;
let friendlySpeed;
let backgroundParticles;

function update() {
  if (!ticks) {
    // initialize background particles
    backgroundParticles = times(25,() => {
      const posX = rnd(0,gamesize.WIDTH);
      const posY = rnd(0,gamesize.HEIGHT);
      return {
        pos:vec(posX, posY),
        speed:rnd(0.3,1)
      };
    });
    
    // initialize player
    player = {
      pos: vec(25, gamesize.HEIGHT * 0.9)
    };
    aliens = [];
    friendly = [];
    friendlySpeed = 1.7;
    alienSpeed = 2;
  }

  // spawn background particles
  backgroundParticles.forEach((bp) => {
    bp.pos.y += bp.speed;
    if(bp.pos.y > gamesize.HEIGHT){
      bp.pos.y = 0;
    }
    color("light_black");
    box(bp.pos,1);
  });

  // spawn aliens
  if(aliens.length === 0){

    const rows = [25,50,75,100];
    for(let i=0; i < 8; i++){
      randLane = Math.floor(Math.random() * rows.length);
      //console.log(randLane);
      const alienX = rows[randLane];
      const alienY = -rnd(i*gamesize.HEIGHT*0.1);
      aliens.push({pos: vec(alienX, alienY)})
    }
  }

  // spawn friendlies
  if(friendly.length === 0){
    
    const rows = [25,50,75,100];
    for(let i=0; i < 3; i++){
      randLane = Math.floor(Math.random() * rows.length);
      //console.log(randLane);
      const friendlyX = rows[randLane];
      const friendlyY = -rnd(i*gamesize.HEIGHT*0.1);
      friendly.push({pos: vec(friendlyX, friendlyY)})
    }
  }

  // move left/right on button press
  if(input.isJustPressed){
    if(movingRight){
      if(player.pos.x + 25 < 125){
        player.pos.x = player.pos.x + 25;
      }else{
        movingRight = false;
      }
    }
  
    if(!movingRight){
      if(player.pos.x - 25 > 0){
        player.pos.x = player.pos.x - 25;
      }else{
        movingRight = true;
        player.pos.x = player.pos.x + 25;
      }
    }
  }
  
  // spawn player
  color("black");
  char("a",player.pos);
  
  // collision of aliens and player
  remove(aliens, (e) => {
    e.pos.y += alienSpeed;
    color("green");
    char("b", e.pos);

    alienCollide = char("b", e.pos).isColliding.char.a;
    //console.log(alienCollide);
    if(alienCollide){
      color("green");
      particle(e.pos);
      addScore(1);
      play("explosion");
    }
    return(alienCollide || e.pos.y > gamesize.HEIGHT);
  });
  
  // collision of player and friendlies
  remove(friendly, (f) => {
    f.pos.y += friendlySpeed;
    color("red");
    char("c", f.pos);

    friendlyCollide = char("c", f.pos).isColliding.char.a;
    
    if(friendlyCollide){
      play("hit");
      end();
    }
    return(f.pos.y > gamesize.HEIGHT);
  });
    
}

addEventListener("load", onLoad);