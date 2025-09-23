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

export default function OrderSummaryScreen() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [instructionModalVisible, setInstructionModalVisible] = useState(false);
  const [tempInstructions, setTempInstructions] = useState("");
  const [address, setAddress] = useState("");
  const [expandedAddons, setExpandedAddons] = useState<Record<string, boolean>>({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Get address from route params (passed from CartScreen)
  useEffect(() => {
    if (params?.address && typeof params.address === "string") {
      setAddress(params.address);
    } else {
      // Fallback address
      setAddress("Please add delivery address from cart");
    }
  }, [params]);

  // Compact Add-ons with multiple price options
  const addons: Record<string, Addon[]> = {
    drinks: [
      { 
        id: "drink1", 
        name: "Thumbs Up", 
        image: "🥤",
        options: [
          { size: "250ml", price: 30 },
          { size: "600ml", price: 45 },
          { size: "1.25L", price: 120 }
        ]
      },
      { 
        id: "drink2", 
        name: "Coca Cola", 
        image: "🥤",
        options: [
          { size: "250ml", price: 30 },
          { size: "600ml", price: 45 },
          { size: "1.25L", price: 120 }
        ]
      },
      { 
        id: "drink3", 
        name: "Sprite", 
        image: "🥤",
        options: [
          { size: "250ml", price: 30 },
          { size: "600ml", price: 45 },
          { size: "1.25L", price: 120 }
        ]
      },
    ],
    icecream: [
      { 
        id: "ice1", 
        name: "Vanilla", 
        image: "🍦",
        options: [
          { size: "Cup", price: 25 },
          { size: "Cone", price: 35 },
          { size: "Tub", price: 85 }
        ]
      },
      { 
        id: "ice2", 
        name: "Chocolate", 
        image: "🍨",
        options: [
          { size: "Cup", price: 25 },
          { size: "Bar", price: 40 },
          { size: "Tub", price: 90 }
        ]
      },
      { 
        id: "ice3", 
        name: "Kulfi", 
        image: "🍦",
        options: [
          { size: "Stick", price: 20 },
          { size: "Cup", price: 35 },
          { size: "Family", price: 75 }
        ]
      },
    ],
    extras: [
      { 
        id: "extra1", 
        name: "Sauce", 
        image: "🥄",
        options: [
          { size: "Sachet", price: 5 },
          { size: "Small", price: 15 },
          { size: "Large", price: 25 }
        ]
      },
      { 
        id: "extra2", 
        name: "Cheese", 
        image: "🧀",
        options: [
          { size: "Sprinkle", price: 10 },
          { size: "Extra", price: 25 },
          { size: "Double", price: 45 }
        ]
      },
    ]
  };

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

  const toggleAddonExpansion = (addonId: string) => {
    setExpandedAddons(prev => ({
      ...prev,
      [addonId]: !prev[addonId]
    }));
  };

  // Calculate totals (matching CartScreen logic)
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

  // Simulate order placement without Firebase
  const simulatePlaceOrder = async (order: any): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a random order ID
    const orderId = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // In a real app, you would save to your backend here
    console.log("Order placed:", order);
    
    return orderId;
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      Alert.alert("Error", "Your cart is empty. Please add items before placing an order.");
      return;
    }

    setIsPlacingOrder(true);
    try {
      // Prepare order items
      const orderItems: OrderItem[] = cart.map((item: CartItem) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      }));

      // Prepare the order object
      const order = {
        items: orderItems,
        address: address,
        paymentMethod: paymentMethod,
        deliveryInstructions: deliveryInstructions,
        total: grandTotal,
        addons: selectedAddons,
      };

      // Simulate order placement
      const response = await fetch("http://<YOUR_BACKEND_URL>/api/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(order),
});

if (!response.ok) throw new Error("Failed to place order");

const data = await response.json();
const orderId = data.order._id; // returned from backend

      
      // Clear cart after successful order
      clearCart();
      
      // Navigate to order details screen
      router.push({
        pathname: "/OrderDetails",
        params: {
          orderId,
          items: order.items.map(i => `${i.name} x${i.quantity}`).join(", "),
          total: grandTotal.toString(),
          payment: paymentMethod,
          address: address,
          instructions: deliveryInstructions,
        },
      });
    } catch (error) {
      console.error("Order failed:", error);
      Alert.alert("Order Failed", "There was an error placing your order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const renderAddonCategory = (category: string, items: Addon[]) => (
    <View style={styles.addonCategory}>
      <Text style={styles.addonCategoryTitle}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Text>
      <View style={styles.addonItemsContainer}>
        {items.map((addon) => {
          const isExpanded = expandedAddons[addon.id];
          const selectedOptions = selectedAddons.filter(item => item.id === addon.id);
          
          return (
            <View key={addon.id} style={styles.addonItem}>
              <TouchableOpacity 
                style={styles.addonHeader}
                onPress={() => toggleAddonExpansion(addon.id)}
                activeOpacity={0.7}
              >
                <View style={styles.addonHeaderLeft}>
                  <Text style={styles.addonEmoji}>{addon.image}</Text>
                  <View>
                    <Text style={styles.addonName}>{addon.name}</Text>
                    {selectedOptions.length > 0 && (
                      <Text style={styles.selectedOptionsText}>
                        {selectedOptions.map(opt => opt.size).join(', ')}
                      </Text>
                    )}
                  </View>
                </View>
                <Text style={[styles.arrowIcon, isExpanded && styles.arrowExpanded]}>
                  {isExpanded ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>
              
              {isExpanded && (
                <View style={styles.addonOptionsContainer}>
                  <View style={styles.addonOptionsRow}>
                    {addon.options.map((option: AddonOption, index: number) => {
                      const addonKey = `${addon.id}-${index}`;
                      const isSelected = selectedAddons.find(item => item.key === addonKey);
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.addonOptionChip,
                            isSelected && styles.addonOptionSelected,
                          ]}
                          onPress={() => toggleAddon(addon.id, index, addon)}
                        >
                          <Text style={[
                            styles.addonOptionText,
                            isSelected && styles.addonOptionTextSelected
                          ]}>
                            {option.size}
                          </Text>
                          <Text style={[
                            styles.addonOptionPrice,
                            isSelected && styles.addonOptionPriceSelected
                          ]}>
                            ₹{option.price}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
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

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivering to</Text>
          <View style={styles.addressContainer}>
            <View style={styles.addressIcon}>
              <Text style={styles.addressIconText}>📍</Text>
            </View>
            <View style={styles.addressContent}>
              <Text style={styles.addressText} numberOfLines={2}>{address || "No address selected"}</Text>
              <Text style={styles.deliveryTime}>Expected delivery in 25-30 minutes</Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Order</Text>
          <FlatList
            data={cart}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }: { item: CartItem }) => (
              <View style={styles.orderItem}>
                <Image source={item.image} style={styles.orderItemImage} />
                <View style={styles.orderItemDetails}>
                  <Text style={styles.orderItemName} numberOfLines={1}>{item.name}</Text>
                  {item.restaurant && (
                    <Text style={styles.orderItemRestaurant} numberOfLines={1}>{item.restaurant}</Text>
                  )}
                  <View style={styles.orderItemPriceRow}>
                    <Text style={styles.orderItemPrice}>₹{item.price}</Text>
                    <Text style={styles.orderItemUnit}>/{item.unit || "pc"}</Text>
                  </View>
                </View>
                <View style={styles.quantityBadge}>
                  <Text style={styles.quantityText}>{item.quantity || 1}</Text>
                </View>
              </View>
            )}
            scrollEnabled={false}
          />
        </View>

        {/* Add-ons - Collapsible Design */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Add Extras</Text>
            <Text style={styles.addonCount}>{selectedAddons.length} selected</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Make your meal even better</Text>
          
          <View style={styles.addonsContainer}>
            {Object.entries(addons).map(([category, items]) => 
              renderAddonCategory(category, items)
            )}
          </View>
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
                <Text style={styles.deliveryBoyPhone}>📞 +91 98765 43210</Text>
                <Text style={styles.estimatedTime}>⏱️ 25-30 min</Text>
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
                <Text style={styles.instructionsLabel}>Special Instructions</Text>
                <Text style={styles.instructionsText} numberOfLines={1}>
                  {deliveryInstructions || "Add delivery instructions (optional)"}
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
              <Text style={styles.paymentDesc}>Pay when your order arrives</Text>
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

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Fixed Bottom */}
      <View style={styles.bottomContainer}>
        <View style={styles.totalSummary}>
          <Text style={styles.payableText}>₹{grandTotal}</Text>
          <Text style={styles.savingsText}>
            {selectedAddons.length > 0 ? `${selectedAddons.length} add-on${selectedAddons.length > 1 ? 's' : ''}` : 'Total payable'}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.confirmBtn, isPlacingOrder && styles.confirmBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder || cart.length === 0}
        >
          <Text style={styles.confirmBtnText}>
            {isPlacingOrder ? "Placing Order..." : "Confirm Order"}
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
              value={tempInstructions}
              onChangeText={setTempInstructions}
              multiline
              textAlignVertical="top"
            />
            
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
                <Text style={styles.modalSaveText}>Save Instructions</Text>
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
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  backBtn: {
    padding: 8,
  },
  backBtnText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3436",
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: "#fff",
    marginBottom: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#636e72",
    marginBottom: 12,
  },
  addonCount: {
    fontSize: 13,
    color: "#4CAF50",
    fontWeight: "600",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressIcon: {
    marginRight: 12,
  },
  addressIconText: {
    fontSize: 20,
  },
  addressContent: {
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 4,
  },
  deliveryTime: {
    fontSize: 12,
    color: "#4CAF50",
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f2f6",
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
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 2,
  },
  orderItemRestaurant: {
    fontSize: 12,
    color: "#636e72",
    marginBottom: 4,
  },
  orderItemPriceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4CAF50",
  },
  orderItemUnit: {
    fontSize: 12,
    color: "#636e72",
    marginLeft: 4,
  },
  quantityBadge: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  addonsContainer: {
    marginTop: 8,
  },
  addonCategory: {
    marginBottom: 16,
  },
  addonCategoryTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 8,
  },
  addonItemsContainer: {
    gap: 8,
  },
  addonItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    overflow: "hidden",
  },
  addonHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  addonHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  addonEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  addonName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2d3436",
  },
  selectedOptionsText: {
    fontSize: 12,
    color: "#4CAF50",
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 12,
    color: "#636e72",
  },
  arrowExpanded: {
    transform: [{ rotate: "0deg" }],
  },
  addonOptionsContainer: {
    padding: 12,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  addonOptionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  addonOptionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  addonOptionSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  addonOptionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#636e72",
  },
  addonOptionTextSelected: {
    color: "#fff",
  },
  addonOptionPrice: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4CAF50",
  },
  addonOptionPriceSelected: {
    color: "#fff",
  },
  deliveryInfo: {
    gap: 12,
  },
  deliveryBoyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
  },
  deliveryBoyAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e3f2fd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  deliveryBoyEmoji: {
    fontSize: 24,
  },
  deliveryBoyDetails: {
    flex: 1,
  },
  deliveryBoyName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 2,
  },
  deliveryBoyPhone: {
    fontSize: 12,
    color: "#636e72",
    marginBottom: 2,
  },
  estimatedTime: {
    fontSize: 12,
    color: "#4CAF50",
  },
  instructionsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
  },
  instructionsIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  instructionsContent: {
    flex: 1,
  },
  instructionsLabel: {
    fontSize: 12,
    color: "#636e72",
    marginBottom: 2,
  },
  instructionsText: {
    fontSize: 14,
    color: "#2d3436",
  },
  chevron: {
    fontSize: 20,
    color: "#636e72",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  paymentSelected: {
    backgroundColor: "#e8f5e8",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: "600",
    color: "##2d3436",
    marginBottom: 2,
  },
  paymentDesc: {
    fontSize: 12,
    color: "#636e72",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 14,
    color: "#636e72",
  },
  billValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2d3436",
  },
  billDivider: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d3436",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4CAF50",
  },
  bottomSpacing: {
    height: 100,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    padding: 16,
    paddingBottom: 24,
  },
  totalSummary: {
    flex: 1,
  },
  payableText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4CAF50",
  },
  savingsText: {
    fontSize: 12,
    color: "#636e72",
  },
  confirmBtn: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginLeft: 16,
  },
  confirmBtnDisabled: {
    backgroundColor: "#a5d6a7",
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3436",
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 24,
    color: "#636e72",
  },
  instructionsInput: {
    minHeight: 120,
    padding: 16,
    fontSize: 14,
    color: "#2d3436",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    gap: 12,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalCancelText: {
    fontSize: 14,
    color: "#636e72",
    fontWeight: "600",
  },
  modalSaveBtn: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalSaveText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});