import React from "react";
import { View, TouchableOpacity, Text, Animated } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { supplementStyles } from "../../styles/supplementStyles";
import AppSymbol from "./AppSymbol";

export const SupplementSection = ({
  todayData,
  onToggleCreatine,
  onToggleFishOil,
}) => {
  const theme = useTheme();
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <View style={supplementStyles.supplementsSection}>
      <Text style={[supplementStyles.sectionTitle, { color: theme.text }]}>
        Daily Supplements
      </Text>

      <AnimatedTouchableOpacity
        style={[
          supplementStyles.toggleButton,
          {
            backgroundColor:
              theme.animated?.cardBackground || theme.cardBackground,
            borderColor: theme.animated?.border || theme.border,
            shadowColor: theme.shadow,
          },
          todayData.creatine && {
            borderColor: theme.animated?.success || theme.success,
            backgroundColor:
              theme.animated?.successBackground || theme.successBackground,
          },
        ]}
        onPress={onToggleCreatine}
      >
        <View style={supplementStyles.toggleContent}>
          <View style={{ width: 24, marginRight: 16, alignItems: "center" }}>
            <AppSymbol
              name="pills.fill"
              size={24}
              color={todayData.creatine ? theme.success : theme.textSecondary}
              fallback={
                <Animated.Text
                  style={[
                    supplementStyles.toggleIcon,
                    {
                      color: todayData.creatine
                        ? theme.animated?.success || theme.success
                        : theme.animated?.textSecondary || theme.textSecondary,
                    },
                  ]}
                >
                  💊
                </Animated.Text>
              }
            />
          </View>
          <Animated.Text
            style={[
              supplementStyles.toggleText,
              { color: theme.animated?.textSecondary || theme.textSecondary },
              todayData.creatine && {
                color: theme.animated?.success || theme.success,
                fontWeight: "600",
              },
            ]}
          >
            Creatine
          </Animated.Text>
        </View>
        <Animated.View
          style={[
            supplementStyles.toggleIndicator,
            {
              backgroundColor: theme.animated?.border || theme.border,
              borderColor: theme.animated?.border || theme.border,
            },
            todayData.creatine && {
              backgroundColor: theme.animated?.success || theme.success,
              borderColor: theme.animated?.success || theme.success,
            },
          ]}
        />
      </AnimatedTouchableOpacity>

      <AnimatedTouchableOpacity
        style={[
          supplementStyles.toggleButton,
          {
            backgroundColor:
              theme.animated?.cardBackground || theme.cardBackground,
            borderColor: theme.animated?.border || theme.border,
            shadowColor: theme.shadow,
          },
          todayData.fishOil && {
            borderColor: theme.animated?.success || theme.success,
            backgroundColor:
              theme.animated?.successBackground || theme.successBackground,
          },
        ]}
        onPress={onToggleFishOil}
      >
        <View style={supplementStyles.toggleContent}>
          <View style={{ width: 24, marginRight: 16, alignItems: "center" }}>
            <AppSymbol
              name="fish.fill"
              size={24}
              color={todayData.fishOil ? theme.success : theme.textSecondary}
              fallback={
                <Animated.Text
                  style={[
                    supplementStyles.toggleIcon,
                    {
                      color: todayData.fishOil
                        ? theme.animated?.success || theme.success
                        : theme.animated?.textSecondary || theme.textSecondary,
                    },
                  ]}
                >
                  🐟
                </Animated.Text>
              }
            />
          </View>
          <Animated.Text
            style={[
              supplementStyles.toggleText,
              { color: theme.animated?.textSecondary || theme.textSecondary },
              todayData.fishOil && {
                color: theme.animated?.success || theme.success,
                fontWeight: "600",
              },
            ]}
          >
            Fish Oil
          </Animated.Text>
        </View>
        <Animated.View
          style={[
            supplementStyles.toggleIndicator,
            {
              backgroundColor: theme.animated?.border || theme.border,
              borderColor: theme.animated?.border || theme.border,
            },
            todayData.fishOil && {
              backgroundColor: theme.animated?.success || theme.success,
              borderColor: theme.animated?.success || theme.success,
            },
          ]}
        />
      </AnimatedTouchableOpacity>
    </View>
  );
};
