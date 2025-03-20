import { Drawing, type XY } from './drawing.js';

export class CanvasDrawing extends Drawing {
  private readonly canvas: CanvasRenderingContext2D;

  public constructor(element: HTMLCanvasElement) {
    const context = element.getContext('2d')!;
    if (context) {
      super(context.canvas.width, context.canvas.height);

      this.canvas = context;

      this.canvas.setTransform(1, 0, 0, 1, 0, 0);
      this.canvas.translate(0.5, 0.5);

      this.clear();
    } else {
      throw new Error('Failed to get 2D context');
    }
  }

  public clear(color?: string): void {
    if (color) {
      this.canvas.fillStyle = color;
      this.canvas.fillRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
    } else {
      this.canvas.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
    }
  }

  public line(start: XY, finish: XY, color: string): void {
    this.canvas.strokeStyle = color;
    this.canvas.beginPath();
    this.canvas.moveTo(start.x, start.y);
    this.canvas.lineTo(finish.x, finish.y);
    this.canvas.stroke();
  }

  public rect(start: XY, finish: XY, color: string): void {
    this.canvas.fillStyle = color;
    this.canvas.fillStyle = color;

    this.canvas.fillRect(start.x, start.y, finish.x - start.x, finish.y - start.y);
  }

  public polygon(points: XY[], color: string): void {
    this.canvas.fillStyle = color;
    this.canvas.beginPath();
    this.canvas.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) {
      this.canvas.lineTo(point.x, point.y);
    }
    this.canvas.fill();
  }
}
