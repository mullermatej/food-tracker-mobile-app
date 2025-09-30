import { StyleSheet } from "react-native";

export const buttonStyles = StyleSheet.create({
  addButtonsSection: {
    paddingHorizontal: 24,
    flexDirection: "column",
    gap: 12,
    marginBottom: 40,
  },
  topButtonsRow: {
    flexDirection: "row",
    gap: 16,
  },
  addButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  topRowButton: {
    flex: 1,
  },
  favouritesButton: {
    width: "100%",
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  resetSection: {
    paddingHorizontal: 24,
  },
  resetButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  resetButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
