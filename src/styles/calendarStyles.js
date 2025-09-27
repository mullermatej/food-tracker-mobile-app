import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

export const calendarStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  monthNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonText: {
    fontSize: 28,
    fontWeight: "300",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dayHeader: {
    width: width / 7 - 6,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  dayCell: {
    width: width / 7 - 6,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    position: "relative",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dayIndicator: {
    position: "absolute",
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dateSummary: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  dateSummaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  summaryGrid: {
    gap: 8,
  },
  summaryText: {
    fontSize: 14,
  },
});