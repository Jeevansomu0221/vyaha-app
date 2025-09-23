import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Category, FoodItem, categories, foodData } from "../data/foodData";

import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function FoodScreen() {
  const [vegOnly, setVegOnly] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentLocation, setCurrentLocation] = useState("Fetching location...");
  const router = useRouter();

  // Profile navigation
  const handleProfilePress = () => {
    try {
      router.push("/Profile");
    } catch (error) {
      console.warn("Navigation error:", error);
      router.replace("/Profile");
    }
  };
  //toggle view all
const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
const toggleCategoryExpand = (categoryId: string) => {
  setExpandedCategories((prev) => ({
    ...prev,
    [categoryId]: !prev[categoryId],
  }));
};

  // Product detail navigation
  const handleProductPress = (item: FoodItem) => {
    try {
      router.push({
        pathname: "/productDetail",
        params: {
          name: item.name,
          image: Image.resolveAssetSource(item.image).uri,
          price: item.price.toString(),
          rating: item.rating.toString(),
          time: item.time,
        },
      });
    } catch (error) {
      console.warn("Product navigation error:", error);
    }
  };

  // Fetch location once on mount
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setCurrentLocation("Permission denied");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const [address] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        const locationString = `${address.city || address.name || ""}, ${
          address.region || ""
        }`;
        setCurrentLocation(locationString);
      } catch (error) {
        console.warn(error);
        setCurrentLocation("Unable to fetch location");
      }
    };

    fetchLocation();
  }, []);

  // Filter food items based on veg preference
  const getFilteredFoods = (foods: FoodItem[]): FoodItem[] => {
    return vegOnly ? foods.filter((food) => food.isVeg) : foods;
  };

  // Category tabs
  const renderCategoryTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoryContainer}
      contentContainerStyle={styles.categoryContent}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[styles.categoryTab, { backgroundColor: category.color + "15" }]}
        >
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={[styles.categoryName, { color: category.color }]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Food card
  const renderFoodCard = (item: FoodItem, index: number) => (
    <TouchableOpacity
      key={`${item.name}-${index}`}
      style={styles.foodCard}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.cardImageContainer}>
        <Image source={item.image} style={styles.cardImage} />
        {item.isVeg && (
          <View style={styles.vegIndicator}>
            <View style={styles.vegDot} />
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text numberOfLines={1} style={styles.cardTitle}>
          {item.name}
        </Text>
        <Text style={styles.cardTime}>{item.time}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>₹{item.price}</Text>
          {item.originalPrice > item.price && (
            <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={16} color="#FF6B35" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Food section
  const renderSection = (
  title: string,
  data: FoodItem[],
  categoryInfo: Category
) => {
  const filteredData = getFilteredFoods(data);
  if (filteredData.length === 0 && vegOnly) return null;

  const isExpanded = expandedCategories[categoryInfo.id] || false;

  return (
    <View style={styles.sectionContainer} key={title}>
      {/* Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionIcon}>{categoryInfo.icon}</Text>
          <View>
            <Text style={styles.sectionTitle}>{categoryInfo.name}</Text>
            <Text style={styles.sectionSubtitle}>
              {filteredData.length} items
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => toggleCategoryExpand(categoryInfo.id)}
        >
          <Text style={styles.viewAllText}>
            {isExpanded ? "View Less" : "View All"}
          </Text>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-forward"}
            size={16}
            color="#FF6B35"
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isExpanded ? (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item, index }) => renderFoodCard(item, index)}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContainer}
          scrollEnabled={false} // don’t scroll, let parent scroll handle
        />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.foodScrollView}
          contentContainerStyle={styles.foodScrollContent}
        >
          {filteredData.map((item, index) => renderFoodCard(item, index))}
        </ScrollView>
      )}
    </View>
  );
};


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <View style={styles.locationInfo}>
              <View style={styles.locationIcon}>
                <Ionicons name="location" size={16} color="#FF6B35" />
              </View>
              <View>
                <Text style={styles.deliverToText}>Deliver to</Text>
                <Text style={styles.locationText}>{currentLocation}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleProfilePress}
              style={styles.profileButton}
            >
              <Ionicons name="person-circle" size={32} color="#FF6B35" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#888" />
            <TextInput
              placeholder="Search for foods"
              style={styles.searchInput}
              placeholderTextColor="#888"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Ionicons name="close-circle" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.vegToggle, vegOnly && styles.vegToggleActive]}
            onPress={() => setVegOnly(!vegOnly)}
          >
            <View style={[styles.vegIcon, vegOnly && styles.vegIconActive]}>
              <View style={styles.vegDot} />
            </View>
            <Text
              style={[
                styles.vegToggleText,
                vegOnly && styles.vegToggleTextActive,
              ]}
            >
              {vegOnly ? "Pure Veg" : "Veg Mode"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Tabs */}
        {renderCategoryTabs()}

        {/* Banner */}
        <View style={styles.promoContainer}>
          <View style={styles.promoBanner}>
            <Image
              source={require("../../assets/images/foods/noodles.jpg")}
              style={styles.promoImage}
            />
            <View style={styles.promoOverlay}>
              <View style={styles.promoContent}>
                <Text style={styles.promoTitle}>Special Combo Offer!</Text>
                <Text style={styles.promoSubtitle}>
                  Get 30% off on orders above ₹299
                </Text>
                <TouchableOpacity style={styles.promoButton}>
                  <Text style={styles.promoButtonText}>Order Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Food Sections */}
        {renderSection("Street Foods", foodData.local, categories[0])}
        {renderSection("Bakery Items", foodData.bakery, categories[1])}
        {renderSection("Tiffins", foodData.tiffin, categories[2])}
        {renderSection("Biryani", foodData.restaurant, categories[3])}
        {renderSection("Drinkables", foodData.drinks, categories[4])}
        {renderSection("Yummy", foodData.dessert, categories[5])}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  
  scrollContent: {
    paddingBottom: 10,
  },

  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff2e6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  deliverToText: {
    fontSize: 11,
    color: "#666",
    marginBottom: 1,
  },

  locationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },

  profileButton: {
    padding: 2,
  },

  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },

  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 0,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    marginLeft: 6,
    fontSize: 14,
    color: "#1a1a1a",
  },

  vegToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#27ae60",
  },

  vegToggleActive: {
    backgroundColor: "#27ae60",
    borderColor: "#27ae60",
  },

  vegIcon: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: "#27ae60",
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },

  vegIconActive: {
    borderColor: "#fff",
  },

  vegDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#27ae60",
  },

  vegToggleText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#27ae60",
  },

  vegToggleTextActive: {
    color: "#fff",
  },

  categoryContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
  },

  categoryContent: {
    paddingHorizontal: 16,
  },

  categoryTab: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    marginRight: 10,
    minWidth: 70,
  },

  categoryIcon: {
    fontSize: 20,
    marginBottom: 2,
  },

  categoryName: {
    fontSize: 11,
    fontWeight: "600",
  },

  promoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  promoBanner: {
    height: 140,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  },

  promoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  promoContent: {
    alignItems: "flex-start",
  },

  promoTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },

  promoSubtitle: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 12,
    opacity: 0.9,
  },

  promoButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },

  promoButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  sectionContainer: {
    marginVertical: 6,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  sectionIcon: {
    fontSize: 20,
    marginRight: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 1,
  },

  sectionSubtitle: {
    fontSize: 11,
    color: "#666",
  },

  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  viewAllText: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "600",
    marginRight: 2,
  },

  foodScrollView: {
    paddingLeft: 16,
  },

  foodScrollContent: {
    paddingRight: 16,
  },

  foodCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginRight: 12,
    width: 140,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: "hidden",
  },

  cardImageContainer: {
    position: "relative",
  },

  cardImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },

  vegIndicator: {
    position: "absolute",
    top: 6,
    left: 6,
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: "#27ae60",
    borderRadius: 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  ratingBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 10,
  },

  ratingText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "600",
    marginLeft: 2,
  },

  cardContent: {
    padding: 10,
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },

  cardTime: {
    fontSize: 10,
    color: "#666",
    marginBottom: 6,
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  currentPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#27ae60",
    marginRight: 6,
  },

  originalPrice: {
    fontSize: 11,
    color: "#999",
    textDecorationLine: "line-through",
  },

  addButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff2e6",
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  bottomSpacing: {
    height: 20,
  },
  gridContainer: {
  paddingHorizontal: 16,
},
gridRow: {
  justifyContent: "space-evenly",
  marginBottom: 12,
},

});