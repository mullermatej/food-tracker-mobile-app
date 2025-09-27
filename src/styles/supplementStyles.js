import { StyleSheet } from "react-native";

export const supplementStyles = StyleSheet.create({
  supplementsSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  toggleButton: {
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
  },
  toggleContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "500",
  },
  toggleIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
});
