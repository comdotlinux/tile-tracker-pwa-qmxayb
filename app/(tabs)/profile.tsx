
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  Share,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { useTiles } from '@/hooks/useTiles';
import { exportData, importData, clearAllData } from '@/utils/storage';
import * as Clipboard from 'expo-clipboard';

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { tiles, logs, locationPermission, reloadData } = useTiles();
  const [exporting, setExporting] = useState(false);

  const handleExportData = async () => {
    try {
      setExporting(true);
      const data = await exportData();
      
      if (Platform.OS === 'web') {
        // For web, copy to clipboard
        await Clipboard.setStringAsync(data);
        Alert.alert('Success', 'Data copied to clipboard! Save it to a file for backup.');
      } else {
        // For mobile, use share
        await Share.share({
          message: data,
          title: 'Tile Tracker Backup',
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleImportData = async () => {
    Alert.prompt(
      'Import Data',
      'Paste your backup JSON data:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async (text) => {
            if (text) {
              try {
                await importData(text);
                await reloadData();
                Alert.alert('Success', 'Data imported successfully!');
              } catch (error) {
                console.error('Import error:', error);
                Alert.alert('Error', 'Failed to import data. Please check the format.');
              }
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all tiles and logs? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              await reloadData();
              Alert.alert('Success', 'All data cleared');
            } catch (error) {
              console.error('Clear error:', error);
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const StatCard = ({ icon, label, value, color }: any) => (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        },
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <IconSymbol name={icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.dark ? '#999' : '#666' }]}>{label}</Text>
    </View>
  );

  const MenuItem = ({ icon, label, onPress, destructive }: any) => (
    <Pressable
      onPress={onPress}
      style={[
        styles.menuItem,
        {
          backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        },
      ]}
    >
      <View style={styles.menuItemLeft}>
        <IconSymbol
          name={icon}
          size={22}
          color={destructive ? '#FF3B30' : theme.colors.text}
        />
        <Text
          style={[
            styles.menuItemText,
            { color: destructive ? '#FF3B30' : theme.colors.text },
          ]}
        >
          {label}
        </Text>
      </View>
      <IconSymbol name="chevron.right" size={18} color={theme.dark ? '#999' : '#666'} />
    </Pressable>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: theme.dark ? '#999' : '#666' }]}>
          Manage your data and preferences
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <StatCard icon="square.grid.3x3" label="Total Tiles" value={tiles.length} color="#3b82f6" />
        <StatCard icon="clock.fill" label="Total Logs" value={logs.length} color="#10b981" />
      </View>

      {/* Privacy Status */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Privacy</Text>
        <View
          style={[
            styles.privacyCard,
            {
              backgroundColor: theme.dark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            },
          ]}
        >
          <IconSymbol name="lock.fill" size={24} color="#10b981" />
          <View style={styles.privacyText}>
            <Text style={[styles.privacyTitle, { color: theme.colors.text }]}>
              Local-First Storage
            </Text>
            <Text style={[styles.privacySubtitle, { color: theme.dark ? '#999' : '#666' }]}>
              All data is stored on your device. No cloud, no tracking.
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.privacyCard,
            {
              backgroundColor: locationPermission
                ? theme.dark
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(16, 185, 129, 0.1)'
                : theme.dark
                ? 'rgba(255, 59, 48, 0.1)'
                : 'rgba(255, 59, 48, 0.1)',
            },
          ]}
        >
          <IconSymbol
            name="location.fill"
            size={24}
            color={locationPermission ? '#10b981' : '#FF3B30'}
          />
          <View style={styles.privacyText}>
            <Text style={[styles.privacyTitle, { color: theme.colors.text }]}>
              Location Services
            </Text>
            <Text style={[styles.privacySubtitle, { color: theme.dark ? '#999' : '#666' }]}>
              {locationPermission
                ? 'Enabled - 5km precision for privacy'
                : 'Disabled - Enable in system settings'}
            </Text>
          </View>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Data Management</Text>
        <MenuItem
          icon="square.and.arrow.up"
          label="Export Backup"
          onPress={handleExportData}
        />
        <MenuItem
          icon="square.and.arrow.down"
          label="Import Backup"
          onPress={handleImportData}
        />
        <MenuItem
          icon="trash"
          label="Clear All Data"
          onPress={handleClearData}
          destructive
        />
      </View>

      {/* Legal */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Legal</Text>
        <MenuItem
          icon="doc.text"
          label="Privacy Policy"
          onPress={() => router.push('/privacy-policy')}
        />
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About</Text>
        <View
          style={[
            styles.aboutCard,
            {
              backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            },
          ]}
        >
          <Text style={[styles.aboutTitle, { color: theme.colors.text }]}>Tile Tracker</Text>
          <Text style={[styles.aboutVersion, { color: theme.dark ? '#999' : '#666' }]}>
            Version 1.0.0
          </Text>
          <Text style={[styles.aboutDescription, { color: theme.dark ? '#999' : '#666' }]}>
            A privacy-focused activity tracker. Track anything with a single tap. All data stays on
            your device.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.dark ? '#666' : '#999' }]}>
          Made with ❤️ for privacy-conscious users
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: Platform.OS !== 'ios' ? 100 : 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  privacyCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    gap: 12,
  },
  privacyText: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  privacySubtitle: {
    fontSize: 14,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  aboutCard: {
    padding: 20,
    borderRadius: 12,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 14,
    marginBottom: 12,
  },
  aboutDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
  },
});
