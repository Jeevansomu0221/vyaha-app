import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "./context/CartContext";
import { products } from './data/productsData'; // Import from separate file

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProductType {
  name: string;
  price: number;
  image: any;
  unit: string;
  description: string;
  isPopular?: boolean;
  discount?: number;
}

interface Product {
  name: string;
  image: any;
  description: string;
  rating: number;
  reviewCount: number;
  preparationTime: string;
  category: string;
  types: ProductType[];
  options: string[];
}

export default function ProductDetail() {
  const { name } = useLocalSearchParams();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { addToCart } = useCart();

  const product = products.find((p) => p.name === name);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#e74c3c" />
          <Text style={styles.errorText}>Product not found</Text>
          <TouchableOpacity style={styles.errorButton} onPress={() => router.back()}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleType = (typeName: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeName) 
        ? prev.filter(t => t !== typeName)
        : [...prev, typeName]
    );
  };

  const getTotalPrice = () => {
    return product.types
      .filter(type => selectedTypes.includes(type.name))
      .reduce((sum, type) => {
        const discount = type.discount || 0;
        return sum + (type.price * (1 - discount / 100));
      }, 0);
  };

  const handleAddToCart = () => {
    const selectedItems = product.types.filter(t => selectedTypes.includes(t.name));
    
    if (selectedItems.length === 0 || !selectedOption) return;

    selectedItems.forEach(item => {
      const discount = item.discount || 0;
      const finalPrice = item.price * (1 - discount / 100);
      
      addToCart({
        name: item.name,
        price: Math.round(finalPrice),
        image: item.image,
        option: selectedOption,
        quantity: 1,
        unit: item.unit,
      });
    });

    router.push("/cart");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section with Text Overlay */}
        <View style={styles.heroSection}>
          <Image source={product.image} style={styles.heroImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{product.category}</Text>
              </View>
              <Text style={styles.heroTitle}>{product.name}</Text>
              <Text style={styles.heroDescription}>{product.description}</Text>
              
              <View style={styles.heroStats}>
                <View style={styles.statItem}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.statText}>{product.rating}</Text>
                  <Text style={styles.statSubtext}>({product.reviewCount}+)</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time" size={14} color="#fff" />
                  <Text style={styles.statText}>{product.preparationTime}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Floating Buttons */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Product Variants */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Your Favorite</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.typesContainer}
            >
              {product.types.map((type, index) => {
                const isSelected = selectedTypes.includes(type.name);
                const discountedPrice = type.discount 
                  ? type.price * (1 - type.discount / 100) 
                  : type.price;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.typeCard, isSelected && styles.typeCardSelected]}
                    onPress={() => toggleType(type.name)}
                  >
                    <View style={styles.typeImageContainer}>
                      <Image source={type.image} style={styles.typeImage} />
                      {type.isPopular && (
                        <View style={styles.popularBadge}>
                          <Text style={styles.popularText}>Popular</Text>
                        </View>
                      )}
                      {type.discount && (
                        <View style={styles.discountBadge}>
                          <Text style={styles.discountText}>{type.discount}% OFF</Text>
                        </View>
                      )}
                      {isSelected && (
                        <View style={styles.selectedOverlay}>
                          <Ionicons name="checkmark" size={16} color="#fff" />
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.typeDetails}>
                      <Text style={styles.typeName}>{type.name}</Text>
                      <View style={styles.priceRow}>
                        <View style={styles.priceContainer}>
                          {type.discount ? (
                            <>
                              <Text style={styles.discountPrice}>₹{Math.round(discountedPrice)}</Text>
                              <Text style={styles.originalPrice}>₹{type.price}</Text>
                            </>
                          ) : (
                            <Text style={styles.typePrice}>₹{type.price}</Text>
                          )}
                        </View>
                        <Text style={styles.typeUnit}>{type.unit}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Preparation Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preparation Style</Text>
            <View style={styles.optionsRow}>
              {product.options.map((option, index) => {
                const isSelected = selectedOption === option;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                    onPress={() => setSelectedOption(option)}
                  >
                    <Ionicons 
                      name={option === "Street Food" ? "storefront" : "home"} 
                      size={16} 
                      color={isSelected ? "#fff" : "#4CAF50"} 
                    />
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Add to Cart Footer */}
      <View style={styles.cartFooter}>
        <LinearGradient
          colors={['rgba(255,255,255,0.9)', '#fff']}
          style={styles.footerGradient}
        >
          {selectedTypes.length > 0 && (
            <View style={styles.orderSummary}>
              <Text style={styles.summaryText}>
                {selectedTypes.length} item{selectedTypes.length > 1 ? 's' : ''} selected
              </Text>
              <Text style={styles.totalPrice}>₹{Math.round(getTotalPrice())}</Text>
            </View>
          )}
          
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              (!selectedTypes.length || !selectedOption) && styles.addToCartButtonDisabled
            ]}
            onPress={handleAddToCart}
            disabled={!selectedTypes.length || !selectedOption}
          >
            <LinearGradient
              colors={(!selectedTypes.length || !selectedOption)
                ? ['#cccccc', '#aaaaaa'] 
                : ['#4CAF50', '#45a049']
              }
              style={styles.buttonGradient}
            >
              <Ionicons name="bag-add" size={16} color="#fff" />
              <Text style={styles.addToCartText}>Add to Cart</Text>
              {selectedTypes.length > 0 && (
                <View style={styles.itemCountBadge}>
                  <Text style={styles.itemCountText}>{selectedTypes.length}</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    position: 'relative',
    height: 240,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
  },
  heroContent: {
    padding: 16,
    paddingBottom: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4CAF50',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  heroDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
    marginBottom: 10,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  statSubtext: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  contentContainer: {
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -16,
    paddingTop: 16,
  },
  section: {
    marginHorizontal: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 10,
  },
  typesContainer: {
    paddingRight: 12,
  },
  typeCard: {
    width: 120,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeCardSelected: {
    borderColor: '#4CAF50',
  },
  typeImageContainer: {
    position: 'relative',
    height: 80,
  },
  typeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  popularBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#fff',
  },
  discountBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#fff',
  },
  selectedOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeDetails: {
    padding: 10,
  },
  typeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
  },
  discountPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
  },
  originalPrice: {
    fontSize: 10,
    color: '#636e72',
    textDecorationLine: 'line-through',
    marginLeft: 3,
  },
  typeUnit: {
    fontSize: 10,
    color: '#636e72',
    fontWeight: '500',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionCardSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 4,
  },
  optionTextSelected: {
    color: '#fff',
  },
  bottomSpacer: {
    height: 90,
  },
  cartFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 16,
  },
  footerGradient: {
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 12,
    color: '#636e72',
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },
  addToCartButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  addToCartButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 5,
  },
  itemCountBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  itemCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#636e72',
    marginVertical: 16,
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});