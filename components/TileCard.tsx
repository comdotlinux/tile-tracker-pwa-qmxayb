
import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@react-navigation/native';

interface TileCardProps {
  id: string;
  text: string;
  emoji: string;
  color: string;
  totalLogs: number;
  lastLoggedAt?: number;
  onPress: () => void;
  onLongPress: () => void;
}

export default function TileCard({
  text,
  emoji,
  color,
  totalLogs,
  lastLoggedAt,
  onPress,
  onLongPress,
}: TileCardProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    // Haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Success animation
    scale.value = withSequence(
      withSpring(1.1, { damping: 10 }),
      withSpring(1, { damping: 15 })
    );
    opacity.value = withSequence(
      withSpring(0.7, { damping: 10 }),
      withSpring(1, { damping: 15 })
    );

    // Call the actual press handler
    runOnJS(onPress)();
  };

  const formatLastLogged = (timestamp?: number) => {
    if (!timestamp) return 'Never logged';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          onLongPress();
        }}
        style={[
          styles.tile,
          { backgroundColor: color },
          Platform.OS !== 'ios' && styles.androidShadow,
        ]}
      >
        <View style={styles.content}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.text} numberOfLines={2}>
            {text}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.count}>{totalLogs} logs</Text>
          <Text style={styles.lastLogged}>{formatLastLogged(lastLoggedAt)}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 12,
  },
  tile: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  },
  androidShadow: {
    elevation: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    alignItems: 'center',
  },
  count: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  lastLogged: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
