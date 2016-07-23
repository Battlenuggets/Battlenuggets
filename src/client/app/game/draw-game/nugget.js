function Nugget (x, y, w, h, img, combat) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.img = img;
  this.combat = combat;
}

Nugget.prototype.draw = function (ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);

  ctx.drawImage(this.img, 0, 0, this.w, this.h);

  ctx.restore();
};
