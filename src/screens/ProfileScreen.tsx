import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Switch,
  Alert,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storageService, AppSettings } from '../services/storage';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/colors';

export const ProfileScreen: React.FC = () => {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    readingDirection: 'vertical',
    showNSFW: false,
  });

  const handleToggle = async (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await storageService.updateSettings({ [key]: value });
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => Alert.alert('Done', 'Cache cleared successfully!') },
      ]
    );
  };

  const MenuItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement 
  }: { 
    icon: string; 
    title: string; 
    subtitle?: string; 
    onPress?: () => void; 
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity 
      style={[styles.menuItem, { backgroundColor: isDark ? Colors.dark.card : Colors.light.card }]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.menuIcon}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.menuSubtitle, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement || (onPress && <Text style={styles.menuArrow}>›</Text>)}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
          Profile
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={[styles.userCard, { backgroundColor: Colors.primary + '20' }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
              Manga Reader
            </Text>
            <Text style={[styles.userEmail, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
              reader@mangaverse.com
            </Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Reading</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>48</Text>
            <Text style={styles.statLabel}>Chapters Read</Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
            READING SETTINGS
          </Text>
          
          <MenuItem 
            icon="📖"
            title="Reading Direction"
            subtitle={settings.readingDirection === 'vertical' ? 'Vertical Scroll' : 'Horizontal'}
          />
          
          <MenuItem 
            icon="🌙"
            title="Dark Mode"
            rightElement={
              <Switch
                value={settings.theme === 'dark'}
                onValueChange={(value) => handleToggle('theme', value ? 'dark' : 'light')}
                trackColor={{ false: Colors.dark.border, true: Colors.primary }}
                thumbColor="#fff"
              />
            }
          />
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
            GENERAL
          </Text>
          
          <MenuItem icon="🔔" title="Notifications" subtitle="Manage notification preferences" />
          <MenuItem icon="🗑️" title="Clear Cache" subtitle="Free up storage space" onPress={handleClearCache} />
          <MenuItem icon="ℹ️" title="About" subtitle="Version 1.0.0" />
          <MenuItem icon="📜" title="Terms of Service" />
          <MenuItem icon="🔒" title="Privacy Policy" />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: '700',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
  },
  userInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  userName: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  editBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
  },
  editBtnText: {
    color: '#fff',
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: Colors.primary,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  statLabel: {
    color: Colors.dark.textSecondary,
    fontSize: FontSize.xs,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.dark.border,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: 2,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  menuContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  menuTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  menuSubtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 24,
    color: Colors.dark.textMuted,
  },
  logoutBtn: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.status.error + '20',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  logoutText: {
    color: Colors.status.error,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});
