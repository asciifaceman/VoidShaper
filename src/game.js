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

// UI Classes
function PanelText(game, x, y, panelGroup, size) {
  this.game = game;
  this.x = x;
  this.y = y;
  this.group = panelGroup;

  this.styleTitle = { font: size + "px Courier", fill: "#fff", tabs: 80 };
  this.textObj = this.group.addChild(this.game.add.text(this.x, this.y, "", this.styleTitle));
  this.updateText = function(text) {
    this.textObj.text = text;
  };
}

function ProgressBar(game, x, y, panelGroup, bgGraphic, fgGraphic) {
  this.game = game;
  this.x = x;
  this.y = y;
  this.group = panelGroup;
  this.bgGraphic = bgGraphic;
  this.fgGraphic = fgGraphic;
  this.rect = null;

  this.barBg = this.group.addChild(this.game.add.image(this.x, this.y, this.bgGraphic));
  if (this.bgGraphic == 'barBack' || this.bgGraphic == 'barFront') {
    this.barBg.scale.setTo(0.75, 0.75);
  }
  this.barFg = this.group.addChild(this.game.add.image(this.x+4, this.y+4, this.fgGraphic));
  this.fullWidth = this.barFg.width;
  if (this.fgGraphic == 'barBack' || this.fgGraphic == 'barFront') {
    this.barFg.scale.setTo(0.75, 0.75);
  }


  this.init = function () {
    this.rect = new Phaser.Rectangle(0, 0, 0, this.barFg.height);
    //this.barFg.crop(this.rect);
  }
  this.update = function (now, max) {
    this.rect.width = Math.max(0, (now / max) * this.fullWidth);
    console.log(this.rect.width);
    this.barFg.crop(this.rect);
  }
}

function Panel (game, x, y, title, size) {
  this.game = game;
  this.x = x;
  this.y = y;
  this.title = title;
  this.size = size;
  this.styleTitle = { font: "16px Courier", fill: "#fff", tabs: 80 };
  this.panelBody = null;
  this.panelHead = null;
  this.panelGroup = null;
  this.spawn = function () {
    this.panelGroup = this.game.add.group();
    this.panelGroup.position.setTo(this.x, this.y);
    this.panelBody = this.panelGroup.addChild(this.game.add.image(0, 0, this.game.cache.getBitmapData(this.size)));    
    this.panelHead = this.panelGroup.addChild(this.game.add.image(0, 0, this.game.cache.getBitmapData('panelHead')));
    this.panelHead.alpha = 0.8;
    this.titleHead = this.panelGroup.addChild(this.game.add.text(5, 5, this.title, this.styleTitle));
  };

};

game.state.add('play', {
  preload: function() {

    game.load.image('itembg', 'assets/itemBackground.png');
    game.load.spritesheet('button', 'assets/buttonsheet300x87x3.png', 300, 87);
    game.load.image('barFront', 'assets/barInterior.png');
    game.load.image('barBack', 'assets/barExterior.png');

    // Panels

    // Tall panel
    var panelTall = this.game.add.bitmapData(250, 500);
    panelTall.ctx.fillStyle = '#5a6772';
    panelTall.ctx.strokeStyle = '#31363a';
    panelTall.ctx.lineWidth = 5;
    panelTall.ctx.fillRect(0, 0, 250, 500);
    panelTall.ctx.strokeRect(0, 0, 250, 500);
    this.game.cache.addBitmapData('panelTall', panelTall);    

    // Medium panel
    var panelMedium = this.game.add.bitmapData(250, 400);
    panelMedium.ctx.fillStyle = '#5a6772';
    panelMedium.ctx.strokeStyle = '#31363a';
    panelMedium.ctx.lineWidth = 5;
    panelMedium.ctx.fillRect(0, 0, 250, 400);
    panelMedium.ctx.strokeRect(0, 0, 250, 400);
    this.game.cache.addBitmapData('panelMedium', panelMedium);

    // Short panel
    var panelShort = this.game.add.bitmapData(250, 100);
    panelShort.ctx.fillStyle = '#5a6772';
    panelShort.ctx.strokeStyle = '#31363a';
    panelShort.ctx.lineWidth = 5;
    panelShort.ctx.fillRect(0, 0, 250, 100);
    panelShort.ctx.strokeRect(0, 0, 250, 100);
    this.game.cache.addBitmapData('panelShort', panelShort);

    // Panel header
    var panelHead = this.game.add.bitmapData(250, 30);
    panelHead.ctx.fillStyle = '#282c33';
    panelHead.ctx.strokeStyle = '#31363a';
    panelHead.ctx.lineWidth = 5;
    panelHead.ctx.fillRect(0, 0, 250, 30);
    this.game.cache.addBitmapData('panelHead', panelHead);

    var panelItem = this.game.add.bitmapData(225, 40);
    panelItem.ctx.strokeStyle = '#31363a';
    panelItem.ctx.lineWidth = 5;
    //panelItem.ctx.fillRect(0, 0, 200, 40);
    panelItem.ctx.strokeRect(0, 0, 225, 40);
    this.game.cache.addBitmapData('panelItem', panelItem);
  
  },

  click: function() {
    console.log("Clicked");
  },

  create: function() { // Phaser creation phase
    var state = this;
    this.init();

    // Player Panel
    this.playerPanel = new Panel(this.game, 25, 25, this.player.name, "panelShort");
    this.playerPanel.spawn();

    this.playerPanelText = {
      LevelText: new PanelText(this.game, 10, 35, this.playerPanel.panelGroup, 12),
      RankText: new PanelText(this.game, 10, 50, this.playerPanel.panelGroup, 12),
      EggText: new PanelText(this.game, 10, 65, this.playerPanel.panelGroup, 12),
    }

    // Player egg progress bar
    this.eggProgBar = new ProgressBar(this.game, this.playerPanelText.EggText.x + 140, this.playerPanelText.EggText.y, this.playerPanel.panelGroup, 'barBack', 'barFront');
    this.eggProgBar.init();

    // Stable Panel
    this.stablePanel = new Panel(this.game, 25, 140, "Stable", "panelMedium");
    this.stablePanel.spawn();

    // OK! Let's start the game!
    this.RunTime = this.game.time.events.loop(this.system.interval, this.GameLoop, this);
  }, 
  init: function() { 
    // Things that must happen only once
    // BEFORE CREATE
    game.stage.disableVisibilityChange = true;

    this.grow = 0;
    this.system = {
      interval: 100,
      version: 0.1,
    }

    // Ranks
    this.ranks = ["Initiate", "Apprentice", "Adept", "Graduate", "Master", "Grand Master"];

    // Player Object
    this.player = {
      name: "Player Name",
      level: 1,
      rank: 0,
      eggs: 0,
      eggProgress: 0,
      eggProgressMax: 100,
    };

    // Genistars
    this.genistars = {
      pool: {
        def: {type: 'Default', count: 1, shaping: false, shaped: 0},
        mou: {type: 'ge-mouse', count: 0, shaping: false, shaped: 0},
      }
    };

  },
  render: function() {

  },
  updateText: function() { // Every GameLoop update dynamic text
    this.playerPanelText.RankText.updateText("Rank: " + this.ranks[this.player.rank]);
    this.playerPanelText.LevelText.updateText("Lvl: " + this.player.level);
    this.playerPanelText.EggText.updateText("Eggs: " + this.player.eggs);
  },
  growEggs: function(intervalsPassed=1) {
    for (var i = 1; i <= intervalsPassed; i++) {
      this.player.eggProgress++;
      //this.eggProgBar.update();
      if (this.player.eggProgress >= this.player.eggProgressMax) {
        this.player.eggs += 1 * this.genistars.pool.def.count;
        this.player.eggProgress = 0;
        //this.eggProgBar.update();        
      }
    }
  },
  GameLoop: function() {

    this.updateText();
    this.growEggs();
    this.eggProgBar.update(this.player.eggProgress, this.player.eggProgressMax);
  }
});

game.state.start('play');