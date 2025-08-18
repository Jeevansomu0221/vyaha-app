import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FoodScreen() {
  const [vegOnly, setVegOnly] = useState(false);
  const router = useRouter();

  // Local Foods
  const localFoods = [
    { name: "Samosa", price: "₹20", rating: 4.5, image: require("../../assets/images/foods/samosa.jpg") },
    { name: "Pav Bhaji", price: "₹60", rating: 4.7, image: require("../../assets/images/foods/pav bhaji.jpg") },
    { name: "Pani Puri", price: "₹30", rating: 4.2, image: require("../../assets/images/foods/pani puri.jpg") },
    { name: "Vada Pav", price: "₹25", rating: 4.6, image: require("../../assets/images/foods/vadapav.jpg") },
    { name: "Shawarma", price: "₹90", rating: 4.8, image: require("../../assets/images/foods/shawarma.jpg") },
    { name: "Manchuria", price: "₹90", rating: 4.8, image: require("../../assets/images/foods/manchuria.jpg") },
    { name: "Noodles", price: "₹90", rating: 4.8, image: require("../../assets/images/foods/noodles.jpg") },
  ];

  // Bakery
  const bakery = [
    { name: "Puffs", price: "₹25", rating: 4.2, image: require("../../assets/images/foods/vegpuff.jpg") },
    { name: "Pizza", price: "₹250", rating: 4.6, image: require("../../assets/images/foods/pizza.jpg") },
    { name: "Burger", price: "₹25", rating: 4.2, image: require("../../assets/images/foods/burger.jpg") },
    { name: "Cakes", price: "₹250", rating: 4.6, image: require("../../assets/images/foods/cakes.jpg") },
  ];

  // Tiffins
  const tiffins = [
    { name: "Vada", price: "₹35", rating: 4.4, image: require("../../assets/images/foods/vada.jpg") },
    { name: "Poori", price: "₹50", rating: 4.3, image: require("../../assets/images/foods/poori.jpg") },
    { name: "Dosa", price: "₹35", rating: 4.4, image: require("../../assets/images/foods/dosa.jpg") },
    { name: "Idly", price: "₹50", rating: 4.3, image: require("../../assets/images/foods/idly.jpg") },
  ];

  // Restaurants
  const restaurants = [
    { name: "Veg Biryani", price: "₹120", rating: 4.6, image: require("../../assets/images/foods/vegbiryani.jpg") },
    { name: "Paneer Biryani", price: "₹150", rating: 4.7, image: require("../../assets/images/foods/psaneer biryani.jpg") },
    { name: "Chicken Biryani", price: "₹120", rating: 4.6, image: require("../../assets/images/foods/chickenbiryani.jpg") },
  ];

  // Drinkables
  const Drinkables = [
    { name: "Juices", price: "₹120", rating: 4.6, image: require("../../assets/images/foods/juices.jpg") },
    { name: "Lassi", price: "₹150", rating: 4.7, image: require("../../assets/images/foods/lassi.jpg") },
    { name: "Tea", price: "₹120", rating: 4.6, image: require("../../assets/images/foods/tea.jpg") },
    { name: "Coffee", price: "₹150", rating: 4.7, image: require("../../assets/images/foods/coffe.jpg") },
  ];

  // Ice creams
  const icecreams = [
    { name: "Vanilla Ice Cream", price: "₹60", rating: 4.6, image: require("../../assets/images/foods/vanillaicecream.jpg") },
    { name: "Strawberry Ice Cream", price: "₹70", rating: 4.6, image: require("../../assets/images/foods/stawberryicecream.jpg") },
    { name: "Chocolate Ice Cream", price: "₹60", rating: 4.6, image: require("../../assets/images/foods/chocolateicecream.jpg") },
    { name: "Kulfi", price: "₹70", rating: 4.6, image: require("../../assets/images/foods/kulfiicecream.jpg") },
  ];

  // Reusable Section Renderer
  const renderSection = (title, data) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/productDetail",
                params: { name: item.name, image: Image.resolveAssetSource(item.image).uri },
              })
            }
          >
            <Image source={item.image} style={styles.cardImage} />
            <Text numberOfLines={2} style={styles.cardName}>{item.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.cardPrice}>{item.price}</Text>
              <Text style={styles.cardRating}>⭐ {item.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.location}>📍 Hyderabad</Text>
          <Text style={styles.profile}>👤</Text>
        </View>

        {/* Search + Veg ON/OFF */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#888" style={{ marginRight: 6 }} />
            <TextInput
              placeholder="Search food..."
              style={styles.searchInput}
              placeholderTextColor="#888"
            />
          </View>
          <TouchableOpacity
            style={[styles.vegButton, vegOnly && styles.vegButtonActive]}
            onPress={() => setVegOnly(!vegOnly)}
          >
            <Text style={[styles.vegText, vegOnly && { color: "white" }]}>
              {vegOnly ? "Veg ON" : "Veg OFF"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Image source={require("../../assets/images/foods/noodles.jpg")} style={styles.heroImage} />
        </View>

        {/* Sections */}
        {renderSection("Local Foods", localFoods)}
        {renderSection("Bakery", bakery)}
        {renderSection("Tiffins", tiffins)}
        {renderSection("Restaurants", restaurants)}
        {renderSection("Drinkables", Drinkables)}
        {renderSection("Ice Creams", icecreams)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 8,
  },
  location: { fontSize: 16, fontWeight: "bold" },
  profile: { fontSize: 20 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  vegButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 5,
    backgroundColor: "white",
  },
  vegButtonActive: { backgroundColor: "green" },
  vegText: { fontWeight: "bold", color: "green" },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
  },
  searchInput: { flex: 1, height: 40, fontSize: 14, color: "#000" },
  hero: { marginHorizontal: 16, marginBottom: 24 },
  heroImage: { width: "100%", height: 180, borderRadius: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 16, marginBottom: 10 },
  scrollRow: { paddingLeft: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    width: 140,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: { width: "100%", height: 90, borderRadius: 8, marginBottom: 8 },
  cardName: { fontSize: 14, fontWeight: "bold", marginBottom: 6, minHeight: 36 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardPrice: { fontSize: 13, color: "green", fontWeight: "bold" },
  cardRating: { fontSize: 12, color: "#666" },
});
