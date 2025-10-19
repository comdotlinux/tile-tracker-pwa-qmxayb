
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconSymbol } from '@/components/IconSymbol';
import TileCard from '@/components/TileCard';
import AddTileModal from '@/components/AddTileModal';
import TileDetailsModal from '@/components/TileDetailsModal';
import WelcomeModal from '@/components/WelcomeModal';
import { useTiles } from '@/hooks/useTiles';
import { TileWithLogs } from '@/types/tile';

const WELCOME_SHOWN_KEY = '@tile_tracker_welcome_shown';

export default function HomeScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [selectedTile, setSelectedTile] = useState<TileWithLogs | null>(null);
  const { tiles, loading, addTile, deleteTile, logEvent, getTilesWithLogs, deleteLog } = useTiles();
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasShown = await AsyncStorage.getItem(WELCOME_SHOWN_KEY);
      if (!hasShown) {
        setShowWelcomeModal(true);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
    }
  };

  const handleWelcomeClose = async () => {
    try {
      await AsyncStorage.setItem(WELCOME_SHOWN_KEY, 'true');
      setShowWelcomeModal(false);
    } catch (error) {
      console.error('Error saving welcome shown flag:', error);
    }
  };

  const handleTilePress = async (tileId: string) => {
    await logEvent(tileId);
  };

  const handleTileLongPress = (tile: TileWithLogs) => {
    setSelectedTile(tile);
  };

  const handleAddTile = async (text: string, emoji: string, color: string) => {
    await addTile(text, emoji, color);
  };

  const handleDeleteTile = async () => {
    if (selectedTile) {
      Alert.alert(
        'Delete Tile',
        `Are you sure you want to delete "${selectedTile.text}"? This will also delete all logs for this tile.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await deleteTile(selectedTile.id);
              setSelectedTile(null);
            },
          },
        ]
      );
    }
  };

  const handleDeleteLog = async (logId: string) => {
    await deleteLog(logId);
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => setShowAddModal(true)}
      style={({ pressed }) => [
        styles.headerButton,
        pressed && styles.headerButtonPressed,
      ]}
    >
      <IconSymbol name="plus" size={24} color={theme.colors.primary} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <View style={styles.headerLeft}>
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Tile Tracker</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📝</Text>
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Tiles Yet</Text>
      <Text style={[styles.emptyDescription, { color: theme.colors.text, opacity: 0.6 }]}>
        Create your first tile to start tracking activities
      </Text>
      <Pressable
        onPress={() => setShowAddModal(true)}
        style={[styles.emptyButton, { backgroundColor: theme.colors.primary }]}
      >
        <IconSymbol name="plus" size={20} color="#FFFFFF" />
        <Text style={styles.emptyButtonText}>Create Tile</Text>
      </Pressable>
    </View>
  );

  const renderTile = ({ item }: { item: TileWithLogs }) => (
    <TileCard
      id={item.id}
      text={item.text}
      emoji={item.emoji}
      color={item.color}
      totalLogs={item.totalLogs}
      lastLoggedAt={item.lastLoggedAt}
      onPress={() => handleTilePress(item.id)}
      onLongPress={() => handleTileLongPress(item)}
    />
  );

  const tilesWithLogs = getTilesWithLogs();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: renderHeaderLeft,
          headerRight: renderHeaderRight,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerShadowVisible: false,
        }}
      />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading...</Text>
          </View>
        ) : tilesWithLogs.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={tilesWithLogs}
            renderItem={renderTile}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Floating Add Button - Always visible when tiles exist */}
        {tilesWithLogs.length > 0 && (
          <Pressable
            onPress={() => setShowAddModal(true)}
            style={[
              styles.floatingButton,
              { backgroundColor: theme.colors.primary },
              Platform.OS !== 'ios' && styles.floatingButtonAndroid,
            ]}
          >
            <IconSymbol name="plus" size={28} color="#FFFFFF" />
          </Pressable>
        )}

        <AddTileModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddTile}
        />

        <TileDetailsModal
          visible={selectedTile !== null}
          onClose={() => setSelectedTile(null)}
          tile={selectedTile}
          logs={selectedTile ? selectedTile.logs : []}
          onDeleteTile={handleDeleteTile}
          onDeleteLog={handleDeleteLog}
        />

        <WelcomeModal visible={showWelcomeModal} onClose={handleWelcomeClose} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerLeft: {
    marginLeft: Platform.OS === 'ios' ? 0 : 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerButton: {
    padding: 8,
    marginRight: Platform.OS === 'ios' ? 0 : 8,
    borderRadius: 8,
  },
  headerButtonPressed: {
    opacity: 0.6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Extra space for floating button
  },
  row: {
    justifyContent: 'space-between',
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
    marginBottom: 32,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
  },
  floatingButtonAndroid: {
    elevation: 8,
  },
});
