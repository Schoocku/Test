function setup() {
  backgroundCanvas = new BackgroundCanvas();
  createCanvas(backgroundCanvas.width, backgroundCanvas.height);
  testMap = new TestMap();
  balls = [
    new Ball(testMap.ballStartPosition.x, testMap.ballStartPosition.y),
    new Ball(300, 200)
  ]
  balls[1].isCurrentTurn = false;
  balls[1].color = "#ff0000";

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
  balls.forEach((target, i) => {
    balls.forEach((ball, i) => {
      if (target != ball) {
        ball.correctBallPositions(target);
      }
    });
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
