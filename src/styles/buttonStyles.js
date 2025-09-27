import { StyleSheet } from "react-native";

export const buttonStyles = StyleSheet.create({
  addButtonsSection: {
    paddingHorizontal: 24,
    flexDirection: "row",
    gap: 16,
    marginBottom: 40,
  },
  addButton: {
    flex: 1,
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
