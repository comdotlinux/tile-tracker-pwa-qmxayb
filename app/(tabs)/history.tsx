
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from '@/components/IconSymbol';
import { useTiles } from '@/hooks/useTiles';
import { EventLog } from '@/types/tile';

interface LogWithTile extends EventLog {
  tileName: string;
  tileEmoji: string;
  tileColor: string;
}

export default function HistoryScreen() {
  const theme = useTheme();
  const { tiles, logs, getTilesWithLogs } = useTiles();
  const [filterTileId, setFilterTileId] = useState<string | null>(null);

  const logsWithTiles: LogWithTile[] = useMemo(() => {
    return logs
      .map((log) => {
        const tile = tiles.find((t) => t.id === log.tileId);
        if (!tile) return null;
        return {
          ...log,
          tileName: tile.text,
          tileEmoji: tile.emoji,
          tileColor: tile.color,
        };
      })
      .filter((log): log is LogWithTile => log !== null)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [logs, tiles]);

  const filteredLogs = filterTileId
    ? logsWithTiles.filter((log) => log.tileId === filterTileId)
    : logsWithTiles;

  const groupedByDate = useMemo(() => {
    const groups: { [key: string]: LogWithTile[] } = {};
    filteredLogs.forEach((log) => {
      const date = new Date(log.timestamp).toLocaleDateString('en-US', {
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
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderLogItem = ({ item }: { item: LogWithTile }) => (
    <View
      style={[
        styles.logItem,
        {
          backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        },
      ]}
    >
      <View style={[styles.logIcon, { backgroundColor: item.tileColor }]}>
        <Text style={styles.logEmoji}>{item.tileEmoji}</Text>
      </View>
      <View style={styles.logContent}>
        <Text style={[styles.logTitle, { color: theme.colors.text }]}>{item.tileName}</Text>
        <View style={styles.logMeta}>
          <Text style={[styles.logTime, { color: theme.dark ? '#999' : '#666' }]}>
            {formatTime(item.timestamp)}
          </Text>
          {item.location && (
            <View style={styles.locationBadge}>
              <IconSymbol name="location.fill" size={12} color={theme.dark ? '#999' : '#666'} />
              <Text style={[styles.locationText, { color: theme.dark ? '#999' : '#666' }]}>
                {item.location.geohash}
              </Text>
            </View>
          )}
        </View>
      </View>
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
      <Text style={[styles.emptyText, { color: theme.dark ? '#999' : '#666' }]}>
        Start logging activities to see your history here
      </Text>
    </View>
  );

  const renderFilterChips = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Pressable
          onPress={() => setFilterTileId(null)}
          style={[
            styles.filterChip,
            {
              backgroundColor:
                filterTileId === null
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
                color: filterTileId === null ? '#FFFFFF' : theme.colors.text,
              },
            ]}
          >
            All
          </Text>
        </Pressable>
        {tiles.map((tile) => (
          <Pressable
            key={tile.id}
            onPress={() => setFilterTileId(tile.id)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  filterTileId === tile.id
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
                  color: filterTileId === tile.id ? '#FFFFFF' : theme.colors.text,
                },
              ]}
            >
              {tile.text}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>History</Text>
        <Text style={[styles.subtitle, { color: theme.dark ? '#999' : '#666' }]}>
          {filteredLogs.length} {filteredLogs.length === 1 ? 'log' : 'logs'}
        </Text>
      </View>

      {/* Filter Chips */}
      {tiles.length > 0 && renderFilterChips()}

      {/* Logs List */}
      {groupedByDate.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={groupedByDate}
          renderItem={renderDateSection}
          keyExtractor={(item) => item.date}
          contentContainerStyle={[
            styles.listContainer,
            Platform.OS !== 'ios' && styles.listContainerWithTabBar,
          ]}
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
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  filterChipEmoji: {
    fontSize: 16,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listContainerWithTabBar: {
    paddingBottom: 100,
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  logIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logEmoji: {
    fontSize: 24,
  },
  logContent: {
    flex: 1,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  logMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logTime: {
    fontSize: 14,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
