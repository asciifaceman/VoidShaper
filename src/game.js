var game = new Phaser.Game(800, 600, Phaser.AUTO, '');
 
game.state.add('play', {
  preload: function() {
    // System
    game.load.spritesheet('timer', 'assets/timer/timer.png', 150, 20);
    
    // Other
    game.load.image('egg', 'assets/egg_0.png');
    game.load.image('bg', 'assets/shaping.png');

    // Panel build
    var bmd = this.game.add.bitmapData(250, 500);
    bmd.ctx.fillStyle = '#9a783d';
    bmd.ctx.strokeStyle = '#35371c';
    bmd.ctx.lineWidth = 12;
    bmd.ctx.fillRect(0, 0, 200, 500);
    bmd.ctx.strokeRect(0, 0, 200, 500);
    this.game.cache.addBitmapData('upgradePanel', bmd);    

    game.stage.disableVisibilityChange = true;

    // Main player data
    this.player = {
      gold: 0
    }
    this.system = {
      interval: 100,
      version: 0.1,
    }
    this.genistars = {
      egg: ["Eggs", 0, 0, 0], // 0name, 1owned, 2shaping, 3value
      def: ["Default", 1, 0, 0],
    }
    this.lastUpdate = new Date().getTime();
    if(!localStorage.getItem("lastUpdate")) localStorage.setItem('lastUpdate', new Date().getTime());
  },
  create: function() {
    var state = this;
    
    this.background = this.game.add.group();
    ['bg' ]
    .forEach(function(image) {
      var bg = state.game.add.tileSprite(0, 0, state.game.world.width, 
        state.game.world.height, image, '', state.background);
      bg.tileScale.setTo(1,1);
    });
    this.titleLabel = this.background.addChild(this.game.add.text(this.background.width-190, this.background.height-40, "Void Shaper v" + this.system.version, {
      font: '20px Arial Black',
      //fill: '#868686',
      fill: '#fff',
      strokeThickness: 4
    }));

    // Stable panel
    this.upgradePanel = this.game.add.image(10, 50, this.game.cache.getBitmapData('upgradePanel'));

    // Stable data
    this.stableinfoUI = this.game.add.group();
    this.stableinfoUI.position.setTo(this.upgradePanel.x, this.upgradePanel.y);
    this.stableTopText = this.stableinfoUI.addChild(this.game.add.text(15, 10, "Stable", {
      font: '28px Arial Black',
      //fill: '#868686',
      fill: '#fff',
      strokeThickness: 4
    }));
    this.defaultLabel = this.stableinfoUI.addChild(this.game.add.text(15, 50, this.genistars['def'][0] + ": " + this.genistars['def'][1], {
      font: '16px Arial Black',
      //fill: '#868686',
      fill: '#fff',
      strokeThickness: 4
    }));
    //this.eggsLayLabel = this.stableinfoUI.addChild(this.game.add.text(15, 70, "New Egg: " + this.genistars['egg'][2] + "%", {
    //  font: '16px Arial Black',
      //fill: '#868686',
    //  fill: '#fff',
    //  strokeThickness: 4
    //}));
    this.eggLayBarBack = this.stableinfoUI.addChild(this.game.add.sprite(15, 70, 'timer', 1));
    this.eggLayBarFront = this.stableinfoUI.addChild(this.game.add.sprite(15, 70, 'timer', 0));
    this.fullWidth = this.eggLayBarFront.width;
    this.initBar();

    this.eggsLabel = this.stableinfoUI.addChild(this.game.add.text(15, 90, "Eggs: " + this.genistars['egg'][1], {
      font: '16px Arial Black',
      //fill: '#868686',
      fill: '#fff',
      strokeThickness: 4
    }));
    //var eggSprite = game.add.sprite(580, 280, 'egg');
    //eggSprite.anchor.setTo(0.5, 0.5);
   
    // 100ms 10x a second
    this.GameLoop = this.game.time.events.loop(this.system.interval, this.GameLoop, this);

  },
  initBar: function() {
    this.rect = new Phaser.Rectangle(0, 0, 0, this.eggLayBarFront.height);
    this.eggLayBarFront.crop(this.rect);
  },
  updateText: function() {
    this.eggsLabel.text = this.genistars['egg'][0] + ": " + this.genistars['egg'][1];
    //this.eggsLayLabel.text = "New Egg: " + this.genistars['egg'][2] + "%";
    this.defaultLabel.text = this.genistars['def'][0] + ": " + this.genistars['def'][1];
    this.rect.width = Math.max(0, (this.genistars['egg'][2] / 100) * this.fullWidth);
    this.eggLayBarFront.crop(this.rect);
  },
  growEggs: function() {
    // Laying eggs
    this.genistars['egg'][2] += 1;
    if (this.genistars['egg'][2] >= 100) {
      this.genistars['egg'][1] += (this.genistars['def'][1] * 1);
      this.genistars['egg'][2] = 0;
    }

  },
  GameLoop: function() {
    var thisUpdate = new Date().getTime();
    this.diff =  thisUpdate - localStorage.getItem('lastUpdate', new Date().getTime());
    this.intervalsPassed = Math.round(this.diff / this.system.interval);

    // Catcup loop. Usually just one or two
    for (var i = 1; i <= this.intervalsPassed; i++) {
      this.growEggs();
      this.updateText();
    }
    
    localStorage.setItem('lastUpdate', thisUpdate);
  },
  render: function() {
    
  }
});
 
game.state.start('play');