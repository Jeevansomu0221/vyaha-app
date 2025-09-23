import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// Define types for order items
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function OrderDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get order details from route params
  const orderId = params.orderId as string || "N/A";
  const itemsString = params.items as string || "";
  const total = params.total as string || "0";
  const payment = params.payment as string || "COD";
  const address = params.address as string || "No address provided";
  const instructions = params.instructions as string || "No special instructions";
  
  const [orderStatus, setOrderStatus] = useState("Preparing");
  const [progress, setProgress] = useState(25); // 25% progress for "Preparing"

  // Simulate order status updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setOrderStatus("On the way");
      setProgress(60);
    }, 30000); // Change to "On the way" after 30 seconds

    const timer2 = setTimeout(() => {
      setOrderStatus("Delivered");
      setProgress(100);
    }, 60000); // Change to "Delivered" after 60 seconds

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  const handleCancelOrder = () => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            Alert.alert("Order Cancelled", "Your order has been cancelled successfully.");
            router.back();
          },
        },
      ]
    );
  };

  const handleReorder = () => {
    Alert.alert("Reorder", "This feature would add all items to your cart in a real app.");
    // In a real app, this would add all items from the order back to the cart
  };

  const handleHelp = () => {
    Alert.alert("Help", "Contact support at support@foodapp.com or call +91 98765 43210");
  };

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
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Order Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusHeader}>
              <Text style={styles.orderId}>Order # {orderId}</Text>
              <Text style={[styles.statusText, 
                orderStatus === "Preparing" && styles.statusPreparing,
                orderStatus === "On the way" && styles.statusOnTheWay,
                orderStatus === "Delivered" && styles.statusDelivered
              ]}>
                {orderStatus}
              </Text>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Preparing</Text>
                <Text style={styles.progressLabel}>On the way</Text>
                <Text style={styles.progressLabel}>Delivered</Text>
              </View>
            </View>
            
            <View style={styles.estimatedTime}>
              <Text style={styles.estimatedTimeText}>
                {orderStatus === "Preparing" && "Your order is being prepared. Expected delivery in 25-30 minutes."}
                {orderStatus === "On the way" && "Your order is on the way! Expected arrival in 10-15 minutes."}
                {orderStatus === "Delivered" && "Your order has been delivered. Enjoy your meal!"}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <View style={styles.itemsContainer}>
            <Text style={styles.itemsText}>{itemsString}</Text>
            <View style={styles.itemsDivider} />
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalAmount}>₹{total}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Delivery Address</Text>
              <Text style={styles.infoValue}>{address}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Method</Text>
              <Text style={styles.infoValue}>
                {payment === "COD" ? "Cash on Delivery" : "UPI Payment"}
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Special Instructions</Text>
              <Text style={styles.infoValue}>{instructions}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Person */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Delivery Partner</Text>
          <View style={styles.deliveryPerson}>
            <View style={styles.deliveryPersonAvatar}>
              <Text style={styles.deliveryPersonEmoji}>🚴</Text>
            </View>
            <View style={styles.deliveryPersonDetails}>
              <Text style={styles.deliveryPersonName}>Rajesh Kumar</Text>
              <Text style={styles.deliveryPersonPhone}>+91 98765 43210</Text>
              <Text style={styles.deliveryPersonRating}>⭐ 4.8 (256 deliveries)</Text>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.reorderButton]}
              onPress={handleReorder}
            >
              <Text style={styles.reorderButtonText}>Reorder</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.helpButton]}
              onPress={handleHelp}
            >
              <Text style={styles.helpButtonText}>Get Help</Text>
            </TouchableOpacity>
            
            {orderStatus !== "Delivered" && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleCancelOrder}
              >
                <Text style={styles.cancelButtonText}>Cancel Order</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  statusContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#636e72",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPreparing: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
  statusOnTheWay: {
    backgroundColor: "#cce5ff",
    color: "#004085",
  },
  statusDelivered: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e9ecef",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 12,
    color: "#636e72",
  },
  estimatedTime: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  estimatedTimeText: {
    fontSize: 14,
    color: "#2d3436",
    textAlign: "center",
  },
  itemsContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  itemsText: {
    fontSize: 14,
    color: "#2d3436",
    lineHeight: 20,
  },
  itemsDivider: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginVertical: 12,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3436",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4CAF50",
  },
  infoContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#636e72",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#2d3436",
    fontWeight: "500",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginVertical: 12,
  },
  deliveryPerson: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  deliveryPersonAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e3f2fd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  deliveryPersonEmoji: {
    fontSize: 24,
  },
  deliveryPersonDetails: {
    flex: 1,
  },
  deliveryPersonName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 2,
  },
  deliveryPersonPhone: {
    fontSize: 12,
    color: "#636e72",
    marginBottom: 2,
  },
  deliveryPersonRating: {
    fontSize: 12,
    color: "#4CAF50",
  },
  callButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  callButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 120,
    alignItems: "center",
  },
  reorderButton: {
    backgroundColor: "#4CAF50",
  },
  helpButton: {
    backgroundColor: "#2196F3",
  },
  cancelButton: {
    backgroundColor: "#ffebee",
    borderWidth: 1,
    borderColor: "#f44336",
  },
  reorderButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  helpButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelButtonText: {
    color: "#f44336",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 20,
  },
});