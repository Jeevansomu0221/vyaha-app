import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useMemo } from "react";
import { Category, FoodItem, categories, foodData, SubCategory, subCategories } from "./../data/foodData";
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
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
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

  // Toggle category expand
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

  // Handle search
  const handleSearch = () => {
    if (searchText.trim()) {
      setShowSearchResults(true);
      setSelectedCategory(null);
      setSelectedSubCategory(null);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchText("");
    setShowSearchResults(false);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(null);
    setShowSearchResults(false);
  };

  // Handle sub-category selection
  const handleSubCategorySelect = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId === selectedSubCategory ? null : subCategoryId);
  };

  // Get all food items from all categories
  const allFoodItems = useMemo(() => {
    return [
      ...foodData.local,
      ...foodData.bakery,
      ...foodData.tiffin,
      ...foodData.restaurant,
      ...foodData.drinks,
      ...foodData.dessert,
    ];
  }, []);

  // Filter food items based on search and veg preference
  const getFilteredFoods = (foods: FoodItem[]): FoodItem[] => {
    let filtered = foods;
    
    if (searchText.trim()) {
      filtered = filtered.filter((food) =>
        food.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (vegOnly) {
      filtered = filtered.filter((food) => food.isVeg);
    }
    
    return filtered;
  };

  // Get category-specific items
  const getCategoryItems = (categoryId: string) => {
    switch (categoryId) {
      case "local":
        return foodData.local;
      case "bakery":
        return foodData.bakery;
      case "tiffin":
        return foodData.tiffin;
      case "restaurant":
        return foodData.restaurant;
      case "drinks":
        return foodData.drinks;
      case "dessert":
        return foodData.dessert;
      default:
        return [];
    }
  };

  // Get filtered items by sub-category
  const getSubCategoryItems = (categoryId: string, subCategoryId: string) => {
    const items = getCategoryItems(categoryId);
    return items.filter(item => item.subCategory === subCategoryId);
  };

  // Get search results
  const searchResults = useMemo(() => {
    return getFilteredFoods(allFoodItems);
  }, [searchText, vegOnly]);

  // Category tabs with icons
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
          style={[
            styles.categoryTab,
            selectedCategory === category.id && styles.categoryTabActive,
            { backgroundColor: category.color + "15" }
          ]}
          onPress={() => handleCategorySelect(category.id)}
        >
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={[styles.categoryName, { color: category.color }]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Sub-category tabs for detailed sections
  const renderSubCategoryTabs = () => {
    if (!selectedCategory) return null;
    
    const categorySubs = subCategories[selectedCategory];
    if (!categorySubs || categorySubs.length === 0) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.subCategoryContainer}
        contentContainerStyle={styles.subCategoryContent}
      >
        <TouchableOpacity
          style={[
            styles.subCategoryTab,
            !selectedSubCategory && styles.subCategoryTabActive
          ]}
          onPress={() => setSelectedSubCategory(null)}
        >
          <View style={[styles.subCategoryIconContainer, { backgroundColor: "#f0f0f0" }]}>
            <Text style={styles.subCategoryIcon}>📦</Text>
          </View>
          <Text style={styles.subCategoryName}>All</Text>
        </TouchableOpacity>
        
        {categorySubs.map((sub) => (
          <TouchableOpacity
            key={sub.id}
            style={[
              styles.subCategoryTab,
              selectedSubCategory === sub.id && styles.subCategoryTabActive
            ]}
            onPress={() => handleSubCategorySelect(sub.id)}
          >
            <View style={[styles.subCategoryIconContainer, { backgroundColor: sub.color + "20" }]}>
              <Text style={styles.subCategoryIcon}>{sub.icon}</Text>
            </View>
            <Text style={styles.subCategoryName}>{sub.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  // Compact food card (for horizontal scroll)
  const renderCompactFoodCard = (item: FoodItem, index: number) => (
    <TouchableOpacity
      key={`${item.name}-${index}`}
      style={styles.compactFoodCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.compactCardImageContainer}>
        <Image source={item.image} style={styles.compactCardImage} />
        {item.isVeg && (
          <View style={styles.vegIndicator}>
            <View style={styles.vegDot} />
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={8} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>

      <View style={styles.compactCardContent}>
        <Text numberOfLines={1} style={styles.compactCardTitle}>
          {item.name}
        </Text>
        <Text style={styles.compactCardTime}>{item.time}</Text>
        
        <View style={styles.compactPriceContainer}>
          <Text style={styles.currentPrice}>₹{item.price}</Text>
          {item.originalPrice > item.price && (
            <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
          )}
        </View>
      </View>
      
      <TouchableOpacity style={styles.compactAddButton}>
        <Ionicons name="add" size={14} color="#FF6B35" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Expanded food card (for grid view)
  const renderExpandedFoodCard = (item: FoodItem, index: number) => (
    <TouchableOpacity
      key={`expanded-${item.name}-${index}`}
      style={styles.expandedFoodCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.expandedCardImageContainer}>
        <Image source={item.image} style={styles.expandedCardImage} />
        {item.isVeg && (
          <View style={styles.vegIndicator}>
            <View style={styles.vegDot} />
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={8} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>

      <View style={styles.expandedCardContent}>
        <Text numberOfLines={1} style={styles.expandedCardTitle}>
          {item.name}
        </Text>
        <Text style={styles.expandedCardTime}>{item.time}</Text>

        <View style={styles.expandedPriceContainer}>
          <Text style={styles.currentPrice}>₹{item.price}</Text>
          {item.originalPrice > item.price && (
            <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.expandedAddButton}>
          <Ionicons name="add" size={12} color="#FF6B35" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Food section
  const renderFoodSection = (
    data: FoodItem[],
    categoryInfo: Category
  ) => {
    const filteredData = getFilteredFoods(data);
    if (filteredData.length === 0 || selectedCategory || showSearchResults) return null;

    const isExpanded = expandedCategories[categoryInfo.id] || false;

    return (
      <View style={styles.sectionContainer} key={categoryInfo.id}>
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
              {isExpanded ? "Show Less" : "View All"}
            </Text>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-forward"}
              size={12}
              color="#FF6B35"
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {isExpanded ? (
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => `${item.id || item.name}-${index}`}
            renderItem={({ item, index }) => renderExpandedFoodCard(item, index)}
            numColumns={3}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridContainer}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.foodScrollView}
            contentContainerStyle={styles.foodScrollContent}
          >
            {filteredData.slice(0, 4).map((item, index) => renderCompactFoodCard(item, index))}
            {filteredData.length > 4 && (
              <TouchableOpacity 
                style={styles.viewMoreCard}
                onPress={() => toggleCategoryExpand(categoryInfo.id)}
              >
                <Text style={styles.viewMoreText}>View All</Text>
                <Text style={styles.viewMoreCount}>+{filteredData.length - 4}</Text>
                <Ionicons name="chevron-forward" size={12} color="#FF6B35" style={styles.viewMoreIcon} />
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>
    );
  };

  // Selected category view
  const renderSelectedCategory = () => {
    if (!selectedCategory) return null;
    
    const categoryInfo = categories.find(c => c.id === selectedCategory);
    const categoryItems = selectedSubCategory 
      ? getSubCategoryItems(selectedCategory, selectedSubCategory)
      : getCategoryItems(selectedCategory);
    const filteredItems = getFilteredFoods(categoryItems);
    
    if (!categoryInfo || filteredItems.length === 0) return null;

    return (
      <View style={styles.selectedCategoryContainer}>
        <View style={styles.selectedCategoryHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedCategory(null)}
          >
            <Ionicons name="arrow-back" size={20} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.selectedCategoryTitleContainer}>
            <Text style={styles.selectedCategoryIcon}>{categoryInfo.icon}</Text>
            <View>
              <Text style={styles.selectedCategoryTitle}>{categoryInfo.name}</Text>
              <Text style={styles.selectedCategoryCount}>{filteredItems.length} items</Text>
            </View>
          </View>
        </View>

        {renderSubCategoryTabs()}

        {filteredItems.length > 0 ? (
          <FlatList
            data={filteredItems}
            keyExtractor={(item, index) => `${item.id || item.name}-${index}`}
            renderItem={({ item, index }) => renderCompactFoodCard(item, index)}
            numColumns={2}
            columnWrapperStyle={styles.categoryGridRow}
            contentContainerStyle={styles.categoryGridContainer}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noItemsContainer}>
            <Text style={styles.noItemsText}>No items found</Text>
          </View>
        )}
      </View>
    );
  };

  // Search results view
  const renderSearchResults = () => {
    if (!showSearchResults || searchResults.length === 0) return null;

    return (
      <View style={styles.searchResultsContainer}>
        <View style={styles.searchResultsHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={clearSearch}
          >
            <Ionicons name="arrow-back" size={20} color="#1a1a1a" />
          </TouchableOpacity>
          <View>
            <Text style={styles.searchResultsTitle}>
              Search Results
            </Text>
            <Text style={styles.searchResultsSubtitle}>
              {searchResults.length} items found
            </Text>
          </View>
          <TouchableOpacity onPress={clearSearch}>
            <Text style={styles.clearSearchText}>Clear</Text>
          </TouchableOpacity>
        </View>
        
        {searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => `${item.id || item.name}-${index}`}
            renderItem={({ item, index }) => renderCompactFoodCard(item, index)}
            numColumns={2}
            columnWrapperStyle={styles.categoryGridRow}
            contentContainerStyle={styles.categoryGridContainer}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noItemsContainer}>
            <Text style={styles.noItemsText}>No items found for "{searchText}"</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <View style={styles.locationInfo}>
              <View style={styles.locationIcon}>
                <Ionicons name="location" size={14} color="#FF6B35" />
              </View>
              <View>
                <Text style={styles.deliverToText}>Deliver to</Text>
                <Text style={styles.locationText} numberOfLines={1}>
                  {currentLocation}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleProfilePress}
              style={styles.profileButton}
            >
              <Ionicons name="person-circle" size={28} color="#FF6B35" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={16} color="#888" />
            <TextInput
              placeholder="Search for foods"
              style={styles.searchInput}
              placeholderTextColor="#888"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons name="close-circle" size={16} color="#888" />
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
              {vegOnly ? "Veg Only" : "Veg"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Show Search Results OR Normal Content */}
        {showSearchResults ? (
          renderSearchResults()
        ) : selectedCategory ? (
          renderSelectedCategory()
        ) : (
          <>
            {/* Category Tabs */}
            {renderCategoryTabs()}

            {/* Promo Banner */}
            <View style={styles.promoContainer}>
              <View style={styles.promoBanner}>
                <Image
                  source={require("../../assets/images/foods/noodles.jpg")}
                  style={styles.promoImage}
                />
                <View style={styles.promoOverlay}>
                  <View style={styles.promoContent}>
                    <Text style={styles.promoTitle}>Special Offer!</Text>
                    <Text style={styles.promoSubtitle}>
                      30% off on orders above ₹299
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Food Sections */}
            {renderFoodSection(foodData.local, categories[0])}
            {renderFoodSection(foodData.bakery, categories[1])}
            {renderFoodSection(foodData.tiffin, categories[2])}
            {renderFoodSection(foodData.restaurant, categories[3])}
            {renderFoodSection(foodData.drinks, categories[4])}
            {renderFoodSection(foodData.dessert, categories[5])}
          </>
        )}

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
    paddingBottom: 16,
  },

  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },

  locationIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff2e6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  deliverToText: {
    fontSize: 9,
    color: "#666",
    marginBottom: 1,
  },

  locationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
  },

  profileButton: {
    padding: 2,
  },

  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },

  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginRight: 8,
    height: 34,
  },

  searchInput: {
    flex: 1,
    marginLeft: 6,
    fontSize: 13,
    color: "#1a1a1a",
    height: 34,
    paddingVertical: 0,
  },

  vegToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#27ae60",
  },

  vegToggleActive: {
    backgroundColor: "#27ae60",
    borderColor: "#27ae60",
  },

  vegIcon: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "#27ae60",
    borderRadius: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },

  vegIconActive: {
    borderColor: "#fff",
  },

  vegDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#27ae60",
  },

  vegToggleText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#27ae60",
  },

  vegToggleTextActive: {
    color: "#fff",
  },

  categoryContainer: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },

  categoryContent: {
    paddingHorizontal: 12,
  },

  categoryTab: {
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 6,
    minWidth: 58,
    borderWidth: 1,
    borderColor: "transparent",
  },

  categoryTabActive: {
    borderColor: "#FF6B35",
    backgroundColor: "#FF6B35" + "15",
  },

  categoryIcon: {
    fontSize: 14,
    marginBottom: 2,
  },

  categoryName: {
    fontSize: 9,
    fontWeight: "600",
  },

  subCategoryContainer: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },

  subCategoryContent: {
    paddingHorizontal: 12,
  },

  subCategoryTab: {
    alignItems: "center",
    marginRight: 10,
    width: 52,
  },

  subCategoryTabActive: {
    opacity: 1,
  },

  subCategoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },

  subCategoryIcon: {
    fontSize: 14,
  },

  subCategoryName: {
    fontSize: 9,
    color: "#666",
    textAlign: "center",
  },

  promoContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  promoBanner: {
    height: 80,
    borderRadius: 6,
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
    paddingHorizontal: 12,
  },

  promoContent: {
    alignItems: "flex-start",
  },

  promoTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },

  promoSubtitle: {
    fontSize: 10,
    color: "#fff",
    opacity: 0.9,
  },

  sectionContainer: {
    marginTop: 4,
    marginBottom: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginBottom: 6,
  },

  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  sectionIcon: {
    fontSize: 14,
    marginRight: 6,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 1,
  },

  sectionSubtitle: {
    fontSize: 9,
    color: "#666",
  },

  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff2e6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF6B35" + "30",
  },

  viewAllText: {
    fontSize: 10,
    color: "#FF6B35",
    fontWeight: "600",
    marginRight: 4,
  },

  // Compact Card Styles (Horizontal Scroll)
  foodScrollView: {
    paddingLeft: 12,
  },

  foodScrollContent: {
    paddingRight: 12,
    alignItems: "center",
  },

  compactFoodCard: {
    backgroundColor: "#fff",
    borderRadius: 6,
    marginRight: 8,
    width: 115,
    elevation: 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
  },

  compactCardImageContainer: {
    position: "relative",
    height: 70,
  },

  compactCardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  compactCardContent: {
    padding: 6,
  },

  compactCardTitle: {
    fontSize: 10,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 1,
  },

  compactCardTime: {
    fontSize: 8,
    color: "#666",
    marginBottom: 3,
  },

  compactPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  currentPrice: {
    fontSize: 11,
    fontWeight: "700",
    color: "#27ae60",
    marginRight: 3,
  },

  originalPrice: {
    fontSize: 9,
    color: "#999",
    textDecorationLine: "line-through",
  },

  compactAddButton: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff2e6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#FF6B35",
  },

  viewMoreCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    width: 80,
    height: 125,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    paddingHorizontal: 8,
  },

  viewMoreText: {
    fontSize: 10,
    color: "#FF6B35",
    fontWeight: "600",
    marginBottom: 2,
  },

  viewMoreCount: {
    fontSize: 8,
    color: "#666",
    marginBottom: 4,
  },

  viewMoreIcon: {
    marginTop: 2,
  },

  // Expanded Card Styles (Grid View)
  expandedFoodCard: {
    backgroundColor: "#fff",
    borderRadius: 6,
    width: (width - 32 - 12) / 3,
    elevation: 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
  },

  expandedCardImageContainer: {
    position: "relative",
    height: 60,
  },

  expandedCardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  expandedCardContent: {
    padding: 5,
  },

  expandedCardTitle: {
    fontSize: 9,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 1,
  },

  expandedCardTime: {
    fontSize: 8,
    color: "#666",
    marginBottom: 3,
  },

  expandedPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  expandedAddButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff2e6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#FF6B35",
  },

  // Grid Styles
  gridContainer: {
    paddingHorizontal: 12,
  },

  gridRow: {
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 6,
  },

  // Selected Category Styles
  selectedCategoryContainer: {
    paddingTop: 4,
  },

  selectedCategoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },

  backButton: {
    marginRight: 10,
  },

  selectedCategoryTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  selectedCategoryIcon: {
    fontSize: 16,
    marginRight: 8,
  },

  selectedCategoryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  selectedCategoryCount: {
    fontSize: 10,
    color: "#666",
    marginTop: 1,
  },

  categoryGridContainer: {
    padding: 12,
    paddingTop: 8,
  },

  categoryGridRow: {
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },

  // Common Styles
  vegIndicator: {
    position: "absolute",
    top: 5,
    left: 5,
    width: 8,
    height: 8,
    borderWidth: 0.5,
    borderColor: "#27ae60",
    borderRadius: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  ratingBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 4,
  },

  ratingText: {
    color: "#fff",
    fontSize: 7,
    fontWeight: "600",
    marginLeft: 1,
  },

  // Search Results Styles
  searchResultsContainer: {
    paddingTop: 4,
  },

  searchResultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    marginBottom: 6,
  },

  searchResultsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  searchResultsSubtitle: {
    fontSize: 10,
    color: "#666",
    marginTop: 1,
  },

  clearSearchText: {
    fontSize: 11,
    color: "#FF6B35",
    fontWeight: "600",
  },

  noItemsContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  noItemsText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },

  bottomSpacing: {
    height: 16,
  },
});