
function distanceBetweenPoints(point1, point2) {
  return sqrt(pow(point2.x - point1.x, 2) + pow(point2.y - point1.y, 2));
}

function doLineCross(lineToCheck1, lineToCheck2) {
  let p1 = createVector(lineToCheck1.point1.x,lineToCheck1.point1.y);
  let q1 = createVector(lineToCheck1.point2.x,lineToCheck1.point2.y);
  let p2 = createVector(lineToCheck2.point1.x,lineToCheck2.point1.y);
  let q2 = createVector(lineToCheck2.point2.x,lineToCheck2.point2.y);

  let o1 = orientation(p1, q1, p2);
  let o2 = orientation(p1, q1, q2);
  let o3 = orientation(p2, q2, p1);
  let o4 = orientation(p2, q2, q1);

  if (o1 != o2 && o3 != o4) {
    return true;
  }
  if (o1 == 0 && onSegment(p1, p2, q1)) {
    return true;
  }
  if (o2 == 0 && onSegment(p1, q2, q1)) {
    return true;
  }
  if (o3 == 0 && onSegment(p2, p1, q2)) {
    return true;
  }
  if (o4 == 0 && onSegment(p2, q1, q2)) {
    return true;
  }
  return false;
}

function orientation(p, q, r) {
  let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val == 0) {
    return 0;
  }
  if (val > 0) {
    return 1;
  } else {
    return 2;
  }
}

function onSegment(p, q, r) {
  if (q.x <= max(p.x, r.x) && q.x >= min(p.x, r.x) && q.y <= max(p.y, r.y) && q.y >= min(p.y, r.t)) {
    return true;
  }
  return false;
}
