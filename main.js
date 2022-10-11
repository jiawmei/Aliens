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
  rr
 rrrr
 rrrr
rrrrrr
rr  rr
yy  yy
yy  yy
`,
];

const gamesize = {
  WIDTH: 125,
  HEIGHT: 150
};

options = {
  viewSize: {x:gamesize.WIDTH, y:gamesize.HEIGHT},
  seed: 1,
  isPlayingBgm: true

};

let player;
let aliens;
let friendly;
let alienSpeed;
let friendlySpeed;
let backgroundParticles;

function update() {
  if (!ticks) {
    backgroundParticles = times(25,() => {
      const posX = rnd(0,gamesize.WIDTH);
      const posY = rnd(0,gamesize.HEIGHT);
      return {
        pos:vec(posX, posY),
        speed:rnd(0.3,1)
      };
    });
    
    player = {
      pos: vec(25, gamesize.HEIGHT * 0.9)
    };
    aliens = [];
    friendly = [];
    friendlySpeed = 1.7;
    alienSpeed = 2;
  }

  backgroundParticles.forEach((bp) => {
    bp.pos.y += bp.speed;
    if(bp.pos.y > gamesize.HEIGHT){
      bp.pos.y = 0;
    }
    color("light_black");
    box(bp.pos,1);
  });

  if(aliens.length === 0){
    //alienSpeed = 2;
    const rows = [25,50,75,100];
    for(let i=0; i < 8; i++){
      randLane = Math.floor(Math.random() * rows.length);
      //console.log(randLane);
      const alienX = rows[randLane];
      const alienY = -rnd(i*gamesize.HEIGHT*0.1);
      aliens.push({pos: vec(alienX, alienY)})
    }
  }

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

  
  if(input.isJustPressed){
    if(player.pos.x + 25 < 125){
      player.pos.x = player.pos.x + 25;
    }else{
      player.pos.x = 25;
    }
   
  }
  
  color("black");
  char("a",player.pos);
  
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