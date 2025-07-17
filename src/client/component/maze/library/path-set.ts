import { type CellDirection, type Direction } from '../geometry/index.ts';

type Path = CellDirection;

const toString = (p: Path): string => `${p.x},${p.y},${p.direction}`;
const toPath = (s: string): Path => {
  const [x, y, direction] = s.split(',');
  return { x: Number.parseInt(x), y: Number.parseInt(y), direction: direction as Direction };
};

export class PathSet {
  private readonly set: Set<string> = new Set();

  /**
   * Creates a new `PathSet` optionally initialized with an array of paths.
   *
   * @param cartesian - Optional array of cartesian to initialize the set.
   */
  public constructor(paths?: Path[] | null) {
    if (paths) {
      for (const path of paths) {
        this.set.add(toString(path));
      }
    }
  }

  public readonly [Symbol.toStringTag] = 'PathSet';

  /**
   * Adds one or more paths to the set.
   *
   * @param value - A single coordinate or an array of cartesian to add.
   * @returns The set itself, for chaining.
   */
  public add(value: Path | Path[]): this {
    const paths = Array.isArray(value) ? value : [value];

    for (const path of paths) {
      this.set.add(toString(path));
    }
    return this;
  }

  /**
   * Removes all paths from the set.
   */
  public clear(): void {
    this.set.clear();
  }

  /**
   * Removes a path from the set.
   *
   * @param value - The coordinate to remove.
   * @returns `true` if the coordinate was present and removed, `false` otherwise.
   */
  public delete(value: Path): boolean {
    return this.set.delete(toString(value));
  }

  /**
   * Returns a new set containing the paths present in this set but not in the other set.
   *
   * @param other - The set to compare against.
   * @returns A new `PathSet` with the difference.
   */
  public difference(other: PathSet): PathSet {
    const result = new PathSet();
    for (const value of this.values()) {
      if (!other.has(value)) {
        result.add(value);
      }
    }
    return result;
  }

  /**
   * Returns an iterator over `[path, path]` pairs for each path in the set.
   *
   * @returns An iterator of `[Path, Path]` pairs.
   */
  public *entries(): SetIterator<[Path, Path]> {
    for (const value of this.values()) {
      yield [value, value];
    }
  }

  /**
   * Executes a provided function once for each coordinate in the set.
   *
   * @param callback - Function to execute for each coordinate.
   * @param thisArg - Value to use as `this` when executing `callback`.
   */
  public forEach(callback: (value: Path, key: Path, set: PathSet) => void, thisArg?: this): void {
    for (const value of this.values()) {
      callback.call(thisArg, value, value, this);
    }
  }

  /**
   * Checks if a path is present in the set.
   *
   * @param path - The path to check.
   * @returns `true` if the path exists in the set, `false` otherwise.
   */
  public has(path: Path): boolean {
    return this.set.has(toString(path));
  }

  /**
   * Returns a new set containing only the paths present in both this set and the other set.
   *
   * @param other - The set to intersect with.
   * @returns A new `PathSet` with the intersection.
   */
  public intersection(other: PathSet): PathSet {
    const result = new PathSet();
    for (const path of this.values()) {
      if (other.has(path)) {
        result.add(path);
      }
    }
    return result;
  }

  /**
   * Checks if this set and the other set have no paths in common.
   *
   * @param other - The set to compare against.
   * @returns `true` if the sets are disjoint, `false` otherwise.
   */
  public isDisjointFrom(other: PathSet): boolean {
    for (const path of this.values()) {
      if (other.has(path)) {
        return false; // Found a common path
      }
    }
    return true;
  }

  /**
   * Checks if this set is a subset of another set.
   *
   * @param other - The set to compare against.
   * @returns `true` if every path in this set is also in the other set.
   */
  public isSubsetOf(other: PathSet): boolean {
    for (const path of this.values()) {
      if (!other.has(path)) {
        return false; // Found a path not in other
      }
    }
    return true; // All paths are in other
  }

  /**
   * Checks if this set is a superset of another set.
   *
   * @param other - The set to compare against.
   * @returns `true` if every path in the other set is also in this set.
   */
  public isSupersetOf(other: PathSet): boolean {
    for (const path of other.values()) {
      if (!this.has(path)) {
        return false; // Found a path in other not in this
      }
    }
    return true; // All paths in other are also in this
  }

  /**
   * Returns an iterator over the paths in the set.
   *
   * @returns An iterator of `Path`.
   */
  public *keys(): SetIterator<Path> {
    yield* this.values();
  }

  /**
   * Returns a new set containing paths that are in either this set or the other set, but not both.
   *
   * @param other - The set to compare against.
   * @returns A new `PathSet` with the symmetric difference.
   */
  public symmetricDifference(other: PathSet): PathSet {
    const result = new PathSet();

    for (const path of this.values()) {
      if (!other.has(path)) {
        result.add(path);
      }
    }

    for (const path of other.values()) {
      if (!this.has(path)) {
        result.add(path);
      }
    }

    return result;
  }

  /**
   * Returns a new set containing all paths from both this set and the other set.
   *
   * @param other - The set to unite with.
   * @returns A new `PathSet` with the union.
   */
  public union(other: PathSet): PathSet {
    const result = new PathSet();
    for (const path of this.values()) {
      result.add(path);
    }
    for (const path of other.values()) {
      result.add(path);
    }
    return result;
  }

  /**
   * Returns an iterator over the cartesian in the set.
   *
   * @returns An iterator of `Path`.
   */
  public *values(): SetIterator<Path> {
    for (const s of this.set) {
      yield toPath(s);
    }
  }

  /**
   * Returns an iterator over the paths in the set.
   *
   * @returns An iterator of `Path`.
   */
  public [Symbol.iterator](): SetIterator<Path> {
    return this.values();
  }
}
