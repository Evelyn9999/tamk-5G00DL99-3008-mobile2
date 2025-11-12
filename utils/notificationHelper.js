import * as Notifications from 'expo-notifications';

export async function scheduleDailyReminder() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission not granted for notifications');
    return;
  }

  // cancel old notifications so we don't get duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🥗 Time for a healthy bowl!',
      body: 'Check your favorite bowls or try something new today!',
    },
    trigger: { hour: 12, minute: 0, repeats: true },
  });

  console.log('✅ Daily reminder scheduled!');
}
