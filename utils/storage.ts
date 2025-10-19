
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tile, EventLog } from '@/types/tile';

const TILES_KEY = '@tile_tracker_tiles';
const LOGS_KEY = '@tile_tracker_logs';

// Tiles
export async function saveTiles(tiles: Tile[]): Promise<void> {
  try {
    await AsyncStorage.setItem(TILES_KEY, JSON.stringify(tiles));
    console.log('Tiles saved successfully');
  } catch (error) {
    console.error('Error saving tiles:', error);
    throw error;
  }
}

export async function loadTiles(): Promise<Tile[]> {
  try {
    const data = await AsyncStorage.getItem(TILES_KEY);
    if (data) {
      const tiles = JSON.parse(data);
      console.log('Tiles loaded:', tiles.length);
      return tiles;
    }
    return [];
  } catch (error) {
    console.error('Error loading tiles:', error);
    return [];
  }
}

// Event Logs
export async function saveEventLogs(logs: EventLog[]): Promise<void> {
  try {
    await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    console.log('Event logs saved successfully');
  } catch (error) {
    console.error('Error saving event logs:', error);
    throw error;
  }
}

export async function loadEventLogs(): Promise<EventLog[]> {
  try {
    const data = await AsyncStorage.getItem(LOGS_KEY);
    if (data) {
      const logs = JSON.parse(data);
      console.log('Event logs loaded:', logs.length);
      return logs;
    }
    return [];
  } catch (error) {
    console.error('Error loading event logs:', error);
    return [];
  }
}

// Backup & Restore
export async function exportData(): Promise<string> {
  try {
    const tiles = await loadTiles();
    const logs = await loadEventLogs();
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      tiles,
      logs,
    };
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
}

export async function importData(jsonString: string): Promise<void> {
  try {
    const data = JSON.parse(jsonString);
    if (data.tiles && Array.isArray(data.tiles)) {
      await saveTiles(data.tiles);
    }
    if (data.logs && Array.isArray(data.logs)) {
      await saveEventLogs(data.logs);
    }
    console.log('Data imported successfully');
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
}

export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([TILES_KEY, LOGS_KEY]);
    console.log('All data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
}
