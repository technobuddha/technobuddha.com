type LineSegment = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
};

type Point = { x: number; y: number };

export function intersection(a: LineSegment, b: LineSegment): Point {
  const denominator = (b.y1 - b.y0) * (a.x1 - a.x0) - (b.x1 - b.x0) * (a.y1 - a.y0);

  if (denominator === 0) {
    throw new TypeError('Line segments are parallel or coincident');
  }

  const ua = ((b.x1 - b.x0) * (a.y0 - b.y0) - (b.y1 - b.y0) * (a.x0 - b.x0)) / denominator;
  // const ub = ((a.x1 - a.x0) * (a.y0 - b.y0) - (a.y1 - a.y0) * (a.x0 - b.x0)) / denominator;

  // if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
  //   return undefined; // Intersection is outside the line segments
  // }

  return {
    x: a.x0 + ua * (a.x1 - a.x0),
    y: a.y0 + ua * (a.y1 - a.y0),
  };
}
