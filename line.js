class Line {
  constructor(x1, y1, x2, y2) {
    this.point1 = createVector(x1, y1);
    this.point2 = createVector(x2, y2);
    this.prevBallDistance = 0;
    this.ballDistance = 0;
    this.rotateBounce = false;
  }

  draw() {
    stroke(0, 0, 0);
    line(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
  }

  calculateBallDistances(ball) {
    this.prevBallDistance = this.getDistanceFromPoint(ball.prevCenter);
    this.ballDistance = this.getDistanceFromPoint(ball.center);
  }

  getDistanceFromPoint(pointToCheck) {
    let a = this.point2.x - this.point1.x;
    let b = this.point2.y - this.point1.y;

    let isOnLine = a * (pointToCheck.x - this.point1.x) + b * (pointToCheck.y - this.point1.y);
    isOnLine = isOnLine / (pow(a, 2) + pow(b, 2));

    let pointOnLine = createVector();
    if (isOnLine <= 0) {
      pointOnLine.set(this.point1.x, this.point1.y);
      this.rotateBounce = true;
    } else if (isOnLine >= 1) {
      pointOnLine.set(this.point2.x, this.point2.y);
      this.rotateBounce = true;
    } else {
      pointOnLine.set(this.point1.x + isOnLine * a, this.point1.y + isOnLine * b);
      this.rotateBounce = false;
    }

    return distanceBetweenPoints(pointOnLine, pointToCheck);

  }

  calculateBounce(ball) {
    this.ballDistance = this.getDistanceFromPoint(ball.center);

    let baseDelta = p5.Vector.sub(this.point2, this.point1);
    baseDelta.normalize();
    let normalOfPlane = createVector(-baseDelta.y, baseDelta.x);

    ball.velocity.mult(-1);

    let velocityNormalDot = ball.velocity.dot(normalOfPlane);

    ball.velocity.set(
      2 * normalOfPlane.x * velocityNormalDot - ball.velocity.x,
      2 * normalOfPlane.y * velocityNormalDot - ball.velocity.y
    );

    if (this.rotateBounce) {
      this.rotateVector180(ball.velocity);
    }
  }

  rotateVector180(vectorToRotate){
    let prevX = vectorToRotate.x;
    let prevY = vectorToRotate.y;
    vectorToRotate.x = -1 * prevX;
    vectorToRotate.y = -1 * prevY;
  }

}
