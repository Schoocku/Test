function setup() {
  backgroundCanvas = new BackgroundCanvas();
  createCanvas(backgroundCanvas.width, backgroundCanvas.height);
  testMap = new TestMap();
  balls = [
    new Ball(testMap.ballStartPosition.x, testMap.ballStartPosition.y),
    new Ball(150, 350),
    new Ball(170, 350),
    new Ball(400, 230),
    new Ball(650, 150),
    new Ball(170, 270),
  ]
  for (i = 1; i < balls.length; i++) {
    balls[i].isCurrentTurn = false;
    balls[i].color = "#ff0000";
  }

  peer = new Peer();
  peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
  });
}

function draw() {
  background(backgroundCanvas.color);
  testMap.draw();
  calculatePositions();
  balls.forEach((ball, i) => {
    ball.draw();
  });
}

function calculatePositions() {
  collisionsPairs = []
  balls.forEach((target, i) => {
    balls.forEach((ball, i) => {
      if (target != ball) {
        ball.correctBallPositions(target, collisionsPairs);
      }
    });
  });
  collisionsPairs.forEach(function(collisionPair, index, array) {
    collisionPair[0].calculateBallsCollision(collisionPair[1]);
  });
  balls.forEach((ball, i) => {
    ball.calculateNextPosition();
    if (ball.isMoving){
      backgroundCanvas.checkCollision(ball);
      testMap.checkCollision(ball);
    }
    ball.applyFriction(backgroundCanvas.friction);
  });
}

function mouseClicked() {
  balls.forEach((ball, i) => {
      ball.startMoving(mouseX, mouseY);
  });
}
