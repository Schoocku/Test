function setup() {
  backgroundCanvas = new BackgroundCanvas();
  createCanvas(backgroundCanvas.width, backgroundCanvas.height);
  testMap = new TestMap();
  ball = new Ball(testMap.ballStartPosition.x, testMap.ballStartPosition.y);

  peer = new Peer();
  peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
  });
}

function draw() {
  background(backgroundCanvas.color);
  testMap.draw();
  calculatePositions();
  ball.draw();
}

function calculatePositions() {
  ball.calculateNextPosition();
  backgroundCanvas.checkCollision(ball);
  testMap.checkCollision(ball);
  ball.applyFriction(backgroundCanvas.friction);
}

function mouseClicked() {
  ball.startMoving(mouseX, mouseY);
}
