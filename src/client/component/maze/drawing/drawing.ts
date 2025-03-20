export type XY = { x: number; y: number };
export type Rect = XY & { w: number; h: number };

export abstract class Drawing {
  public readonly width: number;
  public readonly height: number;

  public constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public abstract clear(color?: string, originX?: number, originY?: number): void;

  public abstract line(start: XY, finish: XY, color: string): void;

  public abstract rect(start: XY, finish: XY, color: string): void;

  public abstract polygon(points: XY[], color: string): void;

  public abstract text(rect: Rect, text: string, color?: string): void;

  public abstract circle(center: XY, radius: number, color?: string): void;
}
