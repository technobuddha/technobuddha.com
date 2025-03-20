type XY = { x: number; y: number };

export class Drawing {
  private readonly context: CanvasRenderingContext2D;

  public readonly width: number;
  public readonly height: number;

  public constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.width = context.canvas.width;
    this.height = context.canvas.height;

    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.clear();
  }

  public clear(color?: string): void {
    if (color) {
      this.context.fillStyle = color;
      this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    } else {
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }
  }

  public line(start: XY, finish: XY, color?: string): void {
    if (color) {
      this.context.strokeStyle = color;
    }

    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.lineTo(finish.x, finish.y);
    this.context.stroke();
  }

  public rect(start: XY, finish: XY, color?: string): void {
    if (color) {
      this.context.fillStyle = color;
    }

    this.context.fillRect(start.x, start.y, finish.x - start.x, finish.y - start.y);
  }

  public polygon(points: XY[], color?: string): void {
    if (color) {
      this.context.fillStyle = color;
    }

    this.context.beginPath();
    this.context.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) {
      this.context.lineTo(point.x, point.y);
    }
    this.context.fill();
  }
}
