function Nugget (x, y, w, h, img, team, combat) {
  // coordinates of upper-left hand corner
  this.x = x;
  this.y = y;

  // width and height
  this.w = w;
  this.h = h;

  // coordinates of center
  this.cx = this.x + this.w / 2;
  this.cy = this.y + this.h / 2;

  this.img = img;

  // team and combat stats, sent from server
  this.team = team;
  this.combat = combat;

  this.healthBarThickness = 4;
}

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

Nugget.prototype.draw = function (ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);

  ctx.drawImage(this.img, 0, 0, this.w, this.h);
  this.drawHealthBar(ctx);

  ctx.restore();
};
