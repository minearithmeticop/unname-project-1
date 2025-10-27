import { View, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Typography } from '../atoms/Typography';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS, SPACING } from '../../constants';
import { getAllScheduledNotifications } from '../../services/notificationService';

const isExpoGo = Constants.appOwnership === 'expo';
const isWeb = Platform.OS === 'web';
const isNotificationSupported = !isExpoGo && !isWeb;

export function NotificationDebugger() {
  const { theme } = useTheme();
  const [count, setCount] = useState(0);
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#2a2a2a' : '#f5f5f5';
  const textColor = isDark ? COLORS.text.light : COLORS.text.dark;

  useEffect(() => {
    loadCount();
  }, []);

  const loadCount = async () => {
    const notifications = await getAllScheduledNotifications();
    setCount(notifications.length);
  };

  const showScheduled = async () => {
    const notifications = await getAllScheduledNotifications();
    const details = notifications.map((n: any, i: number) => {
      const triggerDate = n.trigger && 'date' in n.trigger ? new Date(n.trigger.date).toLocaleString() : 'Unknown time';
      return `${i + 1}. ${n.content.title}\n   ${n.content.body}\n   ${triggerDate}`;
    }).join('\n\n');
    
    Alert.alert(
      `Scheduled Notifications (${notifications.length})`,
      details || 'No notifications scheduled',
      [{ text: 'OK' }]
    );
  };

  const testNotification = async () => {
    if (!isNotificationSupported) {
      const reason = isWeb 
        ? 'Notifications are not supported on Web.' 
        : 'Notifications require a development build.';
      Alert.alert(
        '⚠️ Not Supported',
        `${reason}\n\nLearn more:\nhttps://docs.expo.dev/develop/development-builds/introduction/`,
        [{ text: 'OK' }]
      );
      return;
    }

    const Notifications = await import('expo-notifications');
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🧪 Test Notification',
        body: 'This is a test notification in 5 seconds',
        data: { test: true },
      },
      trigger: {
        type: 'timeInterval',
        seconds: 5,
      } as any,
    });
    Alert.alert('Test', 'Notification will appear in 5 seconds');
    setTimeout(() => loadCount(), 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
        <Typography variant="body" style={{ color: textColor, marginLeft: 8, fontWeight: '600' }}>
          Notification Debug
        </Typography>
        {!isNotificationSupported && (
          <View style={styles.warningBadge}>
            <Ionicons name="warning" size={14} color="#FF9800" />
            <Typography variant="caption" style={{ color: '#FF9800', marginLeft: 2, fontSize: 10 }}>
              {isWeb ? 'Web' : 'Expo Go'}
            </Typography>
          </View>
        )}
      </View>
      
      {!isNotificationSupported ? (
        <View style={styles.warningBox}>
          <Ionicons name="information-circle-outline" size={16} color="#FF9800" />
          <Typography variant="caption" style={{ color: textColor, marginLeft: 6, flex: 1 }}>
            {isWeb 
              ? 'Notifications not available on Web.' 
              : 'Notifications not available in Expo Go. Use development build.'}
          </Typography>
        </View>
      ) : (
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={testNotification}>
            <Ionicons name="flask-outline" size={16} color={COLORS.primary} />
            <Typography variant="caption" style={{ color: COLORS.primary, marginLeft: 4 }}>
              Test (5s)
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={showScheduled}>
            <Ionicons name="list-outline" size={16} color={COLORS.primary} />
            <Typography variant="caption" style={{ color: COLORS.primary, marginLeft: 4 }}>
              Show All ({count})
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={loadCount}>
            <Ionicons name="refresh-outline" size={16} color={COLORS.primary} />
            <Typography variant="caption" style={{ color: COLORS.primary, marginLeft: 4 }}>
              Refresh
            </Typography>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#FF9800' + '20',
    borderRadius: 4,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FF9800' + '10',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF9800' + '30',
  },
});
