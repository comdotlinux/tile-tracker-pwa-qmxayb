
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
  const theme = useTheme();
  const router = useRouter();
  const {
    tiles,
    loading,
    addTile,
    deleteTile,
    logEvent,
    getLogsForTile,
    getTilesWithLogs,
    deleteLog,
  } = useTiles();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [welcomeModalVisible, setWelcomeModalVisible] = useState(false);
  const [selectedTile, setSelectedTile] = useState<TileWithLogs | null>(null);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasShownWelcome = await AsyncStorage.getItem(WELCOME_SHOWN_KEY);
      if (!hasShownWelcome) {
        setWelcomeModalVisible(true);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
    }
  };

  const handleWelcomeClose = async () => {
    try {
      await AsyncStorage.setItem(WELCOME_SHOWN_KEY, 'true');
      setWelcomeModalVisible(false);
    } catch (error) {
      console.error('Error saving welcome shown:', error);
      setWelcomeModalVisible(false);
    }
  };

  const tilesWithLogs = getTilesWithLogs();

  const handleTilePress = async (tileId: string) => {
    await logEvent(tileId);
    console.log('Event logged for tile:', tileId);
  };

  const handleTileLongPress = (tile: TileWithLogs) => {
    setSelectedTile(tile);
    setDetailsModalVisible(true);
  };

  const handleAddTile = async (text: string, emoji: string, color: string) => {
    await addTile(text, emoji, color);
  };

  const handleDeleteTile = async () => {
    if (selectedTile) {
      await deleteTile(selectedTile.id);
      setSelectedTile(null);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    await deleteLog(logId);
    // Refresh selected tile data
    if (selectedTile) {
      const updatedTiles = getTilesWithLogs();
      const updatedTile = updatedTiles.find(t => t.id === selectedTile.id);
      if (updatedTile) {
        setSelectedTile(updatedTile);
      }
    }
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => setAddModalVisible(true)}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="plus" color={theme.colors.primary} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => router.push('/profile')}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="gear" color={theme.colors.primary} />
    </Pressable>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🎯</Text>
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        Create Your First Tile
      </Text>
      <Text style={[styles.emptyText, { color: theme.dark ? '#999' : '#666' }]}>
        Tiles help you track activities with a single tap. Create one to get started!
      </Text>
      <Pressable
        onPress={() => setAddModalVisible(true)}
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

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Tile Tracker',
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {tilesWithLogs.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={tilesWithLogs}
            renderItem={renderTile}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={[
              styles.listContainer,
              Platform.OS !== 'ios' && styles.listContainerWithTabBar,
            ]}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <WelcomeModal visible={welcomeModalVisible} onClose={handleWelcomeClose} />

      <AddTileModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={handleAddTile}
      />

      <TileDetailsModal
        visible={detailsModalVisible}
        onClose={() => {
          setDetailsModalVisible(false);
          setSelectedTile(null);
        }}
        tile={selectedTile}
        logs={selectedTile ? getLogsForTile(selectedTile.id) : []}
        onDeleteTile={handleDeleteTile}
        onDeleteLog={handleDeleteLog}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  listContainerWithTabBar: {
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  headerButtonContainer: {
    padding: 6,
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
    marginBottom: 32,
    lineHeight: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
