class Hole {
  constructor(x, y) {
    this.center = createVector(x, y);
    this.r = 7.5;
    this.holeEnterSpeed = 0.39
  }

  draw() {
    ellipse(this.center.x, this.center.y, this.r * 2, this.r * 2);
  }

  checkCollision(ball) {
    let distanceFromHole = distanceBetweenPoints(ball.center, this.center);
    if (distanceFromHole < (this.r + ball.distanceToHole)) {
      let currentSpeed = sqrt(pow(ball.velocity.x, 2) + pow(ball.velocity.y, 2));
      if (currentSpeed <  this.holeEnterSpeed) {
        // TODO
        ball.center.x = 150
        ball.center.y = 400;
        ball.velocity.set(0);
      }
    }
  }

}
