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
      this.calculateBounce(lineColliding, ball);
      applyFriction(ball, this.friction);
    }
  }

  calculateBounce(lineToCheck, ball) {
    let baseDelta = p5.Vector.sub(lineToCheck.point2, lineToCheck.point1);
    baseDelta.normalize();
    let normalOfPlane = createVector(-baseDelta.y, baseDelta.x);

    ball.velocity.mult(-1);

    let velocityNormalDot = ball.velocity.dot(normalOfPlane);

    ball.velocity.set(
      2 * normalOfPlane.x * velocityNormalDot - ball.velocity.x,
      2 * normalOfPlane.y * velocityNormalDot - ball.velocity.y
    );
  }

}
