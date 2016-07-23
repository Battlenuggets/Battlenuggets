var nuggetImg = new Image();
nuggetImg.src = '/img/battlenugget.png';

function Nugget (x, y, w, h, img) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.img = img;
}

Nugget.prototype.draw = function (ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);

  ctx.drawImage(this.img, 0, 0, this.w, this.h);

  ctx.restore();
}
