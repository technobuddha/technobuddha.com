export type XY = { x: number; y: number };

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

  public abstract text(xy: XY, text: string, color: string): void;
}
