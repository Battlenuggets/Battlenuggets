function Game (w, h) {
  this.w = w;
  this.h = h;

  // load nugget image
  this.nuggetImg = new Image();
  this.nuggetImg.src = '/img/battlenugget.png';

  this.projectiles = [
    new Projectile(30, 200, 200, 230, 1)
  ];
}

// compute where to draw the nugget based on its team data
Game.prototype.getFighterDimensions = function (teamData) {
  var w = 40;
  var h = 40;
  var x = teamData.id === 0 ? 50 : this.w - 50 - w;
  var y = 30 + teamData.position * 60;

  return {
    w: w,
    h: h,
    x: x,
    y: y
  };
}

// create nugget instances based on raw fighter data from server
Game.prototype.createNuggets = function (fighters) {
  this.nuggets = fighters.map(function (fighter) {
    var dims = this.getFighterDimensions(fighter.team);

    return new Nugget(dims.x, dims.y, dims.w, dims.h, this.nuggetImg, fighter.combat);
  }.bind(this));
}

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, this.w, this.h);

  this.nuggets.forEach(function (nugget) {
    nugget.draw(ctx);
  });

  this.projectiles.forEach(function (projectile) {
    projectile.draw(ctx);
  });
};

Game.prototype.update = function (dt) {
  if (!dt) return;

  this.projectiles.forEach(function (projectile) {
    projectile.update(dt);
  });
};

var mockInitBattleData = JSON.parse('{"fighters":[{"combat":{"maxHealth":100,"health":100,"attack":10},"team":{"id":0,"position":0}},{"combat":{"maxHealth":100,"health":100,"attack":10},"team":{"id":0,"position":1}},{"combat":{"maxHealth":100,"health":100,"attack":10},"team":{"id":0,"position":2}},{"combat":{"maxHealth":100,"health":100,"attack":10},"team":{"id":1,"position":0}},{"combat":{"maxHealth":100,"health":100,"attack":10},"team":{"id":1,"position":1}},{"combat":{"maxHealth":100,"health":100,"attack":10},"team":{"id":1,"position":2}}]}');

setTimeout(function() {
  var canvas = document.getElementById('canvas');

  // TODO: either make entire page statically sized, or somehow add
  // resize handlers to this
  var width = canvas.width = 500;
  var height = canvas.height = 500;

  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  var lastTimestamp;
  var nextTimestamp;

  var game = new Game(width, height);
  game.createNuggets(mockInitBattleData.fighters);

  function gameloop(timestamp) {
    lastTimestamp = nextTimestamp;
    nextTimestamp = timestamp;

    game.update((nextTimestamp - lastTimestamp) / 1000);
    game.draw(ctx);

    requestAnimationFrame(gameloop);
  }

  requestAnimationFrame(gameloop);
}, 500)

