import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, Modal, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { emit } from "../utils/eventBus";

const DUMMY_FAVOURITES = [
  {
    id: 1,
    name: "Banana",
    calories: 100,
    protein: 2,
  },
  {
    id: 2,
    name: "Greek Yogurt",
    calories: 150,
    protein: 15,
  },
  {
    id: 3,
    name: "Chicken Breast",
    calories: 200,
    protein: 30,
  },
  {
    id: 4,
    name: "Oatmeal",
    calories: 300,
    protein: 10,
  },
];

export const FavouritesScreen = ({ navigation }) => {
  const theme = useTheme();
  const [favourites, setFavourites] = useState(DUMMY_FAVOURITES);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCalories, setNewCalories] = useState("");
  const [newProtein, setNewProtein] = useState("");

  const handleRemoveItem = (id) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your favourites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setFavourites(favourites.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };

  const handleAddToToday = (item) => {
    // Emit event so Home can update without leaving this screen
    emit("add-from-favourites", item);
    Alert.alert("Added", `${item.name} added to today.`);
  };

  const openAddModal = () => setIsAddOpen(true);
  const closeAddModal = () => {
    setIsAddOpen(false);
    setNewName("");
    setNewCalories("");
    setNewProtein("");
  };

  const confirmAddItem = () => {
    const name = newName.trim();
    if (!name) {
      Alert.alert("Missing name", "Please enter a food name.");
      return;
    }
    const calories = Number(newCalories) || 0;
    const protein = Number(newProtein) || 0;
    const newId = favourites.length
      ? favourites.reduce((max, it) => Math.max(max, it.id), favourites[0].id) + 1
      : 1;
    const newItem = { id: newId, name, calories, protein };
    setFavourites((prev) => [...prev, newItem]);
    closeAddModal();
  };

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    backHit: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
    backText: { fontSize: 18, color: theme.text },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
      textAlign: "center",
      flex: 1,
    },
    listContent: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      paddingBottom: 32,
    },
    item: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 14,
      marginBottom: 12,
    },
    itemRow: { flexDirection: "row", alignItems: "center" },
    itemTextWrap: { flex: 1 },
    itemName: { fontSize: 16, fontWeight: "600", color: theme.text },
    itemMeta: { marginTop: 4, fontSize: 13, color: theme.textSecondary },
    actions: { marginLeft: 12, alignItems: "flex-end" },
    addPill: {
      backgroundColor: theme.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 6,
    },
    addPillText: { color: "#ffffff", fontSize: 13, fontWeight: "600" },
    removeLink: { padding: 4 },
    removeLinkText: { color: theme.textSecondary, fontSize: 12 },
    emptyWrap: {
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 48,
    },
    emptyEmoji: { fontSize: 36, marginBottom: 8 },
    emptyTitle: { fontSize: 18, fontWeight: "600", color: theme.text, marginBottom: 6, textAlign: "center" },
    emptyText: { fontSize: 14, color: theme.textSecondary, textAlign: "center" },
    primaryButton: {
      backgroundColor: theme.primary,
      alignSelf: "stretch",
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 16,
    },
    primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
    addModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.3)",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      position: "relative",
    },
    overlayDismiss: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
    },
    addModalCard: {
      width: "100%",
      borderRadius: 16,
      backgroundColor: theme.cardBackground,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16,
    },
    modalTitle: { fontSize: 18, fontWeight: "700", color: theme.text, marginBottom: 12 },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: theme.text,
      marginBottom: 10,
      backgroundColor: theme.background,
    },
  row: { flexDirection: "row" },
    rowItem: { flex: 1 },
  modalActions: { flexDirection: "row", marginTop: 8 },
    secondaryButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
      backgroundColor: theme.background,
    },
    secondaryText: { color: theme.text, fontWeight: "600" },
    confirmButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: theme.primary,
      alignItems: "center",
    },
    confirmText: { color: "#fff", fontWeight: "700" },
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backHit} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Favourites</Text>
          <View style={{ width: 36 }} />
        </View>
      </View>

      <FlatList
        data={favourites}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>⭐</Text>
            <Text style={styles.emptyTitle}>No favourites yet</Text>
            <Text style={styles.emptyText}>
              Save foods you often eat to add them faster.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={openAddModal}>
              <Text style={styles.primaryButtonText}>Add favourite</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemRow}>
              <View style={styles.itemTextWrap}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>
                  {item.calories} cal {" · "}{item.protein}g protein
                </Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.addPill}
                  onPress={() => handleAddToToday(item)}
                >
                  <Text style={styles.addPillText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeLink}
                  onPress={() => handleRemoveItem(item.id)}
                >
                  <Text style={styles.removeLinkText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={
          favourites.length > 0 ? (
            <TouchableOpacity style={styles.primaryButton} onPress={openAddModal}>
              <Text style={styles.primaryButtonText}>Add favourite</Text>
            </TouchableOpacity>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={isAddOpen} animationType="fade" transparent onRequestClose={closeAddModal}>
        <View style={styles.addModalOverlay}>
          <Pressable style={styles.overlayDismiss} onPress={closeAddModal} />
          <View style={styles.addModalCard}>
            <Text style={styles.modalTitle}>New favourite</Text>
            <TextInput
              placeholder="Name (e.g., Apple)"
              placeholderTextColor={theme.textSecondary}
              value={newName}
              onChangeText={setNewName}
              style={styles.input}
            />
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <TextInput
                  placeholder="Calories"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  value={newCalories}
                  onChangeText={setNewCalories}
                  style={styles.input}
                />
              </View>
              <View style={[styles.rowItem, { marginLeft: 8 }]}>
                <TextInput
                  placeholder="Protein (g)"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  value={newProtein}
                  onChangeText={setNewProtein}
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={closeAddModal}>
                <Text style={styles.secondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmButton, { marginLeft: 8 }]} onPress={confirmAddItem}>
                <Text style={styles.confirmText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
