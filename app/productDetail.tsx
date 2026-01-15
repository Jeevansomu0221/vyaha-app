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
  StatusBar,
  Platform,
} from "react-native";
import { useCart } from "./context/CartContext";
import { products } from './data/productsData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

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
    
    if (selectedItems.length === 0) return;

    selectedItems.forEach(item => {
      const discount = item.discount || 0;
      const finalPrice = item.price * (1 - discount / 100);
      
      addToCart({
        name: item.name,
        price: Math.round(finalPrice),
        image: item.image,
        option: "Standard", // Default option since we removed the preparation style selection
        quantity: 1,
        unit: item.unit,
      });
    });

    router.push("/cart");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
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
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={18} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.favoriteButton}
            activeOpacity={0.8}
          >
            <Ionicons name="heart-outline" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Product Variants */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select your items</Text>
            <View style={styles.typesGrid}>
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
                    activeOpacity={0.7}
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
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Add to Cart Footer */}
      <View style={styles.cartFooter}>
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', '#fff']}
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
              (!selectedTypes.length) && styles.addToCartButtonDisabled
            ]}
            onPress={handleAddToCart}
            disabled={!selectedTypes.length}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={(!selectedTypes.length)
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
  scrollViewContent: {
    flexGrow: 1,
  },
  heroSection: {
    position: 'relative',
    height: 260,
    paddingTop: STATUSBAR_HEIGHT,
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
    top: STATUSBAR_HEIGHT + 10,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  favoriteButton: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 10,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  contentContainer: {
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 12,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: (SCREEN_WIDTH - 44) / 2, // Two columns with 16px margin on sides and 12px gap
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  typeCardSelected: {
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  typeImageContainer: {
    position: 'relative',
    height: 100,
  },
  typeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  popularBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#fff',
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#fff',
  },
  selectedOverlay: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  typeDetails: {
    padding: 10,
  },
  typeName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 4,
    height: 32, // Fixed height for consistent layout
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
    fontSize: 15,
    fontWeight: '700',
    color: '#4CAF50',
  },
  discountPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4CAF50',
  },
  originalPrice: {
    fontSize: 11,
    color: '#636e72',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  typeUnit: {
    fontSize: 11,
    color: '#636e72',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 100,
  },
  cartFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  footerGradient: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 13,
    color: '#636e72',
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  addToCartButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  addToCartButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 6,
  },
  itemCountBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  itemCountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
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