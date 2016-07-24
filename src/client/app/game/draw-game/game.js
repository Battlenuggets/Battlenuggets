function Game (w, h) {
  this.w = w;
  this.h = h;

  // load nugget image
  this.nuggetImg = new Image();
  this.nuggetImg.src = '/img/battlenugget.png';

  this.projectiles = [];
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
};

// create nugget instances based on raw fighter data from server
Game.prototype.createNuggets = function (fighters) {
  this.nuggets = fighters.map(function (fighter) {
    var dims = this.getFighterDimensions(fighter.team);

    return new Nugget(
      dims.x,
      dims.y,
      dims.w,
      dims.h,
      this.nuggetImg,
      fighter.team,
      fighter.combat
    );
  }.bind(this));
};

Game.prototype.handleTick = function (tickData) {
  var self = this;

  tickData.forEach(function (attack, index) {
    setTimeout(function () {
      self.startAttack(attack.attacker, attack.defender);
    }, index * 250);
  });
};

Game.prototype.startAttack = function (attackerTeamData, defenderTeamData) {
  var p0 = this.getFighterDimensions(attackerTeamData);
  var p1 = this.getFighterDimensions(defenderTeamData);

  var projectile = new Projectile(p0.x, p0.y, p1.x, p1.y, .3);
  projectile.onComplete(function () {
    this.removeProjectile(projectile);
  }.bind(this));

  this.projectiles.push(projectile);
};

Game.prototype.removeProjectile = function (projectile) {
  var index = this.projectiles.indexOf(projectile);

  if (index !== -1) {
    this.projectiles.splice(index, 1);
  }
};

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
var mockTickData = JSON.parse('[{"attacker":{"id":0,"position":2},"defender":{"id":1,"position":0},"damage":9.503545632331114,"defenderHealth":91},{"attacker":{"id":1,"position":0},"defender":{"id":0,"position":1},"damage":9.772131064288445,"defenderHealth":91},{"attacker":{"id":0,"position":0},"defender":{"id":1,"position":2},"damage":9.639313302645022,"defenderHealth":91},{"attacker":{"id":0,"position":1},"defender":{"id":1,"position":0},"damage":9.206152604338044,"defenderHealth":82},{"attacker":{"id":1,"position":1},"defender":{"id":0,"position":1},"damage":9.210204284026208,"defenderHealth":82},{"attacker":{"id":1,"position":2},"defender":{"id":0,"position":2},"damage":8.932462905388546,"defenderHealth":92}]');

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

  game.handleTick(mockTickData);

  function gameloop(timestamp) {
    lastTimestamp = nextTimestamp;
    nextTimestamp = timestamp;

    game.update((nextTimestamp - lastTimestamp) / 1000);
    game.draw(ctx);

    requestAnimationFrame(gameloop);
  }

  requestAnimationFrame(gameloop);
}, 800);
