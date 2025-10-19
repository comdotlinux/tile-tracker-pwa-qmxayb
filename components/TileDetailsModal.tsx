
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from './IconSymbol';
import { EventLog } from '@/types/tile';
import { decodeGeohash } from '@/utils/geohash';

interface TileDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  tile: {
    id: string;
    text: string;
    emoji: string;
    color: string;
    totalLogs: number;
  } | null;
  logs: EventLog[];
  onDeleteTile: () => void;
  onDeleteLog: (logId: string) => void;
}

export default function TileDetailsModal({
  visible,
  onClose,
  tile,
  logs,
  onDeleteTile,
  onDeleteLog,
}: TileDetailsModalProps) {
  const theme = useTheme();

  if (!tile) return null;

  const handleDeleteTile = () => {
    onDeleteTile();
  };

  const handleDeleteLog = (logId: string) => {
    Alert.alert(
      'Delete Log',
      'Are you sure you want to delete this log entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeleteLog(logId),
        },
      ]
    );
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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.card }]}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: tile.color }]}>
            <View style={styles.headerContent}>
              <Text style={styles.headerEmoji}>{tile.emoji}</Text>
              <Text style={styles.headerTitle}>{tile.text}</Text>
              <Text style={styles.headerSubtitle}>{tile.totalLogs} total logs</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Logs List */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {logs.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                  No logs yet. Tap the tile to create your first log!
                </Text>
              </View>
            ) : (
              logs.map((log) => (
                <View
                  key={log.id}
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
                    <View style={styles.logTime}>
                      <IconSymbol
                        name="clock"
                        size={16}
                        color={theme.colors.text}
                        style={{ opacity: 0.6 }}
                      />
                      <Text style={[styles.logDate, { color: theme.colors.text }]}>
                        {formatDate(log.timestamp)}
                      </Text>
                      <Text style={[styles.logTimeText, { color: theme.colors.text }]}>
                        {formatTime(log.timestamp)}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => handleDeleteLog(log.id)}
                      style={styles.deleteButton}
                    >
                      <IconSymbol name="trash" size={18} color="#FF3B30" />
                    </Pressable>
                  </View>
                  {log.location && (
                    <Pressable
                      onPress={() => handleOpenInMaps(log.location!.geohash)}
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
                        size={16}
                        color={theme.colors.primary}
                      />
                      <View style={styles.locationText}>
                        <Text style={[styles.locationLabel, { color: theme.colors.text }]}>
                          Location: {log.location.geohash}
                        </Text>
                        <Text style={[styles.locationHint, { color: theme.colors.primary }]}>
                          Tap to open in Maps
                        </Text>
                      </View>
                      <IconSymbol
                        name="chevron.right"
                        size={16}
                        color={theme.colors.text}
                        style={{ opacity: 0.4 }}
                      />
                    </Pressable>
                  )}
                </View>
              ))
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable
              onPress={handleDeleteTile}
              style={[styles.deleteButton, styles.deleteTileButton]}
            >
              <IconSymbol name="trash" size={20} color="#FF3B30" />
              <Text style={styles.deleteTileText}>Delete Tile</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  header: {
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.6,
  },
  logItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  logDate: {
    fontSize: 15,
    fontWeight: '600',
  },
  logTimeText: {
    fontSize: 14,
    opacity: 0.7,
  },
  deleteButton: {
    padding: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  locationHint: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  deleteTileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    gap: 8,
  },
  deleteTileText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
});
