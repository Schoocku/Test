class TestMap {
  constructor(x, y) {
    this.friction = 0.0008;
    this.hole = new Hole(600, 70);
    this.ballStartPosition = createVector(150, 400);
    this.mapLines = [
            new Line(100, 430, 300, 430),
            new Line(300, 430, 300, 300),
            new Line(300, 300, 700, 300),
            new Line(700, 300, 700, 40),
            new Line(700, 40, 500, 40),
            new Line(500, 40, 500, 180),
            new Line(500, 180, 100, 180),
            new Line(100, 180, 100, 430),
            new Line(640, 300, 700, 240),
            new Line(100, 240, 160, 180)
    ];
  }

  draw() {
    this.mapLines.forEach(function(item, index, array) {
      item.draw();
    });
    this.hole.draw();
  }

  checkCollision(ball) {
    this.hole.checkCollision(ball);
    let lineColliding = ball.checkCollisionWithLines(this.mapLines);
    if (lineColliding != null) {
      console.log("Distance:" + lineColliding.getDistanceFromPoint(ball.center));
      ball.stop();
      return;
      lineColliding.calculateBounce(ball);
      ball.applyFriction(this.friction);
    }
  }

}
