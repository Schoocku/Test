class BackgroundCanvas {
  constructor(x, y) {
    this.friction = 0.0008;
    this.width = 800;
    this.height = 480;
    this.color = "rgb(190, 190, 190)";
  }

  checkCollision(ball) {
    if (ball.center.x - ball.r <= 0) {
      ball.velocity.x *= -1;
      ball.applyFriction(this.friction);
      ball.center.x = 0 + ball.r;
      return;
    }
    if (ball.center.x + ball.r >= this.width) {
      ball.velocity.x *= -1;
      ball.applyFriction(this.friction);
      ball.center.x = this.width - ball.r;
      return;
    }
    if (ball.center.y - ball.r <= 0) {
      ball.velocity.y *= -1;
      ball.applyFriction(this.friction);
      ball.center.y = 0 + ball.r;
      return;
    }
    if (ball.center.y + ball.r >= this.height) {
      ball.velocity.y *= -1;
      ball.applyFriction(this.friction);
      ball.center.y = this.height - ball.r;
      return;
    }
  }

}
