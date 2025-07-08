import { type Cartesian, type Rect } from '@technobuddha/library';

import { Drawing } from './drawing.ts';

function create(tag: string, attributes: Record<string, string | number> = {}): Element {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value.toString());
  }
  return element;
}

export class SVGDrawing extends Drawing {
  private readonly svg: SVGSVGElement;

  public constructor(element: SVGSVGElement) {
    super(element.clientWidth, element.clientHeight);
    this.svg = element;

    this.clear();
  }

  public clear(color?: string): void {
    if (color) {
      this.svg.replaceChildren(
        create('rect', { x: 0, y: 0, width: this.width, height: this.height, fill: color }),
      );
    } else {
      this.svg.replaceChildren();
    }
  }

  public line(start: Cartesian, finish: Cartesian, color: string): void {
    if (this.svg) {
      this.svg.append(
        create('line', { x1: start.x, y1: start.y, x2: finish.x, y2: finish.y, stroke: color }),
      );
    }
  }

  public rect(start: Cartesian, finish: Cartesian, color: string): void {
    if (this.svg) {
      this.svg.append(
        create('rect', {
          x: start.x,
          y: start.y,
          width: finish.x - start.x,
          height: finish.y - start.y,
          fill: color,
        }),
      );
    }
  }

  public polygon(points: Cartesian[], color: string): void {
    const pointsString = points.map((point) => `${point.x},${point.y}`).join(' ');
    this.svg.append(create('polygon', { points: pointsString, fill: color }));
  }

  public text(_rect: Rect, _text: string, _color: string): void {
    throw new Error('Method not implemented.');
  }

  public circle(center: Cartesian, radius: number, color = 'black'): void {
    this.svg.append(create('circle', { cx: center.x, cy: center.y, r: radius, fill: color }));
  }

  public arc(
    _cx: number,
    _cy: number,
    _innerRadius: number,
    _outerRadius: number,
    _startAngle: number,
    _endAngle: number,
    _color?: string,
  ): void {
    throw new Error('Method not implemented.');
  }
}
