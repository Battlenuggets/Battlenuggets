// creates a projectile that moves from `(x0, y0)` to `(x1, y1)`.
// the movement takes `duration` seconds
function Projectile (x0, y0, x1, y1, duration) {
  // current position
  this.x = x0;
  this.y = y0;

  // final position
  this.x1 = x1;
  this.y1 = y1;

  // total distance to be moved
  this.dx = x1 - x0;
  this.dy = y1 - y0;

  // total duration and elapsed duration
  this.duration = duration;
  this.elapsed = 0;

  // callback to run when motion is complete
  this.completedCallback = null;
  this.completed = false;

  this.size = 6;
}

Projectile.prototype.onComplete = function (callback) {
  this.completedCallback = callback;
};

Projectile.prototype.update = function (dt) {
  // stop updating once we're finished moving
  if (this.completed) return;

  this.elapsed += dt;

  if (this.elapsed < this.duration) {
    this.x += (dt / this.duration) * this.dx;
    this.y += (dt / this.duration) * this.dy;
  } else {
    this.x = this.x1;
    this.y = this.y1;

    this.completed = true;

    if (this.completedCallback) {
      this.completedCallback();
    }
  }

};

Projectile.prototype.draw = function (ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);

  ctx.fillStyle = 'red';
  ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);

  ctx.restore();
};

