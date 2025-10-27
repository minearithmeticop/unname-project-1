import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Check if running in Expo Go or Web
const isExpoGo = Constants.appOwnership === 'expo';
const isWeb = Platform.OS === 'web';
const isNotificationSupported = !isExpoGo && !isWeb;

// Lazy load notifications module
let Notifications: any = null;

// Configure notification handler (only if not Expo Go and not Web)
if (isNotificationSupported) {
  // Dynamic import to avoid loading in Expo Go or Web
  import('expo-notifications').then((module) => {
    Notifications = module;
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }).catch((error) => {
    console.warn('Failed to load expo-notifications:', error);
  });
}

export async function registerForPushNotificationsAsync() {
  // Skip if running in Expo Go or Web
  if (!isNotificationSupported) {
    console.log('⚠️ Notifications not supported in Expo Go or Web. Use development build on mobile.');
    return false;
  }

  // Ensure module is loaded
  if (!Notifications) {
    const module = await import('expo-notifications');
    Notifications = module;
  }

  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }

  return finalStatus === 'granted';
}

export async function scheduleTaskNotification(
  taskTitle: string,
  startTime: string, // HH:MM format
  taskId: string
): Promise<string | undefined> {
  // Skip if running in Expo Go or Web
  if (!isNotificationSupported) {
    console.log('⚠️ Cannot schedule notification in Expo Go or Web');
    return undefined;
  }

  // Ensure module is loaded
  if (!Notifications) {
    const module = await import('expo-notifications');
    Notifications = module;
  }

  try {
    // Parse time
    const [hours, minutes] = startTime.split(':').map(Number);
    const now = new Date();
    const scheduledDate = new Date();
    scheduledDate.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledDate.getTime() <= now.getTime()) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Task Reminder',
        body: `It's time to start: ${taskTitle}`,
        data: { taskId },
        sound: true,
      },
      trigger: {
        type: 'date',
        date: scheduledDate,
      } as any,
    });

    console.log('Notification scheduled:', notificationId, 'for', scheduledDate);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return undefined;
  }
}

export async function cancelTaskNotification(notificationId: string) {
  if (!isNotificationSupported) return;
  
  // Ensure module is loaded
  if (!Notifications) {
    const module = await import('expo-notifications');
    Notifications = module;
  }
  
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('Notification cancelled:', notificationId);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
}

export async function cancelAllNotifications() {
  if (!isNotificationSupported) return;
  
  // Ensure module is loaded
  if (!Notifications) {
    const module = await import('expo-notifications');
    Notifications = module;
  }
  
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getAllScheduledNotifications() {
  if (!isNotificationSupported) return [];
  
  // Ensure module is loaded
  if (!Notifications) {
    const module = await import('expo-notifications');
    Notifications = module;
  }
  
  return await Notifications.getAllScheduledNotificationsAsync();
}
