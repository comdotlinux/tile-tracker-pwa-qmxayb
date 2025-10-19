
import { useState, useEffect, useCallback } from 'react';
import { Tile, EventLog, TileWithLogs } from '@/types/tile';
import { saveTiles, loadTiles, saveEventLogs, loadEventLogs } from '@/utils/storage';
import * as Location from 'expo-location';
import { encodeGeohash } from '@/utils/geohash';

export function useTiles() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  // Load data on mount
  useEffect(() => {
    loadData();
    requestLocationPermission();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [loadedTiles, loadedLogs] = await Promise.all([
        loadTiles(),
        loadEventLogs(),
      ]);
      setTiles(loadedTiles);
      setLogs(loadedLogs);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      console.log('Location permission:', status);
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const addTile = useCallback(async (text: string, emoji: string, color: string) => {
    const newTile: Tile = {
      id: Date.now().toString(),
      text,
      emoji,
      color,
      createdAt: Date.now(),
      order: tiles.length,
    };
    const updatedTiles = [...tiles, newTile];
    setTiles(updatedTiles);
    await saveTiles(updatedTiles);
    console.log('Tile added:', newTile);
  }, [tiles]);

  const deleteTile = useCallback(async (tileId: string) => {
    const updatedTiles = tiles.filter(t => t.id !== tileId);
    const updatedLogs = logs.filter(l => l.tileId !== tileId);
    setTiles(updatedTiles);
    setLogs(updatedLogs);
    await Promise.all([
      saveTiles(updatedTiles),
      saveEventLogs(updatedLogs),
    ]);
    console.log('Tile deleted:', tileId);
  }, [tiles, logs]);

  const logEvent = useCallback(async (tileId: string) => {
    let location = undefined;

    if (locationPermission) {
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        location = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          geohash: encodeGeohash(loc.coords.latitude, loc.coords.longitude, 4),
        };
        console.log('Location captured:', location);
      } catch (error) {
        console.error('Error getting location:', error);
      }
    }

    const newLog: EventLog = {
      id: Date.now().toString(),
      tileId,
      timestamp: Date.now(),
      location,
    };

    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);
    await saveEventLogs(updatedLogs);
    console.log('Event logged:', newLog);
    return newLog;
  }, [logs, locationPermission]);

  const getLogsForTile = useCallback((tileId: string): EventLog[] => {
    return logs.filter(log => log.tileId === tileId).sort((a, b) => b.timestamp - a.timestamp);
  }, [logs]);

  const getTilesWithLogs = useCallback((): TileWithLogs[] => {
    return tiles.map(tile => {
      const tileLogs = getLogsForTile(tile.id);
      return {
        ...tile,
        logs: tileLogs,
        lastLoggedAt: tileLogs.length > 0 ? tileLogs[0].timestamp : undefined,
        totalLogs: tileLogs.length,
      };
    });
  }, [tiles, getLogsForTile]);

  const deleteLog = useCallback(async (logId: string) => {
    const updatedLogs = logs.filter(l => l.id !== logId);
    setLogs(updatedLogs);
    await saveEventLogs(updatedLogs);
    console.log('Log deleted:', logId);
  }, [logs]);

  return {
    tiles,
    logs,
    loading,
    locationPermission,
    addTile,
    deleteTile,
    logEvent,
    getLogsForTile,
    getTilesWithLogs,
    deleteLog,
    reloadData: loadData,
  };
}
