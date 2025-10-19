
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
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { EventLog } from '@/types/tile';
import { IconSymbol } from './IconSymbol';
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
    Alert.alert(
      'Delete Tile',
      `Are you sure you want to delete "${tile.text}"? This will also delete all ${tile.totalLogs} logs.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDeleteTile();
            onClose();
          },
        },
      ]
    );
  };

  const handleDeleteLog = (logId: string) => {
    Alert.alert('Delete Log', 'Are you sure you want to delete this log entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDeleteLog(logId),
      },
    ]);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.card }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.tileIcon, { backgroundColor: tile.color }]}>
                <Text style={styles.tileEmoji}>{tile.emoji}</Text>
              </View>
              <View>
                <Text style={[styles.title, { color: theme.colors.text }]}>{tile.text}</Text>
                <Text style={[styles.subtitle, { color: theme.dark ? '#999' : '#666' }]}>
                  {tile.totalLogs} total logs
                </Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          {/* Logs List */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {logs.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📭</Text>
                <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                  No logs yet
                </Text>
                <Text style={[styles.emptySubtext, { color: theme.dark ? '#999' : '#666' }]}>
                  Tap the tile to create your first log
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
                  <View style={styles.logContent}>
                    <View style={styles.logHeader}>
                      <Text style={[styles.logDate, { color: theme.colors.text }]}>
                        {formatDate(log.timestamp)}
                      </Text>
                      <Text style={[styles.logTime, { color: theme.dark ? '#999' : '#666' }]}>
                        {formatTime(log.timestamp)}
                      </Text>
                    </View>
                    {log.location && (
                      <View style={styles.locationContainer}>
                        <IconSymbol
                          name="location.fill"
                          size={14}
                          color={theme.dark ? '#999' : '#666'}
                        />
                        <Text style={[styles.locationText, { color: theme.dark ? '#999' : '#666' }]}>
                          {log.location.geohash} ({log.location.latitude.toFixed(4)},{' '}
                          {log.location.longitude.toFixed(4)})
                        </Text>
                      </View>
                    )}
                  </View>
                  <Pressable
                    onPress={() => handleDeleteLog(log.id)}
                    style={styles.deleteLogButton}
                  >
                    <IconSymbol name="trash" size={18} color="#FF3B30" />
                  </Pressable>
                </View>
              ))
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable
              onPress={handleDeleteTile}
              style={[styles.deleteButton, { backgroundColor: '#FF3B30' }]}
            >
              <IconSymbol name="trash" size={20} color="#FFFFFF" />
              <Text style={styles.deleteButtonText}>Delete Tile</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  tileIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  logContent: {
    flex: 1,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  logDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  logTime: {
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
  },
  deleteLogButton: {
    padding: 8,
  },
  footer: {
    padding: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
