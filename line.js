class Line {
  constructor(x1, y1, x2, y2) {
    this.point1 = createVector(x1, y1);
    this.point2 = createVector(x2, y2);
    this.prevBallDistance = 0;
    this.ballDistance = 0;
    this.point1Distance = false;
    this.point2Distance = false;
    this.pointOnLine = createVector();
    this.intersectionPoint = createVector();
    this.color = color("#000000");
  }

  draw() {
    stroke(this.color);
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

    if (isOnLine <= 0) {
      this.pointOnLine.set(this.point1.x, this.point1.y);
      this.point1Distance = true;
      this.point2Distance = false;
    } else if (isOnLine >= 1) {
      this.pointOnLine.set(this.point2.x, this.point2.y);
      this.point1Distance = false;
      this.point2Distance = true;
    } else {
      this.pointOnLine.set(this.point1.x + isOnLine * a, this.point1.y + isOnLine * b);
      this.point1Distance = false;
      this.point2Distance = false;
    }

    return distanceBetweenPoints(this.pointOnLine, pointToCheck);

  }

  calculateBounce(ball) {
    this.ballDistance = this.getDistanceFromPoint(ball.center);

    let normalOfPlane = this.getNormal()

    ball.velocity.mult(-1);

    let velocityNormalDot = ball.velocity.dot(normalOfPlane);

    ball.velocity.set(
      2 * normalOfPlane.x * velocityNormalDot - ball.velocity.x,
      2 * normalOfPlane.y * velocityNormalDot - ball.velocity.y
    );

    if (this.point1Distance || this.point2Distance) {
      this.rotateVector180(ball.velocity);
    }
  }

  getNormal() {
    let baseDelta = p5.Vector.sub(this.point2, this.point1);
    baseDelta.normalize();
    return createVector(-baseDelta.y, baseDelta.x);
  }

  rotateVector180(vectorToRotate){
    let prevX = vectorToRotate.x;
    let prevY = vectorToRotate.y;
    vectorToRotate.x = -1 * prevX;
    vectorToRotate.y = -1 * prevY;
  }

  intersectionCheck(lineToCheck) {
    let p0x = this.point1.x;
    let p0y = this.point1.y;
    let p1x = this.point2.x;
    let p1y = this.point2.y;
    let p2x = lineToCheck.point1.x;
    let p2y = lineToCheck.point1.y;
    let p3x = lineToCheck.point2.x;
    let p3y = lineToCheck.point2.y;

    let dx1 = p1x - p0x;
    let dy1 = p1y - p0y;
    let dx2 = p3x - p2x;
    let dy2 = p3y - p2y;
    let dx3 = p0x - p2x;
    let dy3 = p0y - p2y;

    let collisionDetected = false;

    let d = dx1 * dy2 - dx2 * dy1;

    d = dx1 * dy2 - dx2 * dy1;

    if(d !== 0){
        let s = dx1 * dy3 - dx3 * dy1;
        if((s <= 0 && d < 0 && s >= d) || (s >= 0 && d > 0 && s <= d)){
            let t = dx2 * dy3 - dx3 * dy2;
            if((t <= 0 && d < 0 && t > d) || (t >= 0 && d > 0 && t < d)){
                t = t / d;
                collisionDetected = true;
                this.intersectionPoint.x = p0x + t * dx1;
                this.intersectionPoint.y = p0y + t * dy1;
            }
        }
    }
    return collisionDetected;
  }

//   isLineCrossing(lineToCheck2) {
//     let p1 = createVector(this.point1.x,this.point1.y);
//     let q1 = createVector(this.point2.x,this.point2.y);
//     let p2 = createVector(lineToCheck2.point1.x,lineToCheck2.point1.y);
//     let q2 = createVector(lineToCheck2.point2.x,lineToCheck2.point2.y);
//
//     let o1 = this.orientation(p1, q1, p2);
//     let o2 = this.orientation(p1, q1, q2);
//     let o3 = this.orientation(p2, q2, p1);
//     let o4 = this.orientation(p2, q2, q1);
//
//     if (o1 != o2 && o3 != o4) {
//       return true;
//     }
//     if (o1 == 0 && this.onSegment(p1, p2, q1)) {
//       return true;
//     }
//     if (o2 == 0 && this.onSegment(p1, q2, q1)) {
//       return true;
//     }
//     if (o3 == 0 && this.onSegment(p2, p1, q2)) {
//       return true;
//     }
//     if (o4 == 0 && this.onSegment(p2, q1, q2)) {
//       return true;
//     }
//     return false;
//   }
//
//   orientation(p, q, r) {
//     let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
//     if (val == 0) {
//       return 0;
//     }
//     if (val > 0) {
//       return 1;
//     } else {
//       return 2;
//     }
//   }
//
//   onSegment(p, q, r) {
//     if (q.x <= max(p.x, r.x) && q.x >= min(p.x, r.x) && q.y <= max(p.y, r.y) && q.y >= min(p.y, r.t)) {
//       return true;
//     }
//     return false;
//   }
}
