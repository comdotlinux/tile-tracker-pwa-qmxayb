
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';

export default function PrivacyPolicyScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={theme.colors.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Privacy Policy</Text>
        <Text style={[styles.date, { color: theme.dark ? '#999' : '#666' }]}>
          Last Updated: January 2025
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Our Commitment to Privacy
          </Text>
          <Text style={[styles.paragraph, { color: theme.dark ? '#ccc' : '#333' }]}>
            Tile Tracker is built with privacy as the foundation. We believe your personal data
            belongs to you and should stay on your device.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Data Collection
          </Text>
          <Text style={[styles.paragraph, { color: theme.dark ? '#ccc' : '#333' }]}>
            We do not collect, transmit, or store any of your data on external servers. All data
            remains on your device:
          </Text>
          <Text style={[styles.bullet, { color: theme.dark ? '#ccc' : '#333' }]}>
            - Tile names and configurations
          </Text>
          <Text style={[styles.bullet, { color: theme.dark ? '#ccc' : '#333' }]}>
            - Activity logs and timestamps
          </Text>
          <Text style={[styles.bullet, { color: theme.dark ? '#ccc' : '#333' }]}>
            - Location data (if you grant permission)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Location Services
          </Text>
          <Text style={[styles.paragraph, { color: theme.dark ? '#ccc' : '#333' }]}>
            If you grant location permission, we use it to add location context to your activity
            logs. Location data is:
          </Text>
          <Text style={[styles.bullet, { color: theme.dark ? '#ccc' : '#333' }]}>
            - Stored only on your device
          </Text>
          <Text style={[styles.bullet, { color: theme.dark ? '#ccc' : '#333' }]}>
            - Reduced to 5km precision (geohash) for privacy
          </Text>
          <Text style={[styles.bullet, { color: theme.dark ? '#ccc' : '#333' }]}>
            - Never transmitted to any server
          </Text>
          <Text style={[styles.bullet, { color: theme.dark ? '#ccc' : '#333' }]}>
            - Completely optional
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            No Analytics or Tracking
          </Text>
          <Text style={[styles.paragraph, { color: theme.dark ? '#ccc' : '#333' }]}>
            We do not use any analytics, tracking, or monitoring tools. We don&apos;t know:
          </Text>
          <Text style={[styles.bullet, { color: theme.dark ? '#ccc' : '#333' }]}>
            - How you use the app
          </Text>
          <Text style={[styles.bullet, { color: theme.dark ? '#ccc' : '#333' }]}>
            - What tiles you create
          </Text>
          <Text style={[styles.bullet, { color: theme.dark ? '#ccc' : '#333' }]}>
            - When you log activities
          </Text>
          <Text style={[styles.bullet, { color: theme.dark ? '#ccc' : '#333' }]}>
            - Where you are located
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Data Export and Backup
          </Text>
          <Text style={[styles.paragraph, { color: theme.dark ? '#ccc' : '#333' }]}>
            You have complete control over your data. You can export all your data at any time
            through the Settings screen. The exported data is in JSON format and can be:
          </Text>
          <Text style={[styles.bullet, { color: theme.dark ? '#ccc' : '#333' }]}>
            - Saved to your preferred cloud storage
          </Text>
          <Text style={[styles.bullet, { color: theme.dark ? '#ccc' : '#333' }]}>
            - Imported back into the app
          </Text>
          <Text style={[styles.bullet, { color: theme.dark ? '#ccc' : '#333' }]}>
            - Analyzed in spreadsheet software
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>GDPR Compliance</Text>
          <Text style={[styles.paragraph, { color: theme.dark ? '#ccc' : '#333' }]}>
            Since we don&apos;t collect any personal data, we are GDPR compliant by design. You
            have complete control over your data at all times.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Changes to This Policy
          </Text>
          <Text style={[styles.paragraph, { color: theme.dark ? '#ccc' : '#333' }]}>
            If we make changes to this privacy policy, we will update the date at the top of this
            page. Since we don&apos;t collect data, any changes will only make our privacy
            protections stronger.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Contact</Text>
          <Text style={[styles.paragraph, { color: theme.dark ? '#ccc' : '#333' }]}>
            If you have questions about this privacy policy, please contact us through the app
            store review system.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 16,
  },
});
