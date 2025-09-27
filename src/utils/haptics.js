import * as Haptics from 'expo-haptics';

export const triggerLightHaptic = () => {
  if (Haptics?.impactAsync) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};

export const triggerMediumHaptic = () => {
  if (Haptics?.impactAsync) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
};

export const triggerWarningHaptic = () => {
  if (Haptics?.notificationAsync) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }
};