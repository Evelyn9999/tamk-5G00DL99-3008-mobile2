import * as Notifications from 'expo-notifications';

export async function scheduleDailyReminder() {
  await Notifications.requestPermissionsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🥗 Time for a healthy bowl!',
      body: 'Check your favorite bowls or try something new today!',
    },
    trigger: { hour: 12, minute: 0, repeats: true },
  });
}
