
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from './IconSymbol';

interface WelcomeModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ visible, onClose }: WelcomeModalProps) {
  const theme = useTheme();

  const features = [
    {
      icon: 'square.grid.3x3',
      title: 'Create Tiles',
      description: 'Make custom tiles for any activity you want to track',
      color: '#3b82f6',
    },
    {
      icon: 'hand.tap',
      title: 'One-Tap Logging',
      description: 'Simply tap a tile to log an activity instantly',
      color: '#10b981',
    },
    {
      icon: 'clock.fill',
      title: 'View History',
      description: 'See all your logged activities organized by date',
      color: '#f59e0b',
    },
    {
      icon: 'lock.fill',
      title: 'Complete Privacy',
      description: 'All data stays on your device. No cloud, no tracking.',
      color: '#8b5cf6',
    },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.heroEmoji}>🎯</Text>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Welcome to Tile Tracker
            </Text>
            <Text style={[styles.subtitle, { color: theme.dark ? '#999' : '#666' }]}>
              The simplest way to track your daily activities
            </Text>
          </View>

          {/* Features */}
          <View style={styles.features}>
            {features.map((feature, index) => (
              <View
                key={index}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: theme.dark
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.03)',
                  },
                ]}
              >
                <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                  <IconSymbol name={feature.icon as any} size={28} color="#FFFFFF" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDescription, { color: theme.dark ? '#999' : '#666' }]}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Privacy Note */}
          <View
            style={[
              styles.privacyNote,
              {
                backgroundColor: theme.dark
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(16, 185, 129, 0.1)',
              },
            ]}
          >
            <IconSymbol name="checkmark.shield.fill" size={24} color="#10b981" />
            <Text style={[styles.privacyText, { color: theme.colors.text }]}>
              Your data never leaves your device. We don&apos;t collect, track, or store anything.
            </Text>
          </View>
        </ScrollView>

        {/* Get Started Button */}
        <View style={styles.footer}>
          <Pressable
            onPress={onClose}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },
  features: {
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    gap: 16,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  privacyNote: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  button: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
