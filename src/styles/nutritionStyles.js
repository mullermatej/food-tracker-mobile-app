import { StyleSheet } from "react-native";

export const nutritionStyles = StyleSheet.create({
  nutritionSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  nutritionCard: {
    borderRadius: 20,
    padding: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  nutritionItem: {
    alignItems: "center",
    flex: 1,
  },
  nutritionValue: {
    fontSize: 48,
    fontWeight: "800",
    marginBottom: 8,
  },
  nutritionLabel: {
    fontSize: 14,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  divider: {
    width: 1,
    height: 60,
    marginHorizontal: 20,
  },
});
