import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../context/AuthContext"; // Import the auth context
import { useCart } from "../context/CartContext";

const { height } = Dimensions.get('window');

// Define the FoodItem interface
interface FoodItem {
  id: string;
  name: string;
  price: number;
  image: ImageSourcePropType;
  restaurant?: string;
  unit?: string;
  quantity?: number;
}

export default function CartScreen() {
  const router = useRouter();
  const { cart, addToCart, decreaseQuantity, removeFromCart, clearCart } =
    useCart();
  const { user } = useAuth(); // Get user from auth context
  const insets = useSafeAreaInsets();

  const [tempAddress, setTempAddress] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Get the first address if available
  const defaultAddress = user?.addresses && user.addresses.length > 0 
    ? user.addresses[0].address 
    : "";

  const [address, setAddress] = useState<string>(defaultAddress);

  // ✅ Safe subtotal calculation
  const subtotal = cart.reduce((sum: number, item: FoodItem) => {
    return sum + (item.quantity ?? 1) * item.price;
  }, 0);

  const deliveryFee = cart.length > 0 ? 30 : 0;
  const platformFee = cart.length > 0 ? 0 : 0;
  const gst = cart.length > 0 ? Math.round(subtotal * 0.05) : 0;
  
  const grandTotal = subtotal + deliveryFee + platformFee + gst ;

  const saveAddress = () => {
    if (tempAddress.trim()) {
      setAddress(tempAddress);
      setModalVisible(false);
    }
  };

  const handleClearCart = () => {
    Alert.alert("Clear Cart", "Are you sure you want to remove all items?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: clearCart },
    ]);
  };

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      setTempAddress("");
      setModalVisible(true);
      return;
    }
    
    router.push({
      pathname: "/OrderSummary",
      params: {
        address,
        subtotal: subtotal.toString(),
        deliveryFee: deliveryFee.toString(),
        platformFee: platformFee.toString(),
        gst: gst.toString(),
        
        grandTotal: grandTotal.toString(),
      },
    });
  };

  const renderCartItem = ({
    item,
    index,
  }: {
    item: FoodItem;
    index: number;
  }) => (
    <View style={styles.cartItemContainer}>
      <View style={styles.cartItem}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.itemImage} />
          <TouchableOpacity
            onPress={() => removeFromCart(item)}
            style={styles.removeButton}
          >
            <Ionicons name="close" size={14} color="#ff4757" />
          </TouchableOpacity>
        </View>

        {/* Item Details */}
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          {item.restaurant && (
            <Text style={styles.itemRestaurant} numberOfLines={1}>{item.restaurant}</Text>
          )}
          <View style={styles.priceContainer}>
            <Text style={styles.itemPrice}>₹{item.price}</Text>
            <Text style={styles.itemUnit}>/{item.unit || "pc"}</Text>
          </View>
        </View>

        {/* Quantity Controls */}
        <View style={styles.quantitySection}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              onPress={() => decreaseQuantity(item)}
              style={styles.quantityButton}
            >
              <Ionicons name="remove" size={14} color="#fff" />
            </TouchableOpacity>

            <View style={styles.quantityDisplay}>
              <Text style={styles.quantityText}>{item.quantity ?? 1}</Text>
            </View>

            <TouchableOpacity
              onPress={() => addToCart(item)}
              style={styles.quantityButton}
            >
              <Ionicons name="add" size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemTotal}>
            ₹{(item.quantity ?? 1) * item.price}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="basket-outline" size={60} color="#ddd" />
      </View>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>
        Add some delicious items to get started
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/food")}
        style={styles.shopNowButton}
      >
        <Ionicons name="restaurant-outline" size={16} color="#fff" />
        <Text style={styles.shopNowText}>Browse Menu</Text>
      </TouchableOpacity>
    </View>
  );

  const BillSummary = () => (
    <View style={styles.billContainer}>
      <View style={styles.billHeader}>
        <Ionicons name="receipt-outline" size={16} color="#ff6b35" />
        <Text style={styles.billTitle}>Bill Summary</Text>
      </View>

      <View style={styles.billContent}>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Subtotal ({cart.length} items)</Text>
          <Text style={styles.billValue}>₹{subtotal}</Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Delivery fee</Text>
          <Text style={styles.billValue}>₹{deliveryFee}</Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Platform fee</Text>
          <Text style={styles.billValue}>₹{platformFee}</Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>GST (5%)</Text>
          <Text style={styles.billValue}>₹{gst}</Text>
        </View>
       
        <View style={styles.billDivider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text style={styles.totalValue}>₹{grandTotal}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.titleText}>My Cart</Text>
        {cart.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={16} color="#ff4757" />
          </TouchableOpacity>
        )}
      </View>

      {cart.length === 0 ? (
        renderEmptyCart()
      ) : (
        <View style={styles.contentContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
          >
            <FlatList
              data={cart}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderCartItem}
              scrollEnabled={false}
            />

            <BillSummary />
            
            {/* Delivery Address Section */}
            <View style={styles.addressSection}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <TouchableOpacity 
                style={styles.addressContainer}
                onPress={() => {
                  setTempAddress(address);
                  setModalVisible(true);
                }}
              >
                <Ionicons name="location-outline" size={16} color="#ff6b35" />
                <View style={styles.addressTextContainer}>
                  <Text style={styles.addressLabel}>Deliver to</Text>
                  <Text style={styles.addressText} numberOfLines={1}>
                    {address || "Add your delivery address"}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Fixed Bottom Order Button */}
          <View style={[styles.bottomContainer, { bottom: insets.bottom + (Platform.OS === 'ios' ? 50 : 60) }]}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalAmount}>₹{grandTotal}</Text>
            </View>
            <TouchableOpacity 
              style={styles.orderButton} 
              onPress={handlePlaceOrder}
            >
              <Text style={styles.orderButtonText}>
                {address ? "Place Order" : "Add Address"}
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Address Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delivery Address</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.addressInput}
              placeholder="Enter your complete address"
              placeholderTextColor="#999"
              value={tempAddress}
              onChangeText={setTempAddress}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            
            <TouchableOpacity 
              style={[styles.modalSaveButton, !tempAddress.trim() && styles.disabledButton]}
              onPress={saveAddress}
              disabled={!tempAddress.trim()}
            >
              <Text style={styles.modalSaveText}>Save Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },

  /** HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  clearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff5f5",
  },

  /** CONTENT */
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
  },

  /** CART ITEM */
  cartItemContainer: {
    marginBottom: 8,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  imageContainer: {
    position: "relative",
    marginRight: 10,
  },
  itemImage: {
    width: 55,
    height: 55,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemDetails: {
    flex: 1,
    marginRight: 6,
  },
  itemName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  itemRestaurant: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#27ae60",
    marginRight: 4,
  },
  itemUnit: {
    fontSize: 11,
    color: "#888",
  },

  /** QUANTITY */
  quantitySection: {
    alignItems: "flex-end",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 16,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ff6b35",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityDisplay: {
    minWidth: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  itemTotal: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },

  /** BILL SUMMARY */
  billContainer: {
    marginTop: 14,
    marginBottom: 12,
  },
  billHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  billTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 5,
    color: "#1a1a1a",
  },
  billContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  billLabel: {
    fontSize: 13,
    color: "#555",
  },
  billValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  discountRow: {
    backgroundColor: "#eafbea",
    borderRadius: 6,
    padding: 6,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  discountLabel: {
    fontSize: 13,
    color: "#27ae60",
    fontWeight: "600",
  },
  discountValue: {
    fontSize: 13,
    color: "#27ae60",
    fontWeight: "700",
  },
  billDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#27ae60",
  },

  /** ADDRESS SECTION */
  addressSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  addressTextContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  addressLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 2,
  },
  addressText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1a1a1a",
  },

  /** BOTTOM ORDER BUTTON */
  bottomContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  totalContainer: {
    flex: 1,
  },
  
  totalAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#27ae60",
  },
  orderButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6b35",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  /** EMPTY CART */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  shopNowButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6b35",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 5,
  },
  shopNowText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  /** MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalHandle: {
    width: 35,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
  },
  addressInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 90,
    textAlignVertical: "top",
    marginBottom: 16,
    backgroundColor: "#fafafa",
  },
  modalSaveButton: {
    backgroundColor: "#ff6b35",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  modalSaveText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});