import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ImageSourcePropType,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "./context/CartContext";
import API from "./data/api/apiClient";
import { useAuth } from "./context/AuthContext";

// Define types for addons
interface AddonOption {
  size: string;
  price: number;
}

interface Addon {
  id: string;
  name: string;
  image: string;
  options: AddonOption[];
}

interface SelectedAddon {
  key: string;
  id: string;
  name: string;
  size: string;
  price: number;
  image: string;
}

// Define CartItem interface to match what's in your cart context
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: ImageSourcePropType;
  restaurant?: string;
  unit?: string;
  quantity?: number;
}

// Define OrderItem interface for order processing
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Define API response interface
interface OrderResponse {
  order: {
    _id: string;
    // Add other order properties you expect from the backend
  };
}

// Define order payload interface
interface OrderPayload {
  items: OrderItem[];
  address: string;
  paymentMethod: string;
  deliveryInstructions: string;
  total: number;
  addons: SelectedAddon[];
  partnerId: string | undefined;
}

export default function OrderSummaryScreen() {
  const { cart, clearCart, restaurantId } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [instructionModalVisible, setInstructionModalVisible] = useState(false);
  const [tempInstructions, setTempInstructions] = useState("");
  const [address, setAddress] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showAddons, setShowAddons] = useState(false); // NEW: Control addons visibility

  // Get address from route params (passed from CartScreen)
  useEffect(() => {
    if (params?.address && typeof params.address === "string") {
      setAddress(params.address);
    } else {
      // Fallback address
      setAddress("Please add delivery address from cart");
    }
  }, [params]);

  // Clean Add-ons data matching the screenshot format
  const addons: Addon[] = [
    { 
      id: "thumbsup", 
      name: "Thumbs Up", 
      image: "🥤",
      options: [
        { size: "250ml", price: 30 },
        { size: "600ml", price: 45 },
        { size: "1.25L", price: 120 }
      ]
    },
    { 
      id: "sauce", 
      name: "Sauce", 
      image: "🥄",
      options: [
        { size: "Regular", price: 10 },
        { size: "Extra", price: 15 }
      ]
    },
    { 
      id: "cocacola", 
      name: "Coca Cola", 
      image: "🥤",
      options: [
        { size: "250ml", price: 30 },
        { size: "600ml", price: 45 },
        { size: "1.25L", price: 120 }
      ]
    },
    { 
      id: "sprite", 
      name: "Sprite", 
      image: "🥤",
      options: [
        { size: "250ml", price: 30 },
        { size: "600ml", price: 45 },
        { size: "1.25L", price: 120 }
      ]
    },
    { 
      id: "chocolate", 
      name: "Chocolate", 
      image: "🍫",
      options: [
        { size: "Small", price: 20 },
        { size: "Medium", price: 35 },
        { size: "Large", price: 50 }
      ]
    },
    { 
      id: "kulfi", 
      name: "Kulfi", 
      image: "🍦",
      options: [
        { size: "Single", price: 25 },
        { size: "Double", price: 45 }
      ]
    },
    { 
      id: "cheese", 
      name: "Cheese", 
      image: "🧀",
      options: [
        { size: "Regular", price: 15 },
        { size: "Extra", price: 25 }
      ]
    }
  ];

  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);

  const toggleAddon = (addonId: string, optionIndex: number, addon: Addon) => {
    const addonKey = `${addonId}-${optionIndex}`;
    const existingIndex = selectedAddons.findIndex(item => item.key === addonKey);
    
    if (existingIndex !== -1) {
      setSelectedAddons(selectedAddons.filter(item => item.key !== addonKey));
    } else {
      const selectedOption = addon.options[optionIndex];
      setSelectedAddons([...selectedAddons, {
        key: addonKey,
        id: addonId,
        name: addon.name,
        size: selectedOption.size,
        price: selectedOption.price,
        image: addon.image
      }]);
    }
  };

  // Calculate totals
  const totalCost = cart.reduce(
    (sum: number, item: CartItem) => sum + (item.quantity || 1) * item.price,
    0
  );
  
  const deliveryFee = cart.length > 0 ? 30 : 0;
  const platformFee = 0;
  const gst = cart.length > 0 ? Math.round(totalCost * 0.05) : 0;
  const addonsTotal = selectedAddons.reduce((sum: number, addon) => sum + addon.price, 0);
  const grandTotal = totalCost + deliveryFee + platformFee + gst + addonsTotal;

  const saveInstructions = () => {
    setDeliveryInstructions(tempInstructions);
    setInstructionModalVisible(false);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      Alert.alert("Error", "Your cart is empty. Please add items before placing an order.");
      return;
    }

    if (!isAuthenticated || !user) {
      Alert.alert("Login Required", "Please login before placing an order.");
      return;
    }

    if (user.guest) {
      Alert.alert(
        "Guest Mode", 
        "Please create an account to place orders. Guest users can only browse the menu.",
        [
          { text: "Continue Browsing", style: "cancel" },
          { text: "Create Account", onPress: () => router.push("/auth/login") }
        ]
      );
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderItems: OrderItem[] = cart.map((item: CartItem) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      }));

      const order: OrderPayload = {
        items: orderItems,
        address,
        paymentMethod,
        deliveryInstructions,
        total: grandTotal,
        addons: selectedAddons,
        partnerId: restaurantId,
      };

      console.log("Placing order:", order);
      const { data } = await API.post<OrderResponse>("/orders", order);
      console.log("Order response:", data);

      clearCart();

      router.push({
        pathname: "/OrderDetails",
        params: {
          orderId: data.order._id,
          items: order.items.map((i: OrderItem) => `${i.name} x${i.quantity}`).join(", "),
          total: grandTotal.toString(),
          payment: paymentMethod,
          address,
          instructions: deliveryInstructions,
        },
      });
    } catch (error: any) {
      console.error("Order failed:", error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        Alert.alert(
          "Session Expired", 
          "Please login again to continue.",
          [{ text: "OK", onPress: () => router.push("/auth/login") }]
        );
      } else {
        Alert.alert(
          "Order Failed",
          error.response?.data?.message || "There was an error placing your order. Please try again."
        );
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // UPDATED: Collapsible Add-ons Section
  const renderCollapsibleAddons = () => (
    <View style={styles.addonsContainer}>
      <TouchableOpacity 
        style={styles.addonsHeader}
        onPress={() => setShowAddons(!showAddons)}
        activeOpacity={0.7}
      >
        <View style={styles.addonsTitleContainer}>
          <Text style={styles.sectionTitle}>Add Extras</Text>
          <Text style={styles.optionalText}>Optional</Text>
        </View>
        <View style={styles.addonsToggleContainer}>
          {selectedAddons.length > 0 && (
            <View style={styles.selectedCountBadge}>
              <Text style={styles.selectedCountText}>{selectedAddons.length}</Text>
            </View>
          )}
          <Text style={styles.toggleIcon}>
            {showAddons ? '▲' : '▼'}
          </Text>
        </View>
      </TouchableOpacity>

      {showAddons && (
        <View style={styles.addonsContent}>
          {addons.map((addon) => (
            <View key={addon.id} style={styles.addonBlock}>
              {/* Addon Header */}
              <View style={styles.addonHeaderRow}>
                <Text style={styles.addonEmoji}>{addon.image}</Text>
                <Text style={styles.addonTitle}>{addon.name}</Text>
              </View>

              {/* Options */}
              {addon.options.map((option, index) => {
                const addonKey = `${addon.id}-${index}`;
                const isSelected = selectedAddons.some(item => item.key === addonKey);

                return (
                  <TouchableOpacity
                    key={addonKey}
                    style={[
                      styles.optionRow,
                      isSelected && styles.optionRowSelected,
                    ]}
                    onPress={() => toggleAddon(addon.id, index, addon)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.optionSize,
                      isSelected && styles.optionSizeSelected
                    ]}>
                      {option.size}
                    </Text>

                    <Text style={[
                      styles.optionPrice,
                      isSelected && styles.optionPriceSelected
                    ]}>
                      ₹{option.price}
                    </Text>

                    <View style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected
                    ]}>
                      {isSelected && <Text style={styles.checkMark}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      )}

      {/* Show selected addons summary when collapsed */}
      {!showAddons && selectedAddons.length > 0 && (
        <View style={styles.selectedAddonsSummary}>
          <Text style={styles.selectedAddonsText}>
            {selectedAddons.map(addon => `${addon.name} (${addon.size})`).join(', ')}
          </Text>
          <Text style={styles.selectedAddonsTotal}>₹{addonsTotal}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Summary</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Scrollable content */}
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivering to</Text>
          <View style={styles.addressContainer}>
            <View style={styles.addressIcon}>
              <Text style={styles.addressIconText}>📍</Text>
            </View>
            <View style={styles.addressContent}>
              <Text style={styles.addressText} numberOfLines={2}>
                {address || "No address selected"}
              </Text>
              <Text style={styles.deliveryTime}>25-30 min • Free delivery</Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        {cart.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Your Order</Text>
              <Text style={styles.itemCount}>{cart.length} items</Text>
            </View>
            <FlatList
              data={cart}
              keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
              renderItem={({ item }) => (
                <View style={styles.orderItem}>
                  <Image source={item.image} style={styles.orderItemImage} />
                  <View style={styles.orderItemDetails}>
                    <Text style={styles.orderItemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    {item.restaurant && (
                      <Text style={styles.orderItemRestaurant} numberOfLines={1}>
                        {item.restaurant}
                      </Text>
                    )}
                    <View style={styles.orderItemBottomRow}>
                      <Text style={styles.orderItemPrice}>₹{item.price}</Text>
                      {item.unit && (
                        <Text style={styles.orderItemUnit}>/ {item.unit}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.quantityBadge}>
                    <Text style={styles.quantityText}>×{item.quantity || 1}</Text>
                  </View>
                </View>
              )}
              scrollEnabled={false}
            />
          </View>
        ) : null}

        {/* Add-ons Section - UPDATED Collapsible Design */}
        <View style={styles.section}>
          {renderCollapsibleAddons()}
        </View>

        {/* Delivery Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryBoyCard}>
              <View style={styles.deliveryBoyAvatar}>
                <Text style={styles.deliveryBoyEmoji}>🏍️</Text>
              </View>
              <View style={styles.deliveryBoyDetails}>
                <Text style={styles.deliveryBoyName}>Rajesh Kumar</Text>
                <View style={styles.deliveryBoyInfoRow}>
                  <Text style={styles.deliveryBoyPhone}>📞 +91 98765 43210</Text>
                  <Text style={styles.dotSeparator}>•</Text>
                  <Text style={styles.estimatedTime}>⏱️ 25-30 min</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.instructionsButton}
              onPress={() => {
                setTempInstructions(deliveryInstructions);
                setInstructionModalVisible(true);
              }}
            >
              <Text style={styles.instructionsIcon}>💬</Text>
              <View style={styles.instructionsContent}>
                <Text style={styles.instructionsLabel}>Delivery Instructions</Text>
                <Text style={styles.instructionsText} numberOfLines={1}>
                  {deliveryInstructions || "Add instructions (optional)"}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === "COD" && styles.paymentSelected,
            ]}
            onPress={() => setPaymentMethod("COD")}
          >
            <View style={styles.paymentIcon}>
              <Text>💵</Text>
            </View>
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentName}>Cash on Delivery</Text>
              <Text style={styles.paymentDesc}>Pay when order arrives</Text>
            </View>
            <View style={styles.radioButton}>
              {paymentMethod === "COD" && <View style={styles.radioSelected} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === "UPI" && styles.paymentSelected,
            ]}
            onPress={() => setPaymentMethod("UPI")}
          >
            <View style={styles.paymentIcon}>
              <Text>📱</Text>
            </View>
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentName}>UPI Payment</Text>
              <Text style={styles.paymentDesc}>Pay instantly via UPI</Text>
            </View>
            <View style={styles.radioButton}>
              {paymentMethod === "UPI" && <View style={styles.radioSelected} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Bill Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item total</Text>
            <Text style={styles.billValue}>₹{totalCost}</Text>
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

          {addonsTotal > 0 && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Add-ons</Text>
              <Text style={styles.billValue}>₹{addonsTotal}</Text>
            </View>
          )}
          
          <View style={styles.billDivider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>₹{grandTotal}</Text>
          </View>
        </View>

        {/* Bottom spacing for fixed button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomContainer}>
        <View style={styles.totalSummary}>
          <Text style={styles.totalLabel}>Total Payable</Text>
          <Text style={styles.payableText}>₹{grandTotal}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.confirmBtn, isPlacingOrder && styles.confirmBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder || cart.length === 0}
        >
          <Text style={styles.confirmBtnText}>
            {isPlacingOrder ? "Processing..." : "Confirm Order"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Instructions Modal */}
      <Modal
        visible={instructionModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setInstructionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delivery Instructions</Text>
              <TouchableOpacity
                onPress={() => setInstructionModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>×</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.instructionsInput}
              placeholder="e.g., Ring the doorbell, Leave at door, Call when you arrive..."
              placeholderTextColor="#9ca3af"
              value={tempInstructions}
              onChangeText={setTempInstructions}
              multiline
              textAlignVertical="top"
              maxLength={200}
            />
            
            <View style={styles.characterCount}>
              <Text style={styles.characterCountText}>
                {tempInstructions.length}/200 characters
              </Text>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setInstructionModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalSaveBtn} 
                onPress={saveInstructions}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    zIndex: 100,
  },
  backBtn: {
    padding: 4,
  },
  backBtnText: {
    fontSize: 20,
    color: "#374151",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  headerSpacer: {
    width: 32,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  section: {
    backgroundColor: "#fff",
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 0,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  addressIcon: {
    marginRight: 12,
  },
  addressIconText: {
    fontSize: 18,
  },
  addressContent: {
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
    lineHeight: 18,
  },
  deliveryTime: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "500",
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  orderItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  orderItemRestaurant: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 6,
  },
  orderItemBottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#dc2626",
  },
  orderItemUnit: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  quantityBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 36,
    alignItems: "center",
  },
  quantityText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 13,
  },
  
  // UPDATED COLLAPSIBLE ADD-ONS STYLES
  addonsContainer: {
    marginTop: 4,
  },
  addonsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 4,
  },
  addonsTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionalText: {
    fontSize: 12,
    color: "#9ca3af",
    marginLeft: 8,
  },
  addonsToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedCountBadge: {
    backgroundColor: "#dc2626",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  selectedCountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  toggleIcon: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "bold",
  },
  addonsContent: {
    marginTop: 4,
  },
  addonBlock: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  addonHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  addonEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  addonTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  optionRowSelected: {
    borderColor: "#dc2626",
    backgroundColor: "#fef2f2",
  },
  optionSize: {
    fontSize: 13,
    color: "#374151",
    flex: 1,
  },
  optionSizeSelected: {
    color: "#dc2626",
    fontWeight: "600",
  },
  optionPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginRight: 12,
  },
  optionPriceSelected: {
    color: "#dc2626",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    backgroundColor: "#dc2626",
    borderColor: "#dc2626",
  },
  checkMark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  selectedAddonsSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 8,
  },
  selectedAddonsText: {
    fontSize: 12,
    color: "#374151",
    flex: 1,
    marginRight: 8,
  },
  selectedAddonsTotal: {
    fontSize: 12,
    fontWeight: "600",
    color: "#dc2626",
  },
  
  deliveryInfo: {
    gap: 10,
  },
  deliveryBoyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  deliveryBoyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#86efac",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  deliveryBoyEmoji: {
    fontSize: 18,
  },
  deliveryBoyDetails: {
    flex: 1,
  },
  deliveryBoyName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#166534",
    marginBottom: 4,
  },
  deliveryBoyInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryBoyPhone: {
    fontSize: 12,
    color: "#16a34a",
  },
  dotSeparator: {
    fontSize: 10,
    color: "#86efac",
    marginHorizontal: 6,
  },
  estimatedTime: {
    fontSize: 12,
    color: "#16a34a",
    fontWeight: "500",
  },
  instructionsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  instructionsIcon: {
    fontSize: 18,
    marginRight: 10,
    width: 24,
  },
  instructionsContent: {
    flex: 1,
  },
  instructionsLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  instructionsText: {
    fontSize: 12,
    color: "#6b7280",
  },
  chevron: {
    fontSize: 16,
    color: "#9ca3af",
    fontWeight: "300",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 8,
  },
  paymentSelected: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  paymentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  paymentDesc: {
    fontSize: 12,
    color: "#6b7280",
  },
  radioButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#dc2626",
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  billLabel: {
    fontSize: 13,
    color: "#6b7280",
  },
  billValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
  },
  billDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#dc2626",
  },
  bottomSpacing: {
    height: 80,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  totalSummary: {
    flex: 1,
  },
  payableText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#dc2626",
    marginTop: 2,
  },
  confirmBtn: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 140,
    alignItems: "center",
  },
  confirmBtnDisabled: {
    backgroundColor: "#9ca3af",
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 22,
    color: "#6b7280",
  },
  instructionsInput: {
    height: 100,
    padding: 16,
    margin: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 14,
    color: "#111827",
    lineHeight: 18,
  },
  characterCount: {
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  characterCountText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  modalActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#dc2626",
    alignItems: "center",
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});