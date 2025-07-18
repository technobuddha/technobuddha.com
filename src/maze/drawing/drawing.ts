import { type Cartesian, type Rect } from '@technobuddha/library';

export abstract class Drawing {
  public readonly width: number;
  public readonly height: number;

  public constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public abstract clear(color?: string, originX?: number, originY?: number): void;

  public abstract line(start: Cartesian, finish: Cartesian, color: string): void;

  public abstract rect(start: Cartesian, finish: Cartesian, color: string): void;

  public abstract polygon(points: Cartesian[], color: string): void;

  public abstract text(rect: Rect, text: string, color?: string): void;

  public abstract circle(center: Cartesian, radius: number, color?: string): void;

  public abstract arc(
    cx: number,
    cy: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number,
    color?: string,
  ): void;
}
