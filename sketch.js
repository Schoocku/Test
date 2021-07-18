class Linja {
      constructor(point1, point2) {
              this.point1 = point1;
              this.point2 = point2;
            }
      
      draw() {
              line(this.point1.x, this.point1.y, this.point2.x, this.point2.y);
            }
}


function setup() {
      createCanvas(800, 480);
      vCircle = createVector(150, 400);
      v1 = createVector(40, 50);
      vectorVelocity = createVector(0, 0);
      maxPower = 200;
      friction = 0.0008;
      isMoving = false;
      
      mapLines = [
              new Linja(createVector(100, 430), createVector(300, 430)),
              new Linja(createVector(300, 430), createVector(300, 300)),
              new Linja(createVector(300, 300), createVector(700, 300)),
              new Linja(createVector(700, 300), createVector(700, 40)),
              new Linja(createVector(700, 40), createVector(500, 40)),
              new Linja(createVector(500, 40), createVector(500, 180)),
              new Linja(createVector(500, 180), createVector(100, 180)),
              new Linja(createVector(100, 180), createVector(100, 430)),
              new Linja(createVector(640, 300), createVector(700, 240)),
              new Linja(createVector(100, 240), createVector(160, 180))
            ];
      
}

function draw() {
      background(220);
      calculatePositions();
      drawMap();
      push();
      translate(vCircle.x, vCircle.y);
      noStroke();
      ellipse(0, 0, 10, 10);
      if (!isMoving) {
              stroke(0);
              line(0, 0, v1.x, v1.y);
              rotate(v1.heading());
              arrowSize = 7;
              translate(v1.mag() - arrowSize, 0);
              triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);  
            }
      pop();
}

function drawMap() {
      mapLines.forEach(function(item, index, array) {
              item.draw();
            });
}

function getDistanceFromLine(linja) {
      linePoint1 = linja.point1
      linePoint2 = linja.point2
      a = linePoint2.x - linePoint1.x;
      b = linePoint2.y - linePoint1.y;
      
      isOnBarrel = a * (vCircle.x - linePoint1.x) + b * (vCircle.y - linePoint1.y);
      isOnBarrel = isOnBarrel / (pow(a, 2) + pow(b, 2));
      
      if (isOnBarrel <= 0) {
              pointOnLine = createVector(linePoint1.x, linePoint1.y);
            } else if (isOnBarrel >= 1) {
                    pointOnLine = createVector(linePoint2.x, linePoint2.y);
                  } else {
                          pointOnLine = createVector(linePoint1.x + isOnBarrel * a, linePoint1.y + isOnBarrel * b);
                        }
      
      return distanceBetweenPoints(pointOnLine, vCircle);
}

function distanceBetweenPoints(point1, point2) {
      return sqrt(pow(point2.x - point1.x, 2) + pow(point2.y - point1.y, 2));
}

function calculatePositions() {
      applyFriction();
      
      if (abs(vectorVelocity.x) < 0.01 && abs(vectorVelocity.y) < 0.01) {
              vectorVelocity.x = 0;
              vectorVelocity.y = 0;
              isMoving = false;
            } 
      
      vCircle.x = vCircle.x + vectorVelocity.x * deltaTime;
      vCircle.y = vCircle.y + vectorVelocity.y * deltaTime;  
      
      detectWallCollisions();
      detectLinesCollisions();
      v1.x = mouseX - vCircle.x;
      v1.y = mouseY - vCircle.y; 
      v1.limit(maxPower);
}
 
function detectWallCollisions() {
      if (vCircle.x - 5 <= 0) {
              vectorVelocity.x *= -1;
              applyFriction();
              vCircle.x = 0 + 5;
              return;
            }
      if (vCircle.x + 5 >= 800) {
              vectorVelocity.x *= -1;
              applyFriction();
              vCircle.x = 800 - 5;
              return;
            }
      if (vCircle.y - 5 <= 0) {
              vectorVelocity.y *= -1;
              applyFriction();
              vCircle.y = 0 + 5;
              return;
            }
      if (vCircle.y + 5 >= 480) {
              vectorVelocity.y *= -1;
              applyFriction();
              vCircle.y = 480 - 5;
              return;
            }
}

function detectLinesCollisions() {
      mapLines.forEach(function(item, index, array) {
              dis = getDistanceFromLine(item);
              if (dis <= 5) {
                        calculateBounce(item);
                        applyFriction();
                        return;
                      }
            });
}


function calculateBounce(linja, base2) {
      baseDelta = p5.Vector.sub(linja.point2, linja.point1);
      baseDelta.normalize();
      normalOfPlane = createVector(-baseDelta.y, baseDelta.x);
      
      vectorVelocity.mult(-1);
      
      velocityNormalDot = vectorVelocity.dot(normalOfPlane);
      
      vectorVelocity.set(
              2 * normalOfPlane.x * velocityNormalDot - vectorVelocity.x,
              2 * normalOfPlane.y * velocityNormalDot - vectorVelocity.y
            );  
}

function applyFriction() {
      xRatio = 1 / (1 + (deltaTime * friction));
      vectorVelocity.x *= xRatio;
      vectorVelocity.y *= xRatio;
}


function mouseClicked() {
      // currentPower = sqrt(pow((mouseX - vCircle.x),2)+pow((mouseY -
    // vCircle.y),2));
    //   if (isMoving) {
    //       return;
    //         }
    //           isMoving = true;
    //             v1.limit(maxPower);
    //               vectorVelocity.x = v1.x * 0.004;
    //                 vectorVelocity.y = v1.y * 0.004;
    //                 }
    //
