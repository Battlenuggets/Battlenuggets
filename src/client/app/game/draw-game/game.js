function Game (w, h) {
  this.w = w;
  this.h = h;

  // load nugget images
  this.leftImg = new Image();
  this.leftImg.src = '/img/battlenugget.png';
  this.rightImg = new Image();
  this.rightImg.src = '/img/goldnugget.png';
  this.deadLeftImg = new Image();
  this.deadLeftImg.src = '/img/deadnugget.png';
  this.deadRightImg = new Image();
  this.deadRightImg.src = '/img/deadgoldnugget.png';

  this.nuggets = [];
  this.projectiles = [];

  this.inBattle = true;
}

Game.prototype.startBattle = function (data) {
  this.inBattle = true;
  this.createNuggets(data.fighters);
};

// this isn't doing anything right now
Game.prototype.endBattle = function (data) {
  this.inBattle = false;
  this.winningTeamId = data.winningTeamId;
};

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

// this could be obsoleted by storing `this.fighters` more intelligently
Game.prototype.findNuggetByTeamData = function (target) {
  var team;

  for (var i = 0; i < this.nuggets.length; i++) {
    team = this.nuggets[i].team;
    if (team.id === target.id && team.position === target.position) {
      return this.nuggets[i];
    }
  }
};

// create nugget instances based on raw fighter data from server
Game.prototype.createNuggets = function (fighters) {
  this.nuggets = fighters.map(function (fighter) {
    var dims = this.getFighterDimensions(fighter.team);
    var img = fighter.team.id === 0 ? this.leftImg : this.rightImg;
    var deadImg = fighter.team.id === 0 ? this.deadLeftImg : this.deadRightImg;

    return new Nugget(
      dims.x,
      dims.y,
      dims.w,
      dims.h,
      img,
      deadImg,
      fighter.team,
      fighter.combat
    );
  }.bind(this));
};

Game.prototype.tick = function (tickData) {
  var self = this;

  tickData.forEach(function (attackData, index) {
    setTimeout(function () {
      self.startAttack(attackData);
    }, index * 40);
  });
};

Game.prototype.startAttack = function (attackData) {
  var attackerTeamData = attackData.attacker;
  var defenderTeamData = attackData.defender;
  var defenderHealth = attackData.defenderHealth;

  var attacker = this.findNuggetByTeamData(attackerTeamData);
  var defender = this.findNuggetByTeamData(defenderTeamData);

  var x0 = attacker.cx;
  var y0 = attacker.cy;
  var x1 = defender.cx;
  var y1 = defender.cy;

  // send a projectile from the attacker to the defender
  var projectile = new Projectile(x0, y0, x1, y1, .3);

  projectile.onComplete(function () {
    // remove the projectile once it reaches its target
    this.removeProjectile(projectile);

    // set the defender's health to its new, lower, value
    var defender = this.findNuggetByTeamData(defenderTeamData);
    defender.combat.health = defenderHealth;
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
