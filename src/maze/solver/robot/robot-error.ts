export class RobotError extends Error {
  public override readonly name: string = 'RobotError';
  public readonly color: string | undefined;

  public constructor(message: string, color?: string) {
    super(message);
    this.color = color;
  }

  public override toString(): string {
    return `${this.name}: ${this.message}`;
  }
}
