class Ball {
  constructor(x, y) {
    this.prevCenter = createVector(x, y);
    this.lastVelocity = createVector(0, 0);
    this.center = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.r = 5;
    this.distanceToHole = 2;
    this.isMoving = false;
    this.arrowVector = createVector(0, 0);
    this.maxPower = 200;
    this.arrowSize = 7;
    this.startSpeedFactor = 0.0042;
  }

  draw() {
    push();
    translate(this.center.x, this.center.y);
    noStroke();
    ellipse(0, 0, this.r * 2, this.r * 2);
    if (!this.isMoving) {
      stroke(0);
      line(0, 0, this.arrowVector.x, this.arrowVector.y);
      rotate(this.arrowVector.heading());
      translate(this.arrowVector.mag() - this.arrowSize, 0);
      triangle(0, this.arrowSize / 2, 0, -this.arrowSize / 2, this.arrowSize, 0);
    }
    pop();
  }

  calculate() {
    if (abs(this.velocity.x) < 0.01 && abs(this.velocity.y) < 0.01) {
      this.velocity.x = 0;
      this.velocity.y = 0;
      this.isMoving = false;
    }
    this.prevCenter.x = this.center.x;
    this.prevCenter.y = this.center.y;

    this.lastVelocity.x = this.velocity.x * deltaTime;
    this.lastVelocity.y = this.velocity.y * deltaTime;

    this.center.x = this.center.x + this.lastVelocity.x;
    this.center.y = this.center.y + this.lastVelocity.y;

    this.arrowVector.x = mouseX - this.center.x;
    this.arrowVector.y = mouseY - this.center.y;
    this.arrowVector.limit(this.maxPower);
  }

  startMoving(startX, startY) {
    if (this.isMoving) {
      return;
    }
    this.isMoving = true;
    this.arrowVector.x = startX - this.center.x;
    this.arrowVector.y = startY - this.center.y;
    this.arrowVector.limit(this.maxPower);
    this.velocity.x = this.arrowVector.x * this.startSpeedFactor;
    this.velocity.y = this.arrowVector.y * this.startSpeedFactor;
  }

  checkCollisionWithLine(lineToCheck) {
    let distanceToLine = getDistanceFromLine(lineToCheck, this.center);
    let distanceTraveled = distanceBetweenPoints(this.prevCenter, this.center);
    if (doLineCross(lineToCheck, new Line(this.prevCenter.x, this.prevCenter.y, this.center.x, this.center.y))) {
      this.correctPositionPostLine(distanceTraveled, this.r + distanceToLine);
      return true;
    } else if (distanceToLine <= this.r) {
      this.correctPositionPreLine(distanceTraveled, this.r - distanceToLine);
      return true;
    }
    return false;
  }

  correctPositionPostLine(distanceTraveled, distanceToMove) {
    if (distanceTraveled == 0) {
      return;
    }
    let reduceFactor = abs((distanceTraveled - distanceToMove) / distanceTraveled);
    this.center.x -= (this.lastVelocity.x - (this.lastVelocity.x * reduceFactor));
    this.center.y -= (this.lastVelocity.y - (this.lastVelocity.y * reduceFactor));
    this.prevCenter.x = this.center.x;
    this.prevCenter.y = this.center.y;
  }

  correctPositionPreLine(distanceTraveled, distanceToMove) {
    if (distanceTraveled == 0) {
      return;
    }
    let reduceFactor = abs((distanceTraveled - distanceToMove) / distanceTraveled);
    this.center.x -= (this.lastVelocity.x * reduceFactor);
    this.center.y -= (this.lastVelocity.y * reduceFactor);
    this.prevCenter.x = this.center.x;
    this.prevCenter.y = this.center.y;
  }
}
