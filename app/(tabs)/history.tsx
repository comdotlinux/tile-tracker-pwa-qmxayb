
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from '@/components/IconSymbol';
import { useTiles } from '@/hooks/useTiles';
import { EventLog } from '@/types/tile';
import { decodeGeohash } from '@/utils/geohash';

interface LogWithTile extends EventLog {
  tileName: string;
  tileEmoji: string;
  tileColor: string;
}

export default function HistoryScreen() {
  const { tiles, logs } = useTiles();
  const theme = useTheme();
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);

  const logsWithTileInfo = useMemo(() => {
    return logs
      .map((log) => {
        const tile = tiles.find((t) => t.id === log.tileId);
        if (!tile) return null;
        return {
          ...log,
          tileName: tile.text,
          tileEmoji: tile.emoji,
          tileColor: tile.color,
        } as LogWithTile;
      })
      .filter((log): log is LogWithTile => log !== null)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [logs, tiles]);

  const filteredLogs = useMemo(() => {
    if (!selectedTileId) return logsWithTileInfo;
    return logsWithTileInfo.filter((log) => log.tileId === selectedTileId);
  }, [logsWithTileInfo, selectedTileId]);

  const groupedLogs = useMemo(() => {
    const groups: { [key: string]: LogWithTile[] } = {};
    filteredLogs.forEach((log) => {
      const date = new Date(log.timestamp).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(log);
    });
    return Object.entries(groups).map(([date, logs]) => ({ date, logs }));
  }, [filteredLogs]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleOpenInMaps = (geohash: string) => {
    const { latitude, longitude } = decodeGeohash(geohash);
    const url = Platform.select({
      ios: `maps:0,0?q=${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}`,
      default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });
    
    Linking.openURL(url).catch(err => {
      console.error('Error opening maps:', err);
      // Fallback to Google Maps web
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
    });
  };

  const renderLogItem = ({ item }: { item: LogWithTile }) => (
    <View
      style={[
        styles.logItem,
        {
          backgroundColor: theme.dark
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(0,0,0,0.03)',
        },
      ]}
    >
      <View style={styles.logHeader}>
        <View style={[styles.tileIndicator, { backgroundColor: item.tileColor }]}>
          <Text style={styles.tileEmoji}>{item.tileEmoji}</Text>
        </View>
        <View style={styles.logInfo}>
          <Text style={[styles.tileName, { color: theme.colors.text }]}>
            {item.tileName}
          </Text>
          <Text style={[styles.logTime, { color: theme.colors.text, opacity: 0.6 }]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
      {item.location && (
        <Pressable
          onPress={() => handleOpenInMaps(item.location!.geohash)}
          style={[
            styles.locationContainer,
            {
              backgroundColor: theme.dark
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(0,0,0,0.05)',
            },
          ]}
        >
          <IconSymbol
            name="location.fill"
            size={14}
            color={theme.colors.primary}
          />
          <View style={styles.locationText}>
            <Text style={[styles.locationLabel, { color: theme.colors.text }]}>
              {item.location.geohash}
            </Text>
            <Text style={[styles.locationHint, { color: theme.colors.primary }]}>
              Tap to open in Maps
            </Text>
          </View>
          <IconSymbol
            name="chevron.right"
            size={14}
            color={theme.colors.text}
            style={{ opacity: 0.4 }}
          />
        </Pressable>
      )}
    </View>
  );

  const renderDateSection = ({ item }: { item: { date: string; logs: LogWithTile[] } }) => (
    <View style={styles.dateSection}>
      <Text style={[styles.dateHeader, { color: theme.colors.text }]}>{item.date}</Text>
      {item.logs.map((log) => (
        <View key={log.id}>{renderLogItem({ item: log })}</View>
      ))}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📊</Text>
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No History Yet</Text>
      <Text style={[styles.emptyDescription, { color: theme.colors.text, opacity: 0.6 }]}>
        Start logging activities by tapping tiles on the home screen
      </Text>
    </View>
  );

  const renderFilterChips = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterContainer}
    >
      <Pressable
        onPress={() => setSelectedTileId(null)}
        style={[
          styles.filterChip,
          {
            backgroundColor: !selectedTileId
              ? theme.colors.primary
              : theme.dark
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(0,0,0,0.05)',
          },
        ]}
      >
        <Text
          style={[
            styles.filterChipText,
            {
              color: !selectedTileId ? '#FFFFFF' : theme.colors.text,
            },
          ]}
        >
          All
        </Text>
      </Pressable>
      {tiles.map((tile) => (
        <Pressable
          key={tile.id}
          onPress={() => setSelectedTileId(tile.id)}
          style={[
            styles.filterChip,
            {
              backgroundColor:
                selectedTileId === tile.id
                  ? tile.color
                  : theme.dark
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.05)',
            },
          ]}
        >
          <Text style={styles.filterChipEmoji}>{tile.emoji}</Text>
          <Text
            style={[
              styles.filterChipText,
              {
                color: selectedTileId === tile.id ? '#FFFFFF' : theme.colors.text,
              },
            ]}
          >
            {tile.text}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {tiles.length > 0 && renderFilterChips()}
      {filteredLogs.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={groupedLogs}
          renderItem={renderDateSection}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  filterChipEmoji: {
    fontSize: 16,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  logItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tileIndicator: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tileEmoji: {
    fontSize: 24,
  },
  logInfo: {
    flex: 1,
  },
  tileName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  logTime: {
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginTop: 4,
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  locationHint: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
  },
});
