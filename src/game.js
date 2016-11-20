var game = new Phaser.Game(800, 600, Phaser.AUTO, '');
 
game.state.add('play', {
  preload: function() {
    game.load.image('egg', 'assets/egg_0.png');
  },
  create: function() {
    var eggSprite = game.add.sprite(450, 290, 'egg');
    skeletonSprite.anchor.setTo(0.5, 0.5);
  },
  render: function() {
    game.debug.text('Adventure Awaits!', 250, 290);
  }
});
 
game.state.start('play');