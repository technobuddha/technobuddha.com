type Coordinates = {
  x: number;
  y: number;
};

export function isCoordinates(value: unknown): value is Coordinates {
  return (
    typeof value === 'object' &&
    value !== null &&
    'x' in value &&
    'y' in value &&
    typeof (value as Coordinates).x === 'number' &&
    typeof (value as Coordinates).y === 'number'
  );
}

export class CoordinatesSet implements ReadonlySetLike<Coordinates> {
  private readonly xaxis: Map<number, Set<number>> = new Map();

  public constructor(coordinates?: Coordinates[] | null) {
    if (coordinates) {
      for (const { x, y } of coordinates) {
        this.add({ x, y });
      }
    }
  }

  public get size(): number {
    let size = 0;
    for (const set of this.xaxis.values()) {
      size += set.size;
    }
    return size;
  }

  public readonly [Symbol.toStringTag] = 'CoordinatesSet';

  public add(value: Coordinates): this {
    const { x, y } = value;
    if (!this.xaxis.has(x)) {
      this.xaxis.set(x, new Set());
    }
    this.xaxis.get(x)!.add(y);
    return this;
  }

  public clear(): void {
    this.xaxis.clear();
  }

  public delete(value: Coordinates): boolean {
    const { x, y } = value;
    const set = this.xaxis.get(x);
    if (set) {
      const deleted = set.delete(y);
      if (set.size === 0) {
        this.xaxis.delete(x);
      }
      return deleted;
    }
    return false;
  }

  public difference(other: CoordinatesSet): CoordinatesSet {
    const result = new CoordinatesSet();
    for (const value of this.values()) {
      if (!other.has(value)) {
        result.add(value);
      }
    }
    return result;
  }

  public *entries(): SetIterator<[Coordinates, Coordinates]> {
    for (const value of this.values()) {
      yield [value, value];
    }
  }

  public forEach(
    callback: (value: Coordinates, key: Coordinates, set: CoordinatesSet) => void,
    thisArg?: this,
  ): void {
    for (const value of this.values()) {
      callback.call(thisArg, value, value, this);
    }
  }

  public has({ x, y }: Coordinates): boolean {
    const yaxis = this.xaxis.get(x);
    return yaxis ? yaxis.has(y) : false;
  }

  public intersection(other: CoordinatesSet): CoordinatesSet {
    const result = new CoordinatesSet();
    for (const coordinate of this.values()) {
      if (other.has(coordinate)) {
        result.add(coordinate);
      }
    }
    return result;
  }

  public isDisjointFrom(other: CoordinatesSet): boolean {
    for (const coordinate of this.values()) {
      if (other.has(coordinate)) {
        return false; // Found a common coordinate
      }
    }
    return true;
  }

  public isSubsetOf(other: CoordinatesSet): boolean {
    for (const coordinate of this.values()) {
      if (!other.has(coordinate)) {
        return false; // Found a coordinate not in other
      }
    }
    return true; // All coordinates are in other
  }

  public isSupersetOf(other: CoordinatesSet): boolean {
    for (const coordinate of other.values()) {
      if (!this.has(coordinate)) {
        return false; // Found a coordinate in other not in this
      }
    }
    return true; // All coordinates in other are also in this
  }

  public *keys(): SetIterator<Coordinates> {
    yield* this.values();
  }

  public symmetricDifference(other: CoordinatesSet): CoordinatesSet {
    const result = new CoordinatesSet();

    for (const coordinate of this.values()) {
      if (!other.has(coordinate)) {
        result.add(coordinate);
      }
    }

    for (const coordinate of other.values()) {
      if (!this.has(coordinate)) {
        result.add(coordinate);
      }
    }

    return result;
  }

  public union(other: CoordinatesSet): CoordinatesSet {
    const result = new CoordinatesSet();
    for (const coordinate of this.values()) {
      result.add(coordinate);
    }
    for (const coordinate of other.values()) {
      result.add(coordinate);
    }
    return result;
  }

  public *values(): SetIterator<Coordinates> {
    for (const [x, yaxis] of this.xaxis.entries()) {
      for (const y of yaxis) {
        yield { x, y };
      }
    }
  }

  public [Symbol.iterator](): SetIterator<Coordinates> {
    return this.values();
  }
}
