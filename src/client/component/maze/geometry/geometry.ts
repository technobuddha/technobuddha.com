import { type Cartesian } from '@technobuddha/library';

// prettier-ignore
export type Direction =
  |'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'|'i'|'j'|'k'|'l'|'m'|'n'|'o'|'p'|'q'|'r'|'s'|'t'|'u'|'v'|'w'|'x'|'y'|'z'|'?';

// prettier-ignore
export type Facing =
  |'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J'|'K'|'L'|'M'|'N'|'O'|'P'|'Q'|'R'|'S'|'T'|'U'|'V'|'W'|'X'|'Y'|'Z'|'!';

export type Pillar = `${Direction}${Direction}`;

export type Kind = number;

export type Cell = Cartesian;
export type CellDirection = Cell & {
  direction: Direction;
};
export type CellFacing = Cell & {
  facing: Facing;
};

export type CellTunnel = CellDirection & {
  tunnel: boolean;
};

export type Terminus = CellFacing;

export type Move = {
  direction: Direction;
  target: CellFacing;
  tunnel?: CellFacing[];
};

export type MoveOffset = Cartesian & { zone?: 'up' | 'down' };
