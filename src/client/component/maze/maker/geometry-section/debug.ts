export type Debug = {
  showBridges: boolean;
  showCoordinates: boolean;
  showKind: boolean;
  announceMaze: boolean;
};

export const defaultDebug: Debug = {
  showBridges: false,
  showCoordinates: false,
  showKind: false,
  announceMaze: true,
};

export type ShowSelection = {
  title: string;
  showCoordinates: boolean;
  showKind: boolean;
  showBridges: boolean;
};

export const shows: ShowSelection[] = [
  {
    title: 'None',
    showCoordinates: false,
    showKind: false,
    showBridges: false,
  },
  {
    title: 'Bridges',
    showCoordinates: false,
    showKind: false,
    showBridges: true,
  },
  {
    title: 'Coordinates',
    showCoordinates: true,
    showKind: false,
    showBridges: false,
  },
  {
    title: 'Kind',
    showCoordinates: false,
    showKind: true,
    showBridges: false,
  },
];
