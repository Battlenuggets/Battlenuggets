// creates a projectile that moves from `(x0, y0)` to `(x1, y1)`
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
  if (this.completed) return;

  if (!this.completed && this.elapsed > this.duration) {
    this.completed = true;

    if (this.completedCallback) {
      this.completedCallback();
    }

    return;
  }

  this.elapsed += dt;

  this.x += (dt / this.duration) * this.dx;
  this.y += (dt / this.duration) * this.dy;
};

Projectile.prototype.draw = function (ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);

  ctx.fillStyle = 'red';
  ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);

  ctx.restore();
};

