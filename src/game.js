//
// VoidShaper
// Inspired by Peter F Hamilton's void series
//

// Game configuration
var gameConfg = {
  width: 800,
  height: 600,
  renderer: Phaser.AUTO,
  antialias: false,
  transparent: false,
  backgroundColor: '#0076a3',
  //parent: 'phaser-example',
  //scaleMode: Phaser.ScaleManager.EXACT_FIT
}
// Create game object
var game = new Phaser.Game(gameConfg);

game.state.add('play', {
  preload: function() {

    game.load.image('itembg', 'assets/itemBackground.png');
    game.load.spritesheet('button', 'assets/buttonsheet300x87x3.png', 300, 87);
    game.load.image('barFront', 'assets/barInterior.png');
    game.load.image('barBack', 'assets/barExterior.png');

    // A panel experiment
    var panelTest = this.game.add.bitmapData(250, 500);
    panelTest.ctx.fillStyle = '#5a6772';
    panelTest.ctx.strokeStyle = '#31363a';
    panelTest.ctx.lineWidth = 5;
    panelTest.ctx.fillRect(0, 0, 250, 500);
    panelTest.ctx.strokeRect(0, 0, 250, 500);
    this.game.cache.addBitmapData('panel', panelTest);

    var panelTestHead = this.game.add.bitmapData(250, 30);
    panelTestHead.ctx.fillStyle = '#282c33';
    panelTestHead.ctx.strokeStyle = '#31363a';
    panelTestHead.ctx.lineWidth = 5;
    panelTestHead.ctx.fillRect(0, 0, 250, 30);
    this.game.cache.addBitmapData('panelHead', panelTestHead);

    var panelItem = this.game.add.bitmapData(225, 40);
    panelItem.ctx.strokeStyle = '#31363a';
    panelItem.ctx.lineWidth = 5;
    //panelItem.ctx.fillRect(0, 0, 200, 40);
    panelItem.ctx.strokeRect(0, 0, 225, 40);
    this.game.cache.addBitmapData('panelItem', panelItem);

    game.stage.disableVisibilityChange = true;

    this.grow = 0;
    this.system = {
      interval: 100,
      version: 0.1,
    }    
  },

  click: function() {
    console.log("Clicked");
  },

  createStablePanel: function() {
    var state = this;
    var style = { font: "16px Courier", fill: "#fff", tabs: 80 };

    this.stableGroup = this.game.add.group();
    this.stableGroup.position.setTo(25, 50);

    this.stableBody = this.stableGroup.addChild(this.game.add.image(0, 0, this.game.cache.getBitmapData('panel')));
    this.stableHead = this.stableGroup.addChild(this.game.add.image(0, 0, this.game.cache.getBitmapData('panelHead')));
    this.stableHead.alpha = 0.8;

    this.stableHeadText = this.stableGroup.addChild(this.game.add.text(5, 5, "Stable", style));
    //this.stableBodyTest = this.stableGroup.addChild(this.game.add.text(5,30, "Item\tCount\tAction", style));

    //this.item = this.stableGroup.addChild(this.game.add.image(12, 50, this.game.cache.getBitmapData('panelItem')));
    //this.item = this.stableGroup.addChild(this.game.add.sprite(12, 50, 'itembg'));
    //this.itemText = this.stableGroup.addChild(this.game.add.text(20, 60, "Eggs\tcount\tbar", style));

    // Button
    this.button = this.stableGroup.addChild(this.game.add.button(this.stableGroup.width-80, 50, 'button', this.click, this, 2, 2, 1));
    this.button.scale.setTo(0.25, 0.25);
    this.buttonText = this.stableGroup.addChild(this.game.add.text(this.button.x+15, this.button.y+2, "Shape", style));

    // Progress Bar
    this.barBack = this.stableGroup.addChild(this.game.add.image(this.button.left-100, this.button.top+2, 'barBack'));
    this.barBack.scale.setTo(0.75,0.75);
    this.barFront = this.stableGroup.addChild(this.game.add.image(this.button.left-96, this.button.top+6, 'barFront'));
    this.barFullWidth = this.barFront.width;
    this.barFront.scale.setTo(0.75,0.75);

    this.initBar(this.barFront);
    this.RunTime = this.game.time.events.loop(this.system.interval, this.GameLoop, this);
  },

  initBar: function(barObj) {
    this.barRect = new Phaser.Rectangle(0, 0, 0, barObj.height);
    barObj.crop(this.barRect);
  },
  
  create: function() {
    var state = this;
    this.createStablePanel();

    
  },

  render: function() {

  },

  GameLoop: function() {
    this.grow++;
    if (this.grow >= 100) {
      this.grow = 0;
    }
    this.barRect.width = Math.max(0, (this.grow / 100) * this.barFullWidth);
    this.barFront.crop(this.barRect);
  }
});

game.state.start('play');