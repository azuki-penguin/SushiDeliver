var GAME_CONFIG = {
  'FPS'                   : 30,
  'SPEED'                 : 10,
  'PROBABILITY'           : 1 / 30,
  'STAY_TIME'             : 6,
  'FOODS'                 : ["sushi", "pizza", "chicken"],
  'TIME_LIMIT'            : 90,
  'GAME_WIDTH'            : 720,
  'GAME_HEIGHT'           : 480,
  'CHRISTMAS_TREE_WIDTH'  : 155,
  'CHRISTMAS_TREE_HEIGHT' : 200,
  'BALLOON_WIDTH'         : 60,
  'BALLOON_HEIGHT'        : 60,
  'PIZZA_DESIRE_WIDTH'    : 40,
  'PIZZA_DESIRE_HEIGHT'   : 40,
  'SUSHI_DESIRE_WIDTH'    : 40,
  'SUSHI_DESIRE_HEIGHT'   : 30,
  'CHICKEN_DESIRE_WIDTH'  : 35,
  'CHICKEN_DESIRE_HEIGHT' : 40,
  'SUSHI_WIDTH'           : 20,
  'SUSHI_HEIGHT'          : 15,
  'COUPLE_WIDTH'          : 60,
  'COUPLE_HEIGHT'         : 60,
  'PIZZA_DESIRE_IMAGE'    : "images/pizza_desire.png",
  'SUSHI_DESIRE_IMAGE'    : "images/sushi_desire.png",
  'CHICKEN_DESIRE_IMAGE'  : "images/chicken_desire.png",
  'SUSHI_IMAGE'           : "images/sushi.png",
  'SUSHI_SPOILED_IMAGE'   : "images/sushi_spoiled.png",
  'COUPLE_DATE_IMAGE'     : "images/couple_date.png",
  'COUPLE_ANGRY_IMAGE'    : "images/kenka_couple.png",
  'COUPLE_HAPPY_IMAGE'    : "images/couple_happy.png",
  'CHRISTMAS_TREE_IMAGE'  : "images/christmas_tree.png",
  'BALLOON_IMAGE'         : "images/fukidashi.png"
};

enchant();

window.onload = function() {
  var score = {
    'total'   : 0,
    'correct' : 0,
    'wrong'   : 0,
    'spoiled' : 0
  };
  
  var game = new Game(GAME_CONFIG.GAME_WIDTH, GAME_CONFIG.GAME_HEIGHT);
  game.rootScene.backgroundColor = "#000000";
  game.fps = GAME_CONFIG.FPS;
  game.preload(
    GAME_CONFIG.SUSHI_IMAGE,
    GAME_CONFIG.SUSHI_SPOILED_IMAGE,
    GAME_CONFIG.COUPLE_DATE_IMAGE,
    GAME_CONFIG.COUPLE_ANGRY_IMAGE,
    GAME_CONFIG.COUPLE_HAPPY_IMAGE,
    GAME_CONFIG.BALLOON_IMAGE,
    GAME_CONFIG.SUSHI_DESIRE_IMAGE,
    GAME_CONFIG.PIZZA_DESIRE_IMAGE,
    GAME_CONFIG.CHICKEN_DESIRE_IMAGE,
    GAME_CONFIG.CHRISTMAS_TREE_IMAGE
  );

  game.onload = function() {
    this.pushScene(generateInitialScene());
  }
  game.start();
  
  /* create foundataion scene */
  function generateBaseScene() {
    var scene = new Scene();
    
    var tree = new Sprite(GAME_CONFIG.CHRISTMAS_TREE_WIDTH, GAME_CONFIG.CHRISTMAS_TREE_HEIGHT);
    tree.image = game.assets[GAME_CONFIG.CHRISTMAS_TREE_IMAGE];
    tree.opacity = 0.35;
    tree.moveTo((game.width - tree.width) / 2, (game.height - tree.height) / 2);
    
    scene.addChild(tree);
    scene.backgroundColor = "#383838";
    return scene;
  }

  /* create start scene */
  function generateInitialScene() {
    console.log("init");
    
    var scene = generateBaseScene();

    // guidance label
    var label = new Label("スペースキーを押してスタート");
    label.width = game.width;
    label.font = "bold 32pt monospace";
    label.color = "#ffffff";
    var x = scene.width / 2 - label._boundWidth / 2;
    var y = scene.height / 4 - label._boundHeight / 2;
    label.moveTo(x, y);
    
    // description label
    var descriptLabel = new Label('カップルに "Sushi" を届けよう<br>');
    descriptLabel.text += 'カップルがデートで、ここクリスマスツリー広場にやってきます。<br>';
    descriptLabel.text += 'カップルが食べたいものを連想します。<br>';
    descriptLabel.text += '"Sushi" を食べたがっているカップルに、届けてあげましょう。<br>';
    descriptLabel.text += '"Sushi" を食べたがっているカップルに届ければ、そのカップルは結ばれます。<br>';
    descriptLabel.text += '逆に、違うものを届けると、カップルはケンカ別れしてしまいます。<br>';
    descriptLabel.text += '上に表示される "Sushi" を"←"キーと"→"キーで操作し<br>';
    descriptLabel.text += 'スペースキーで "Sushi" を発射します。<br>';
    descriptLabel.text += '制限時間は' + GAME_CONFIG.TIME_LIMIT + '秒です。<br>';
    descriptLabel.text += '頑張って恋のキューピットになりましょう。<br>';
    descriptLabel.text += 'くれぐれも "Sushi" を粗末に扱わないように';
    descriptLabel.width = game.width - 40;
    descriptLabel.font = "bold 13pt monospace";
    descriptLabel.color = "#ffffff";
    x = scene.width / 2 - descriptLabel._boundWidth / 2;
    y = scene.height  * 3 / 4 - descriptLabel._boundHeight / 2;
    descriptLabel.moveTo(x, y);

    game.keybind(32, "space");
    game.addEventListener("spacebuttondown", function() {
      // free objects before scene change
      scene.removeChild(label);
      scene.removeChild(descriptLabel);
      label = null;
      descriptLabel = null;
      
      game.clearEventListener("spacebuttondown");
      game.replaceScene(generateCountdownScene());
    });

    scene.addChild(label);
    scene.addChild(descriptLabel);
    return scene;
  }

  /* create countdown scene */
  function generateCountdownScene() {
    console.log("countdown");

    var scene = generateBaseScene();
    scene.startFrame = game.frame;

    /* create countdown label */
    var COUNT = 3;
    var countLabel = new Label(COUNT);
    countLabel.font = "bold 48pt monospace";
    countLabel.color = "#ffffff";
    var x = scene.width / 2 - countLabel._boundWidth / 2;
    var y = scene.height / 2 - countLabel._boundHeight / 2;
    countLabel.moveTo(x, y);
    scene.addChild(countLabel);

    scene.addEventListener(enchant.Event.ENTER_FRAME, function() {
      var remain = COUNT - Math.floor((game.frame - scene.startFrame) / game.fps);
      if(remain > 0) {
        // decrement remaining
        countLabel.text = remain;
      } else {
        // free objects before scene change
        scene.removeChild(countLabel);
        countLabel = null;
        
        // start game
        game.replaceScene(generatePlayScene());
        // return;
      }
    });

    return scene;
  }

  /* create game scene */
  function generatePlayScene() {
    console.log("play");

    var couples = [];
    var scene = generateBaseScene();
    scene.startFrame = game.frame;

    // create timer label
    var timerLabel = new Label(GAME_CONFIG.TIME_LIMIT + "s remaining");
    timerLabel.font = "bold 13pt monospace";
    timerLabel.color = "#ffff00";
    timerLabel.moveTo(game.width - timerLabel._boundWidth, 5);
    scene.addChild(timerLabel);
    
    // create score label
    var scoreLabel = new Label("SCORE: " + score.total);
    scoreLabel.font = "bold 13pt monospace";
    scoreLabel.color = "#ffffff";
    scoreLabel.moveTo(5, 5);
    scene.addChild(scoreLabel);

    // countdown
    game.addEventListener(enchant.Event.ENTER_FRAME, function() {
      var progress = Math.floor((game.frame - scene.startFrame) / game.fps);
      timerLabel.text = GAME_CONFIG.TIME_LIMIT - progress + "s remaining";

      if(GAME_CONFIG.TIME_LIMIT - progress < 0) {
        // free objects
        scene.removeChild(sushiFactory);
        scene.removeChild(timerLabel);
        scene.removeChild(scoreLabel);
        sushiFactory.clearEventListener(enchant.Event.ENTER_FRAME);
        sushiFactory = null;
        timerLabel = null;
        scoreLabel = null;
        
        // game over transition
        game.clearEventListener(enchant.Event.ENTER_FRAME);
        game.clearEventListener("spacebuttondown");
        game.replaceScene(generateEndScene());
      }
    });

    // create sushi generator
    var sushiFactory = new Sprite(GAME_CONFIG.SUSHI_WIDTH, GAME_CONFIG.SUSHI_HEIGHT);
    sushiFactory.moveTo((game.width - sushiFactory.width) / 2, 30);
    sushiFactory.image = game.assets[GAME_CONFIG.SUSHI_IMAGE];
    scene.addChild(sushiFactory);
 
    // definition of sushi generator action
    sushiFactory.addEventListener(enchant.Event.ENTER_FRAME, function() {
      if(game.input.left) {
        sushiFactory.x -= GAME_CONFIG.SPEED;
        if(sushiFactory.x < 0) {
          sushiFactory.x = 0;
        }
      }

      if(game.input.right) {
        sushiFactory.x += GAME_CONFIG.SPEED;
        if(sushiFactory.x > game.width - sushiFactory.width) {
          sushiFactory.x = game.width - sushiFactory.width;
        }
      }
    });

    // shower sushi
    game.keybind(32, "space");
    game.addEventListener("spacebuttondown", function() {
      var sushi = new Sprite(GAME_CONFIG.SUSHI_WIDTH, GAME_CONFIG.SUSHI_HEIGHT);
      sushi.moveTo(sushiFactory.x, sushiFactory.y);
      sushi.image = game.assets[GAME_CONFIG.SUSHI_IMAGE];
      sushi.spoiled = false;
      scene.addChild(sushi);

      sushi.addEventListener(enchant.Event.ENTER_FRAME, function() {
        if(sushi.spoiled) {
          // remove spoiled sushi if expire passed
          var progress = (game.frame - sushi.landingFrame) / game.fps;
          if(progress > GAME_CONFIG.STAY_TIME) {
            scene.removeChild(sushi);
            sushi.clearEventListener(enchant.Event.ENTER_FRAME);
            sushi = null;
          }
        } else {
          sushi.y += GAME_CONFIG.SPEED;

          // remove sushi and couple if collision
          for(var i = 0; i < couples.length; i++) {
            if(couples[i] == null) {
              continue;
            }
            
            if(sushi.intersect(couples[i])) {
              // remove sushi if sushi touched couples
              scene.removeChild(sushi);
              sushi.clearEventListener(enchant.Event.ENTER_FRAME);
              sushi = null;
              
              if(!couples[i].changedFrame) {
                couples[i].changedFrame = game.frame;
                if(couples[i].emotion == "desire") {
                  // remove desire image
                  scene.removeChild(foods[i]);
                  scene.removeChild(balloons[i]);
                  foods[i] = null;
                  balloons[i] = null;
                  
                  if(couples[i].desire == "sushi") {
                    // correct delivery
                    couples[i].image = game.assets[GAME_CONFIG.COUPLE_HAPPY_IMAGE];
                    score.correct++;
                    score.total += 10;
                  } else {
                    // wrong delivery
                    couples[i].image = game.assets[GAME_CONFIG.COUPLE_ANGRY_IMAGE];
                    score.wrong++;
                    score.total -= 5;
                  }
                  scoreLabel.text = "SCORE: " + score.total;
                } else {
                  // remove couples if couples does not have desire
                  couples[i].clearEventListener(enchant.Event.ENTER_FRAME);
                  scene.removeChild(couples[i]);
                }
              }

              couples[i].addEventListener(enchant.Event.ENTER_FRAME, function() {
                if((game.frame - this.changedFrame) / game.fps > 2) {
                  scene.removeChild(this);
                  this.clearEventListener(enchant.Event.ENTER_FRAME);
                  couples[i] = null;
                  
                  // game.clearEventListener("spacebuttondown");
                  // return;
                }
              });

              return;
            }
          }

          if(sushi.y > game.height - sushi.height) {
            // spoiled delivery
            sushi.y = game.height - sushi.height;
            sushi.image = game.assets[GAME_CONFIG.SUSHI_SPOILED_IMAGE];
            sushi.spoiled = true;
            sushi.landingFrame = game.frame;
            
            score.spoiled++;
          }
        }
      });
    });

    // generate couple manager arrary
    var couples = new Array(Math.floor(GAME_CONFIG.GAME_WIDTH / GAME_CONFIG.COUPLE_WIDTH));
    for(var i = 0; i < couples.length; i++) {
      couples[i] = null;
    }
    // generate balloon manager array
    var balloons = new Array(couples.length);
    for(var i = 0; i < balloons.length; i++) {
      balloons[i] = null;
    }
    // generate food manager array
    var foods = new Array(couples.length);
    for(var i = 0; i < foods.length; i++) {
      foods[i] = null;
    }
    
    scene.addEventListener(enchant.Event.ENTER_FRAME, function() {
      // create couple randomly
      if(Math.random() < GAME_CONFIG.PROBABILITY) {
        var index = Math.floor(Math.random() * couples.length);
        if(couples[index] == null) {
          var couple = new Sprite(GAME_CONFIG.COUPLE_WIDTH, GAME_CONFIG.COUPLE_HEIGHT);
          couple.moveTo(couple.width * index, game.height - couple.height);
          couple.image = game.assets[GAME_CONFIG.COUPLE_DATE_IMAGE];
          // couple.backgroundColor = "#3d3d3d";
          couple.emotion = "none";
          couple.arrTime = game.frame;
          couple.desire = GAME_CONFIG.FOODS[Math.floor(Math.random() * GAME_CONFIG.FOODS.length)];
          couple.aliveTime = GAME_CONFIG.STAY_TIME + Math.floor(Math.random() * 5);
          
          couple.addEventListener(enchant.Event.ENTER_FRAME, function() {
            if(couple.emotion == "none" && (game.frame - couple.arrTime) / game.fps > 1) {
              // add desire balloon and desire food image
              var balloon = new Sprite(GAME_CONFIG.BALLOON_WIDTH, GAME_CONFIG.BALLOON_HEIGHT);
              balloon.image = game.assets[GAME_CONFIG.BALLOON_IMAGE];
              balloon.moveTo(couple.x, couple.y - balloon.height);
              var food;
              switch(couple.desire) {
                case GAME_CONFIG.FOODS[0]:
                  food = new Sprite(GAME_CONFIG.SUSHI_DESIRE_WIDTH, GAME_CONFIG.SUSHI_DESIRE_HEIGHT);
                  food.image = game.assets[GAME_CONFIG.SUSHI_DESIRE_IMAGE];
                  break;
                case GAME_CONFIG.FOODS[1]:
                  food = new Sprite(GAME_CONFIG.PIZZA_DESIRE_WIDTH, GAME_CONFIG.PIZZA_DESIRE_HEIGHT);
                  food.image = game.assets[GAME_CONFIG.PIZZA_DESIRE_IMAGE];
                  break;
                case GAME_CONFIG.FOODS[2]:
                  food = new Sprite(GAME_CONFIG.CHICKEN_DESIRE_WIDTH, GAME_CONFIG.CHICKEN_DESIRE_HEIGHT);
                  food.image = game.assets[GAME_CONFIG.CHICKEN_DESIRE_IMAGE];
                  break;
              }
              food.moveTo(balloon.x + 13, balloon.y + 10);
              
              
              scene.addChild(balloon);
              scene.addChild(food);
              balloons[index] = balloon;
              foods[index] = food;
              couple.emotion = "desire";              
            }
          });
          
          scene.addChild(couple);
          couples[index] = couple;
        }
      }

      // check whether couples leave
      for(var i = 0; i < couples.length; i++) {
        if(couples[i] != null) {
          var stayingTime = (game.frame - couples[i].arrTime) / game.fps;
          if(stayingTime > couples[i].aliveTime) {
            scene.removeChild(foods[i]);
            scene.removeChild(balloons[i]);
            scene.removeChild(couples[i]);
            
            foods[i] = null;
            balloons[i] = null;
            couples[i].clearEventListener(enchant.Event.ENTER_FRAME);
            couples[i] = null;
          }
        }
      }
    });

    // scene.backgroundColor = "#c8e0ff";
    return scene;
  }

  function generateEndScene() {
      console.log("end");

    var scene = generateBaseScene();
    
    // judge title and set message
    var title = "Game Player";
    var message = "一般プレイヤー";
    if(score.correct + score.wrong + score.spoiled == 0) {
      title = "Lazy or Observer?";
      message = "あなた、ナマケモノのフレンズか傍観者でしょ?";
    } else if(score.spoiled > (score.correct + score.wrong) * 2) {
      title = "Sushi Spoiler";
      message = "食べ物を粗末にしてはいけません";
    } else if(score.correct + score.wrong > 6) {
      if(score.wrong > score.correct * 3) {
        title = "Couple Destroyer";
        message = "リア充は爆発";
      } else if(score.correct  > score.wrong * 3) {
        title = "Angel";
        message = "恋のキューピット、ここに降臨";
      } 
    }
    
    
    // score label
    var resultLabel = new Label("SCORE: " + score.total);
    resultLabel.font = "bold 36pt monospace";
    resultLabel.color = "#ffffff";
    var x = scene.width / 2 - resultLabel._boundWidth / 2;
    var y = scene.height / 4 - resultLabel._boundHeight / 2;
    resultLabel.moveTo(x, y);

    // title label
    var titleLabel = new Label(title);
    titleLabel.width = game.width;
    titleLabel.font = "bold 48pt monospace";
    titleLabel.color = "#ffff00";
    x = scene.width / 2 - titleLabel._boundWidth / 2;
    y = scene.height / 2 - titleLabel._boundHeight / 2;
    titleLabel.moveTo(x, y);
    
    // message label
    var messageLabel = new Label(message);
    messageLabel.text += "<br><br>スペースキーを押して再挑戦";
    messageLabel.width = game.width;
    messageLabel.font = "bold 24pt monospace";
    messageLabel.color = "#ffffff";
    x = scene.width / 2 - messageLabel._boundWidth / 2;
    y = scene.height * 3 / 4 - messageLabel._boundHeight / 2;
    messageLabel.moveTo(x, y);
    
    // credit label
    var creditLabel = new Label("イラスト: いらすとや 様");
    creditLabel.width = game.width / 2;
    creditLabel.font = "bold 18pt monospace";
    creditLabel.color = "#ffffff";
    creditLabel.moveTo(game.width - creditLabel._boundWidth - 30, game.height - creditLabel._boundHeight - 30);

    scene.addChild(resultLabel);
    scene.addChild(titleLabel);
    scene.addChild(messageLabel);
    scene.addChild(creditLabel);
    
    // retry
    game.keybind(32, "space");
    game.addEventListener("spacebuttondown", function() {
      // free objects before scene change
      scene.removeChild(resultLabel);
      scene.removeChild(titleLabel);
      scene.removeChild(messageLabel);
      scene.removeChild(creditLabel);
      resultLabel = null;
      titleLabel = null;
      messageLabel = null;
      creditLabel = null;
      
      game.clearEventListener("spacebuttondown");
      game.replaceScene(generateCountdownScene());
    });

    return scene;
  }
}
