
export interface Tile {
  id: string;
  text: string;
  emoji: string;
  color: string;
  createdAt: number;
  order: number;
}

export interface EventLog {
  id: string;
  tileId: string;
  timestamp: number;
  location?: {
    latitude: number;
    longitude: number;
    geohash: string; // 5x5 km precision
  };
}

export interface TileWithLogs extends Tile {
  logs: EventLog[];
  lastLoggedAt?: number;
  totalLogs: number;
}
