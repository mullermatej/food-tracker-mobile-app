import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Pressable,
  Platform,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { emit } from "../utils/eventBus";
import { useLocalStorage } from "../hooks/useLocalStorage";
import AppSymbol from "./ui/AppSymbol";
import {
  parseDecimalInput,
  formatDecimalWithComma,
} from "../utils/numberFormat";
import { triggerLightHaptic, triggerWarningHaptic } from "../utils/haptics";

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
  const listRef = useRef(null);
  const nameInputRef = useRef(null);
  const [favourites, setFavourites] = useState(DUMMY_FAVOURITES);
  const [sortVisible, setSortVisible] = useState(false);
  const [sortMode, setSortMode] = useState("recent"); // 'recent' | 'alpha'
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isMultiplyOpen, setIsMultiplyOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [multiplierStr, setMultiplierStr] = useState("1");
  const [newName, setNewName] = useState("");
  const [newCalories, setNewCalories] = useState("");
  const [newProtein, setNewProtein] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { saveData, loadData } = useLocalStorage();
  const scrollFabAnim = useRef(new Animated.Value(0)).current; // 0 hidden, 1 visible

  // Load favourites from storage on mount; seed defaults if none
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = await loadData("favourites");
        if (!mounted) return;
        if (stored && Array.isArray(stored)) {
          setFavourites(applySort(stored));
        } else {
          setFavourites(applySort(DUMMY_FAVOURITES));
          // Seed defaults so subsequent launches use storage
          saveData("favourites", DUMMY_FAVOURITES);
        }
      } catch (e) {
        // On error, keep current state (defaults) and continue
        console.error("Failed to load favourites:", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  function applySort(list) {
    const copy = [...(list || [])];
    if (sortMode === "alpha") {
      return copy.sort((a, b) =>
        (a?.name || "")
          .toLowerCase()
          .localeCompare((b?.name || "").toLowerCase())
      );
    }
    // recent: newest first (assumes larger id == newer)
    return copy.sort((a, b) => (b?.id || 0) - (a?.id || 0));
  }

  // Re-apply sort if mode changes
  useEffect(() => {
    setFavourites((prev) => applySort(prev));
  }, [sortMode]);

  // Animate scroll-to-top button visibility
  useEffect(() => {
    Animated.timing(scrollFabAnim, {
      toValue: showScrollTop ? 1 : 0,
      duration: showScrollTop ? 180 : 140,
      useNativeDriver: true,
    }).start();
  }, [showScrollTop, scrollFabAnim]);

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
            setFavourites((prev) => {
              const next = prev.filter((item) => item.id !== id);
              const sorted = applySort(next);
              saveData("favourites", sorted);
              return sorted;
            });
            triggerLightHaptic();
          },
        },
      ]
    );
  };

  const openMultiplyModal = (item) => {
    setSelectedItem(item);
    setMultiplierStr("1");
    setIsMultiplyOpen(true);
  };

  const closeMultiplyModal = () => {
    setIsMultiplyOpen(false);
    setSelectedItem(null);
  };

  const confirmMultiplyAdd = () => {
    if (!selectedItem) return;
    const mVal = parseDecimalInput(multiplierStr);
    const m = isNaN(mVal) ? 0 : mVal;
    const calories = Math.max(0, Math.round((selectedItem.calories || 0) * m));
    const proteinRaw = Math.max(0, (selectedItem.protein || 0) * m);
    const protein = Number(proteinRaw.toFixed(2));
    // Emit event so Home can update without leaving this screen
    emit("add-from-favourites", { name: selectedItem.name, calories, protein });
    Alert.alert(
      "Added",
      `${selectedItem.name} × ${formatDecimalWithComma(m)} added to today.`
    );
    closeMultiplyModal();
  };

  const openAddModal = () => {
    setIsAddOpen(true);
    // Focus the name input after modal animation
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
  };
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
      triggerWarningHaptic();
      return;
    }
    const calories = Number(newCalories) || 0;
    const protein = parseDecimalInput(newProtein);
    const newId = favourites.length
      ? favourites.reduce((max, it) => Math.max(max, it.id), favourites[0].id) +
        1
      : 1;
    const newItem = { id: newId, name, calories, protein };
    setFavourites((prev) => {
      const next = [...prev, newItem];
      const sorted = applySort(next);
      saveData("favourites", sorted);
      return sorted;
    });
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
    backHit: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 22,
      backgroundColor: theme.cardBackground,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    backText: { fontSize: 19, color: theme.textSecondary },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
      textAlign: "center",
      flex: 1,
    },
    sideLeft: {
      width: 72, // match right side width so title is truly centered
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    headerRight: {
      width: 72, // match left side width
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    iconButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(128, 128, 128, 0.1)",
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
    emptyTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 6,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
    },
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
    sortOptionsWrap: { marginTop: 4 },
    optionCard: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.cardBackground,
      borderRadius: 14,
      padding: 12,
      marginTop: 8,
    },
    optionCardActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + "10",
    },
    optionIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      marginRight: 12,
    },
    optionTextWrap: { flex: 1 },
    optionTitle: { fontSize: 16, fontWeight: "600", color: theme.text },
    optionSubtitle: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
    optionRight: { marginLeft: 12 },
    optionCheck: {
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: "transparent",
    },
    optionCheckActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    closeLink: {
      alignSelf: "center",
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginTop: 8,
    },
    closeLinkText: { color: theme.textSecondary, fontWeight: "600" },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 12,
      textAlign: "center",
    },
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
    scrollTopButton: {
      position: "absolute",
      right: 24,
      bottom: 24,
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.cardBackground,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.sideLeft}>
            <Pressable
              style={({ pressed }) => [
                styles.backHit,
                pressed && { backgroundColor: theme.primary + "10" },
              ]}
              onPress={() => navigation.goBack()}
              android_ripple={{
                color: theme.primary + "20",
                borderless: false,
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backText}>←</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>Favourites</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[styles.iconButton, { marginRight: 12 }]}
              onPress={() => setSortVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Sort favourites"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppSymbol
                name="arrow.up.arrow.down"
                size={24}
                color={theme.textSecondary}
                fallback={
                  <Text style={{ fontSize: 16, color: theme.textSecondary }}>
                    ↕️
                  </Text>
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={openAddModal}
              accessibilityRole="button"
              accessibilityLabel="Add favourite"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppSymbol
                name="plus"
                size={24}
                color={theme.textSecondary}
                fallback={
                  <Text style={{ fontSize: 18, color: theme.textSecondary }}>
                    +
                  </Text>
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={favourites}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        onScroll={({ nativeEvent }) => {
          const y = nativeEvent?.contentOffset?.y || 0;
          setShowScrollTop(y > 140);
        }}
        scrollEventThrottle={16}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>⭐</Text>
            <Text style={styles.emptyTitle}>No favourites yet</Text>
            <Text style={styles.emptyText}>
              Save foods you often eat to add them faster.
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={openAddModal}
            >
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
                  {item.calories} kcal {" · "}
                  {formatDecimalWithComma(item.protein)}g protein
                </Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.addPill}
                  onPress={() => openMultiplyModal(item)}
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
        ListFooterComponent={null}
        showsVerticalScrollIndicator={false}
      />

      <Animated.View
        pointerEvents={showScrollTop ? "auto" : "none"}
        style={[
          styles.scrollTopButton,
          {
            opacity: scrollFabAnim,
            transform: [
              {
                translateY: scrollFabAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() =>
            listRef.current?.scrollToOffset?.({ offset: 0, animated: true })
          }
          accessibilityRole="button"
          accessibilityLabel="Scroll to top"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppSymbol
            name="chevron.up"
            size={22}
            color={theme.textSecondary}
            fallback={
              <Text style={{ fontSize: 18, color: theme.textSecondary }}>
                ↑
              </Text>
            }
          />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={isAddOpen}
        animationType="fade"
        transparent
        onRequestClose={closeAddModal}
      >
        <View style={[styles.addModalOverlay, { marginBottom: 100 }]}>
          <Pressable style={styles.overlayDismiss} onPress={closeAddModal} />
          <View style={styles.addModalCard}>
            <Text style={styles.modalTitle}>New favourite</Text>
            <TextInput
              ref={nameInputRef}
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
                  keyboardType={
                    Platform.OS === "ios" ? "decimal-pad" : "numeric"
                  }
                  value={newProtein}
                  onChangeText={setNewProtein}
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={closeAddModal}
              >
                <Text style={styles.secondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, { marginLeft: 8 }]}
                onPress={confirmAddItem}
              >
                <Text style={styles.confirmText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add with Multiplier Modal */}
      <Modal
        visible={isMultiplyOpen}
        transparent
        animationType="fade"
        onRequestClose={closeMultiplyModal}
      >
        <View style={styles.addModalOverlay}>
          <Pressable
            style={styles.overlayDismiss}
            onPress={closeMultiplyModal}
          />
          <View style={styles.addModalCard}>
            {selectedItem ? (
              <>
                <Text
                  style={{
                    color: theme.text,
                    fontWeight: "700",
                    marginBottom: 6,
                    textAlign: "center",
                  }}
                >
                  {selectedItem.name}
                </Text>
                <Text
                  style={{
                    color: theme.textSecondary,
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  {selectedItem.calories} kcal ·{" "}
                  {formatDecimalWithComma(selectedItem.protein)}g protein
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <TextInput
                    value={multiplierStr}
                    onChangeText={setMultiplierStr}
                    inputMode="decimal"
                    keyboardType={
                      Platform.OS === "ios" ? "decimal-pad" : "numeric"
                    }
                    style={[
                      styles.input,
                      {
                        marginBottom: 0,
                        marginLeft: 8,
                        width: 100,
                        textAlign: "center",
                        paddingVertical: 8,
                      },
                    ]}
                    placeholder="1"
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>

                {(() => {
                  const mVal = parseDecimalInput(multiplierStr);
                  const m = isNaN(mVal) ? 0 : mVal;
                  const calcCalories = Math.max(
                    0,
                    Math.round((selectedItem.calories || 0) * m)
                  );
                  const calcProtein = Math.max(
                    0,
                    (selectedItem.protein || 0) * m
                  );
                  return (
                    <View
                      style={{
                        marginTop: 6,
                        marginBottom: 8,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{ color: theme.textSecondary, marginBottom: 4 }}
                      >
                        {selectedItem.calories} kcal,{" "}
                        {formatDecimalWithComma(selectedItem.protein)}g protein
                        × {formatDecimalWithComma(m)}
                      </Text>
                      <Text style={{ color: theme.text, fontWeight: "700" }}>
                        = {calcCalories} kcal,{" "}
                        {formatDecimalWithComma(Number(calcProtein.toFixed(2)))}
                        g protein
                      </Text>
                    </View>
                  );
                })()}

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={closeMultiplyModal}
                  >
                    <Text style={styles.secondaryText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.confirmButton, { marginLeft: 8 }]}
                    onPress={confirmMultiplyAdd}
                  >
                    <Text style={styles.confirmText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
          </View>
        </View>
      </Modal>

      {/* Sort Options Modal */}
      <Modal
        visible={sortVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortVisible(false)}
      >
        <View style={styles.addModalOverlay}>
          <Pressable
            style={styles.overlayDismiss}
            onPress={() => setSortVisible(false)}
          />
          <View style={styles.addModalCard}>
            <Text style={styles.modalTitle}>Sort by</Text>
            <View style={styles.sortOptionsWrap}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.optionCard,
                  sortMode === "recent" && styles.optionCardActive,
                ]}
                onPress={() => {
                  setSortMode("recent");
                  setFavourites((prev) => {
                    const sorted = applySort(prev);
                    saveData("favourites", sorted);
                    return sorted;
                  });
                  setSortVisible(false);
                }}
              >
                <View style={styles.optionIconWrap}>
                  <AppSymbol
                    name="clock"
                    size={18}
                    color={theme.textSecondary}
                    fallback={
                      <Text
                        style={{ fontSize: 16, color: theme.textSecondary }}
                      >
                        🕒
                      </Text>
                    }
                  />
                </View>
                <View style={styles.optionTextWrap}>
                  <Text style={styles.optionTitle}>Recently added</Text>
                  <Text style={styles.optionSubtitle}>Newest items first</Text>
                </View>
                <View style={styles.optionRight}>
                  <View
                    style={[
                      styles.optionCheck,
                      sortMode === "recent" && styles.optionCheckActive,
                    ]}
                  >
                    {sortMode === "recent" ? (
                      <AppSymbol
                        name="checkmark"
                        size={14}
                        color="#fff"
                        fallback={<Text style={{ color: "#fff" }}>✓</Text>}
                      />
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.optionCard,
                  sortMode === "alpha" && styles.optionCardActive,
                ]}
                onPress={() => {
                  setSortMode("alpha");
                  setFavourites((prev) => {
                    const sorted = applySort(prev);
                    saveData("favourites", sorted);
                    return sorted;
                  });
                  setSortVisible(false);
                }}
              >
                <View style={styles.optionIconWrap}>
                  <AppSymbol
                    name="textformat"
                    size={18}
                    color={theme.textSecondary}
                    fallback={
                      <Text
                        style={{ fontSize: 16, color: theme.textSecondary }}
                      >
                        A
                      </Text>
                    }
                  />
                </View>
                <View style={styles.optionTextWrap}>
                  <Text style={styles.optionTitle}>Alphabetical</Text>
                  <Text style={styles.optionSubtitle}>A → Z by name</Text>
                </View>
                <View style={styles.optionRight}>
                  <View
                    style={[
                      styles.optionCheck,
                      sortMode === "alpha" && styles.optionCheckActive,
                    ]}
                  >
                    {sortMode === "alpha" ? (
                      <AppSymbol
                        name="checkmark"
                        size={14}
                        color="#fff"
                        fallback={<Text style={{ color: "#fff" }}>✓</Text>}
                      />
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeLink}
              onPress={() => setSortVisible(false)}
              accessibilityRole="button"
              accessibilityLabel="Close sort options"
            >
              <Text style={styles.closeLinkText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
