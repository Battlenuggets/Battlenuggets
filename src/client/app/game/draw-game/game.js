function Game (w, h) {
  this.w = w;
  this.h = h;

  // load nugget image
  this.nuggetImg = new Image();
  this.nuggetImg.src = '/img/battlenugget.png';
}

Game.prototype.createNuggets = function (fighters) {
  this.nuggets = fighters.map(function (fighter) {
    // compute where to draw the nugget based on its team data
    var w = 40;
    var h = 40;
    var x = fighter.team.id === 0 ? 50 : this.w - 50 - w;
    var y = 30 + fighter.team.position * 60;

    return new Nugget(x, y, w, h, this.nuggetImg, fighter.combat);
  }.bind(this));
}

Game.prototype.draw = function (ctx) {
  this.nuggets.forEach(function (nugget) {
    nugget.draw(ctx);
  })
};

Game.prototype.update = function () {

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

