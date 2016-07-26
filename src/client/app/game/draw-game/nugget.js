function Nugget (x, y, w, h, img, deadImg, team, combat) {
  // coordinates of upper-left hand corner
  this.x = x;
  this.y = y;

  // horizontal knockback
  this.knockback = 0;

  // orientation is 1 if facing left, -1 if facing right
  // this determines which way the nugget is knocked back
  this.orientation = team.id === 0 ? -1 : 1;

  // width and height
  this.w = w;
  this.h = h;

  // coordinates of center
  this.cx = this.x + this.w / 2;
  this.cy = this.y + this.h / 2;

  // the `Image` objects holding the alive and dead pictures
  this.img = img;
  this.deadImg = deadImg;

  // team and combat stats, sent from server
  this.team = team;
  this.combat = combat;

  this.healthBarThickness = 4;
}

Nugget.prototype.isDead = function () {
  return this.combat.health <= 0;
};

// knocks the nugget back by `dx` pixels, up to 15 total
Nugget.prototype.addKnockback = function (dx) {
  if (this.isDead()) return;

  this.knockback = Math.min(15, this.knockback + dx);
};

Nugget.prototype.drawHealthBar = function (ctx) {
  ctx.save();

  var x = 0;
  var y = -1 * (3 + this.healthBarThickness);
  var healthWidth = this.combat.health / this.combat.maxHealth * this.w;

  // outline box
  ctx.strokeStyle = 'black';
  ctx.strokeRect(x, y, this.w, this.healthBarThickness);

  // filled-in health display
  ctx.fillStyle = 'black';
  ctx.fillRect(x, y, healthWidth, this.healthBarThickness);

  ctx.restore();
};

Nugget.prototype.update = function () {
  // if the nugget's knocked back and not dead, inch it back up a little
  if (this.knockback > 0 && !this.isDead()) {
    this.knockback -= 0.75;
  }
};

Nugget.prototype.draw = function (ctx) {
  ctx.save();
  ctx.translate(this.x + this.orientation * this.knockback, this.y);

  if (this.isDead()) {
    ctx.drawImage(this.deadImg, 0, 0, this.w, this.h);
  } else {
    ctx.drawImage(this.img, 0, 0, this.w, this.h);
    this.drawHealthBar(ctx);
  }

  ctx.restore();
};
