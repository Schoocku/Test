class Ball {
  constructor(x, y) {
    this.prevCenter = createVector(x, y);
    this.lastVelocity = createVector(0, 0);
    this.center = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.r = 5;
    this.mass = 1;
    this.distanceToHole = 2;
    this.isMoving = false;
    this.arrowVector = createVector(0, 0);
    this.maxPower = 200;
    this.arrowSize = 7;
    this.startSpeedFactor = 0.0042;
    this.minimalVelocity = 0.01;
    this.isVisible = true;
    this.isCurrentTurn = true;
    this.distanceTraveled = 0;
    this.color = color("#ffff00");
  }

  draw() {
    if (!this.isVisible) {
      return;
    }
    push();
    translate(this.center.x, this.center.y);
    fill(this.color);
    noStroke();
    ellipse(0, 0, this.r * 2, this.r * 2);
    if (!this.isMoving && this.isCurrentTurn) {
      stroke(0);
      fill(0);
      line(0, 0, this.arrowVector.x, this.arrowVector.y);
      rotate(this.arrowVector.heading());
      translate(this.arrowVector.mag() - this.arrowSize, 0);
      triangle(0, this.arrowSize / 2, 0, -this.arrowSize / 2, this.arrowSize, 0);
    }
    pop();
  }

  calculateNextPosition() {
    if (!this.isVisible) {
      return;
    }
    if (abs(this.velocity.x) < this.minimalVelocity && abs(this.velocity.y) < this.minimalVelocity) {
      this.velocity.x = 0;
      this.velocity.y = 0;
      this.isMoving = false;
    } else {
      this.isMoving = true;
    }
    this.prevCenter.x = this.center.x;
    this.prevCenter.y = this.center.y;

    this.lastVelocity.x = this.velocity.x * deltaTime;
    this.lastVelocity.y = this.velocity.y * deltaTime;

    this.center.x += this.lastVelocity.x;
    this.center.y += this.lastVelocity.y;

    this.distanceTraveled = distanceBetweenPoints(this.prevCenter, this.center);

    if (!this.isMoving) {
      this.arrowVector.x = mouseX - this.center.x;
      this.arrowVector.y = mouseY - this.center.y;
      this.arrowVector.limit(this.maxPower);
    }
  }

  startMoving(startX, startY) {
    if (!this.isVisible) {
      return;
    }
    if (!this.isCurrentTurn) {
      return;
    }
    if (this.isMoving) {
      return;
    }
    this.arrowVector.x = startX - this.center.x;
    this.arrowVector.y = startY - this.center.y;
    this.arrowVector.limit(this.maxPower);
    this.velocity.x = this.arrowVector.x * this.startSpeedFactor;
    this.velocity.y = this.arrowVector.y * this.startSpeedFactor;
  }

  checkCollisionWithLines(linesToCheck) {
    if (linesToCheck.length == 0) {
      return null;
    }
    if (!this.isVisible) {
      return null;
    }
    let closestLine = linesToCheck[0];
    closestLine.calculateBallDistances(this);
    let minDistance = closestLine.ballDistance;
    let minPrevDistance = closestLine.prevBallDistance;
    let linesCrossing = [];
    linesToCheck.forEach(function(item, index, array) {
      item.calculateBallDistances(this);
      if (item.ballDistance < minDistance) {
        closestLine = item;
        minDistance = closestLine.ballDistance;
        minPrevDistance = closestLine.prevBallDistance;
      } else if (item.ballDistance == minDistance) {
        if (item.prevBallDistance < minPrevDistance) {
          closestLine = item;
          minDistance = closestLine.ballDistance;
          minPrevDistance = closestLine.prevBallDistance;
        }
      }
      if (this.checkLineCrossing(item)) {
        linesCrossing.push(item);
      }
    }, this);

    if (linesCrossing.length > 0) {
      let closestPrevLine = linesCrossing[0];
      minPrevDistance = closestLine.prevBallDistance;
      linesCrossing.forEach(function(item, index, array) {
        if (item.prevBallDistance < minDistance) {
          closestPrevLine = item;
          minPrevDistance = closestLine.prevBallDistance;
        }
      }, this);
      // this.center.x = closestPrevLine.intersectionPoint.x;
      // this.center.y = closestPrevLine.intersectionPoint.y;
      let tempDistance = distanceBetweenPoints(this.center, closestPrevLine.intersectionPoint);
      this.correctPosition(tempDistance - this.r);
      return closestLine;
    } else {
      if (closestLine.ballDistance < this.r) {
        this.correctPosition(closestLine.prevBallDistance - this.r);
        return closestLine;
      } else if (closestLine.ballDistance == this.r) {
        return closestLine;
      }
    }
    return null;
  }

  checkLineCrossing(lineToCheck) {
    // if (lineToCheck.isLineCrossing(new Line(this.prevCenter.x, this.prevCenter.y, this.center.x, this.center.y))) {
    if (lineToCheck.intersectionCheck(new Line(this.prevCenter.x, this.prevCenter.y, this.center.x, this.center.y))) {
      console.log("intersection");
      return true;
    }
    return false;
  }

  correctPosition(distanceToMove) {
    if (this.distanceTraveled == 0) {
      this.distanceTraveled = 1;
    }
    let reduceFactor = abs(distanceToMove / this.distanceTraveled);
    this.center.x = this.prevCenter.x + (this.lastVelocity.x * reduceFactor);
    this.center.y = this.prevCenter.y + (this.lastVelocity.y * reduceFactor);
    // this.prevCenter.x = this.center.x;
    // this.prevCenter.y = this.center.y;
  }

  stop() {
    this.velocity.set(0);
  }

  applyFriction(friction) {
    let xRatio = 1 / (1 + (deltaTime * friction));
    this.velocity.x *= xRatio;
    this.velocity.y *= xRatio;
  }

  correctBallPositions(ball, collisionsPairs) {
    let ballTravelLine = new Line(this.prevCenter.x, this.prevCenter.y, this.center.x, this.center.y);
    let ballDistanceToTravelLine = ballTravelLine.getDistanceFromPoint(ball.center);
    // let ballsDistance = distanceBetweenPoints(this.center, ball.center);
    let isCollision = false;
    if (ballDistanceToTravelLine < (this.r + ball.r) && ballTravelLine.point2Distance) {
      isCollision = true;
    } else if (ballDistanceToTravelLine < (this.r + ball.r) && (!ballTravelLine.point1Distance && !ballTravelLine.point2Distance)) {
      isCollision = true;
      this.correctPosition(this.r);
      ballDistanceToTravelLine = distanceBetweenPoints(this.center, ball.center);
    }

    // if (ballsDistance < (this.r + ball.r)) {

      // let ballsDistance = distanceBetweenPoints(this.center, ball.center);
      // let prevBallDistance = distanceBetweenPoints(this.prevCenter, ball.center);
      // if (this.distanceTraveled > prevBallDistance) {
      //     this.correctPosition(this.r);
      //     ballDistanceToTravelLine = distanceBetweenPoints(this.center, ball.center);
      // } else {
        // if (!ballTravelLine.point1Distance && !ballTravelLine.point2Distance) {
        //   console.log("Move?");
        //   this.center.x = ballTravelLine.pointOnLine.x;
        //   this.center.y = ballTravelLine.pointOnLine.y;
        //   // ballDistanceToTravelLine = distanceBetweenPoints(this.center, ball.center);
        // }
      // }
      // ballDistanceToTravelLine = distanceBetweenPoints(this.center, ball.center);
      // if (ballTravelLine.point1Distance || ballTravelLine.point2Distance) {
      //   console.log("To point");
      // }
      // if (!ballTravelLine.point1Distance && !ballTravelLine.point2Distance) {
      //   console.log("Move?");
      //   this.center.x = ballTravelLine.pointOnLine.x;
      //   this.center.y = ballTravelLine.pointOnLine.y;
      //   ballDistanceToTravelLine = distanceBetweenPoints(this.center, ball.center);
      // }

      // ballDistance = distanceBetweenPoints(this.center, ball.center);

      //
      // this.stop();
      // ball.stop();
    // }

    if (isCollision) {
      collisionsPairs.push([this, ball]);
      if (ballDistanceToTravelLine == 0) {
        ballDistanceToTravelLine = 1;
      }
      let overlap = 0.5 * (ballDistanceToTravelLine - this.r - ball.r);
      this.center.x -= overlap * (this.center.x - ball.center.x) / ballDistanceToTravelLine;
      this.center.y -= overlap * (this.center.y - ball.center.y) / ballDistanceToTravelLine;
      ball.center.x += overlap * (this.center.x - ball.center.x) / ballDistanceToTravelLine;
      ball.center.y += overlap * (this.center.y - ball.center.y) / ballDistanceToTravelLine;
    }
    return;

    // let ballsDistance = distanceBetweenPoints(this.center, ball.center);
    // if (ballsDistance < (this.r + ball.r)) {
    //   let prevBallDistance = distanceBetweenPoints(this.prevCenter, ball.center);
    //   if (this.distanceTraveled > prevBallDistance) {
    //       this.correctPosition(this.r);
    //       ballsDistance = distanceBetweenPoints(this.center, ball.center);
    //   }
    //   collisionsPairs.push([this, ball]);
    //   if (ballsDistance == 0) {
    //     ballsDistance = 1;
    //   }
    //   let overlap = 0.5 * (ballsDistance - this.r - ball.r);
    //   this.center.x -= overlap * (this.center.x - ball.center.x) / ballsDistance;
    //   this.center.y -= overlap * (this.center.y - ball.center.y) / ballsDistance;
    //   ball.center.x += overlap * (this.center.x - ball.center.x) / ballsDistance;
		// 	ball.center.y += overlap * (this.center.y - ball.center.y) / ballsDistance;
      // this.stop();
      // ball.stop();
      // return;
    // }
  }

  calculateBallsCollision(ball) {
    let ballsDistance = distanceBetweenPoints(this.center, ball.center);
    if (ballsDistance == 0) {
      ballsDistance = 1;
    }
    let nx = (ball.center.x - this.center.x) / ballsDistance;
    let ny = (ball.center.y - this.center.y) / ballsDistance;

    let kx = (this.velocity.x - ball.velocity.x);
		let ky = (this.velocity.y - ball.velocity.y);
		let p = 2.0 * (nx * kx + ny * ky) / (this.mass + ball.mass);
		this.velocity.x = this.velocity.x - p * ball.mass * nx;
		this.velocity.y = this.velocity.y - p * ball.mass * ny;
		ball.velocity.x = ball.velocity.x + p * this.mass * nx;
		ball.velocity.y = ball.velocity.y + p * this.mass * ny;
  }

}
