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
  parent: 'phaser',
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

function KeyValueText(game, x, y, panelGroup, size) {
  this.game = game;
  this.x = x;
  this.y = y;
  this.group = panelGroup;

  this.styleTitle = { font: size + "px Courier", fill: "#fff", tabs: 80 };
  this.textObjKey = this.group.addChild(this.game.add.text(this.x, this.y, "", this.styleTitle));
  this.textObjValue = this.group.addChild(this.game.add.text(this.x + 10, this.y, "", this.styleTitle));
  this.updateText = function(key, value) {
    this.textObjKey.text = key;
    this.textObjValue.x = (this.textObjKey.x + this.textObjKey.width + 10);
    this.textObjValue.text = value;
  };
}

function AddButton(game, x, y, panelGroup, name="None") {
  this.game = game;
  this.x = x;
  this.y = y;
  this.group = panelGroup;
  this.name = name;
  this.styleTitle = { font: "10px Courier", fill: "#fff", tabs: 80 };

  this.btn = this.group.addChild(this.game.add.image(this.x, this.y, 'addBtn'));
  this.btn.scale.setTo(0.03, 0.03);
//    // First lets see if we need to pay the troll toll
//    if (this.game.state.states.play.player.eggs >= 1 ) {
//      // We're referencing game directly, this.game is out of date :\
//      this.game.state.states.play.player.eggs--;
//      this.game.state.states.play.genistars.pool[this.name].eggPaid++;
//    }
  this.btn.inputEnabled = true;
  this.btn.events.onInputDown.add(function() { this.Click() }, this);
  this.countObj = this.group.addChild(this.game.add.text(this.x+5, this.y+3, game.state.states.play.genistars.pool[this.name].eggPaid, this.styleTitle))

  this.Click = function () {
    this.game = game;
    // If you are not named, then exit now
    if (this.name == "None") {
      return;
    }
    console.log(game.input.keyboard.createCursorKeys().down.shiftKey);
    if (game.input.keyboard.createCursorKeys().down.shiftkey && game.state.states.play.genistars.pool[this.name].eggPaid >= 1) {
      game.state.states.play.genistars.pool[this.name].eggPaid -= 1;
      game.state.states.play.player.eggs += 1;
    } else {
      // pay for some eggs mang
      if (game.state.states.play.player.eggs >= 1 && game.state.states.play.genistars.pool[this.name].count < game.state.states.play.genistars.pool[this.name].max) {
        game.state.states.play.player.eggs -= 1;
        game.state.states.play.genistars.pool[this.name].eggPaid++;
      }
    }
  }
}

function ProgressBar(game, x, y, panelGroup, bgGraphic, fgGraphic, name="None", counted=false) {
  this.game = game;
  this.x = x;
  this.y = y;
  this.group = panelGroup;
  this.bgGraphic = bgGraphic;
  this.fgGraphic = fgGraphic;
  this.rect = null;
  this.name = name;
  this.counted = counted;
  this.styleTitle = { font: "10px Courier", fill: "#fff", tabs: 80 };

  this.barBg = this.group.addChild(this.game.add.image(this.x, this.y, this.bgGraphic));
  if (this.bgGraphic == 'barBack' || this.bgGraphic == 'barFront') {
    this.barBg.scale.setTo(0.75, 0.75);
  }
  this.barFg = this.group.addChild(this.game.add.image(this.x+4, this.y+4, this.fgGraphic));
  this.fullWidth = this.barFg.width;
  if (this.fgGraphic == 'barBack' || this.fgGraphic == 'barFront') {
    this.barFg.scale.setTo(0.75, 0.75);
  }

  if (this.counted) {
    this.activeObj = this.group.addChild(this.game.add.text(this.x+10, this.y+3, "", this.styleTitle))
  }

  this.barBg.inputEnabled = true;
  this.barBg.events.onInputDown.add(function() { this.Click() }, this);

  this.Click = function () {
    this.game = game;
    // If you are not named, then exit now
    if (this.name == "None") {
      return;
    }

    // Lets switch these states    
    this.game.state.states.play.genistars.pool[this.name].shaping = !this.game.state.states.play.genistars.pool[this.name].shaping;
    
    // this.genistars.pool[key].shaping toggle
  }

  this.init = function () {
    this.rect = new Phaser.Rectangle(0, 0, 0, this.barFg.height);
    //this.barFg.crop(this.rect);
  }
  this.update = function (now, max) {
    this.barFg.x = this.barBg.x + 4;
    this.barFg.y = this.barBg.y + 4;
    this.rect.width = Math.max(0, (now / max) * this.fullWidth);
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
    game.load.spritesheet('button', 'assets/buttons/buttonsheet300x87x3.png', 300, 87);
    game.load.image('barFront', 'assets/progressBar/barInterior.png');
    game.load.image('barBack', 'assets/progressBar/barExterior.png');
    game.load.image('addBtn', 'assets/icons/plus.png');

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
    this.styleTitle = { font: "10px Courier", fill: "#fff", tabs: 80 };
    this.init();

    // System Panel
    //
    this.versionText = this.game.add.text(0, 0, this.system.name + " v" + this.system.version, this.styleTitle)

    // Player Panel
    //
    this.playerPanel = new Panel(this.game, 25, 25, this.player.name, "panelShort");
    this.playerPanel.spawn();

    this.playerPanelText = {
      LevelText: new PanelText(this.game, 10, 35, this.playerPanel.panelGroup, 12),
      GoldText: new PanelText(this.game, 80, 35, this.playerPanel.panelGroup, 12),
      RankText: new PanelText(this.game, 10, 50, this.playerPanel.panelGroup, 12),
      EggText: new PanelText(this.game, 10, 65, this.playerPanel.panelGroup, 12),
    }

    // Player egg progress bar
    this.eggProgBar = new ProgressBar(this.game, this.playerPanelText.EggText.x + 140, this.playerPanelText.EggText.y, this.playerPanel.panelGroup, 'barBack', 'barFront');
    this.eggProgBar.init();

    // Stable Panel
    //
    this.stablePanel = new Panel(this.game, 25, 140, "Stable", "panelMedium");
    this.stablePanel.spawn();

    // Stable Text & prog bars
    var start = {
      x: 10,
      y: 35,
    }
    this.stableText = {};
    this.stableProgBars = {};
    this.stableAddButtons = {};
    for (var key in this.genistars.pool) {
      this.stableAddButtons[key] = new AddButton(this.game, start.x, start.y, this.stablePanel.panelGroup, key);
      this.stableText[key] = new KeyValueText(this.game, start.x+20, start.y, this.stablePanel.panelGroup, 12),
      this.stableProgBars[key] = new ProgressBar(this.game, this.stablePanel.panelGroup.width - 100, start.y, this.stablePanel.panelGroup, 'barBack', 'barFront', key, true);
      this.stableProgBars[key].init();
      start.y += 20;
      
    }

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
      name: "VoidShaper",
      version: 0.1,
    }

    // Ranks
    this.ranks = ["Initiate", "Apprentice", "Adept", "Graduate", "Master", "Grand Master"];

    // Player Object
    this.player = {
      name: "Player Name",
      level: 1, // 5 levels per rank or something
      gold: 0,
      rank: 0,
      eggs: 0,
      eggProgress: 0,
      eggProgressMax: 100,
    };

    // Genistars
    this.genistars = {
      pool: {
        def: {type: 'Default', count: 1, max: 300, shaping: false, shaped: 0, shapedMax: 100, eggPaid: 0},
        mou: {type: 'ge-mouse', count: 0, max: 30, shaping: false, shaped: 0, shapedMax: 100, eggPaid: 0},
        rat: {type: 'ge-rat', count: 0, max: 30, shaping: false, shaped: 0, shapedMax: 100, eggPaid: 0},
        cat: {type: 'ge-cat', count: 0, max: 30, shaping: false, shaped: 0, shapedMax: 100, eggPaid: 0},
        dog: {type: 'ge-dog', count: 0, max: 0, shaping: false, shaped: 0, shapedMax: 100, eggPaid: 0},
        mule: {type: 'ge-mule', count: 0, max: 0, shaping: false, shaped: 0, shapedMax: 100, eggPaid: 0},
        horse: {type: 'ge-horse', count: 0, max: 0, shaping: false, shaped: 0, shapedMax: 100, eggPaid: 0},
        crow: {type: 'ge-crow', count: 0, max: 0, shaping: false, shaped: 0, shapedMax: 100, eggPaid: 0},
      }
    };

  },
  render: function() {

  },
  updateText: function() { // Every GameLoop update dynamic text
    this.playerPanelText.RankText.updateText("Rank: " + this.ranks[this.player.rank]);
    this.playerPanelText.LevelText.updateText("Lvl: " + this.player.level);
    this.playerPanelText.EggText.updateText("Eggs: " + this.player.eggs);
    this.playerPanelText.GoldText.updateText("Gold: " + this.player.gold);

    for (var key in this.genistars.pool) {
      this.stableText[key].updateText(this.genistars.pool[key].type, this.genistars.pool[key].count);
      this.stableProgBars[key].update(this.genistars.pool[key].shaped, this.genistars.pool[key].shapedMax);
      if (this.genistars.pool[key].eggPaid == 0 && this.genistars.pool[key].shaping) {
        this.stableProgBars[key].activeObj.text = "Egg Deficit!";
      } else if (this.genistars.pool[key].eggPaid >= 1 && this.genistars.pool[key].shaping == false) {
        this.stableProgBars[key].activeObj.text = "Egg Surplus!";
      } else {
        this.stableProgBars[key].activeObj.text = "";
      }
      //this.stableProgBars[key].activeObj.text = "Ready!";
      this.stableAddButtons[key].countObj.text = this.genistars.pool[key].eggPaid;
    }
  },
  shapeEggs: function(intervalsPassed=1) {
    for (var i = 1; i <= intervalsPassed; i++) {
      for (var key in this.genistars.pool) {
        if (this.genistars.pool[key].shaping && this.genistars.pool[key].eggPaid >= 1) {
          this.genistars.pool[key].shaped++;
          if (this.genistars.pool[key].shaped >= 100) {
            // Should be a chane of success based on rank
            this.genistars.pool[key].shaped = 0;
            this.genistars.pool[key].count += 1;
            this.genistars.pool[key].eggPaid--;
          }
        }
      }
    }
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
    this.shapeEggs();
    this.growEggs();
    this.eggProgBar.update(this.player.eggProgress, this.player.eggProgressMax);
  }
});

game.state.start('play');
