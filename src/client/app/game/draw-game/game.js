function Game (w, h) {
  this.w = w;
  this.h = h;

  var nuggetImg = new Image();
  nuggetImg.src = '/img/battlenugget.png';

  this.nuggets = [
    new Nugget(20, 10, 30, 30, nuggetImg),
    new Nugget(20, 40, 30, 30, nuggetImg),
    new Nugget(20, 70, 30, 30, nuggetImg),
    new Nugget(20, 100, 30, 30, nuggetImg)
  ];

}

Game.prototype.draw = function (ctx) {
  this.nuggets.forEach(function (nugget) {
    nugget.draw(ctx);
  })
};

Game.prototype.update = function () {

};

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

  function gameloop(timestamp) {
    lastTimestamp = nextTimestamp;
    nextTimestamp = timestamp;

    game.update((nextTimestamp - lastTimestamp) / 1000);
    game.draw(ctx);

    requestAnimationFrame(gameloop);
  }

  requestAnimationFrame(gameloop);
}, 500)

