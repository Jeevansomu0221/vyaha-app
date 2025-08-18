// app/screens/CartScreen.js
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../context/CartContext"; // ✅ global cart

export default function CartScreen() {
  const router = useRouter();
  const { cart, addToCart, decreaseQuantity, removeFromCart } = useCart();

  const totalCost = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>

      {cart.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Your cart is empty</Text>
          <TouchableOpacity
            onPress={() => router.push("/foods")}
            style={styles.addMoreBtn}
          >
            <Text style={styles.addMoreText}>+ Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image source={item.image} style={styles.itemImage} />
                <View style={{ flex: 1 }}>
                  {/* ✅ Variant + Product */}
                  <Text style={styles.itemName}>
                    {item.name}
                  </Text>
                  {/* ✅ Restaurant */}
                  <Text style={styles.itemRestaurant}>From {item.restaurant}</Text>
                  {/* ✅ Price */}
                  <Text style={styles.itemPrice}>
                    ₹{item.price} × {item.quantity}
                  </Text>
                </View>

                {/* Quantity controls */}
                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    onPress={() => decreaseQuantity(item)}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyText}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.qtyNumber}>{item.quantity}</Text>

                  <TouchableOpacity
                    onPress={() => addToCart(item)}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>

                {/* Remove button */}
                <TouchableOpacity
                  onPress={() => removeFromCart(item)}
                  style={styles.removeBtn}
                >
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Total */}
          <Text style={styles.totalText}>Total: ₹{totalCost}</Text>

          {/* Add More */}
          <TouchableOpacity
            onPress={() => router.push("/foods")}
            style={styles.addMoreBtn}
          >
            <Text style={styles.addMoreText}>+ Add more items</Text>
          </TouchableOpacity>

          {/* Delivery Address */}
          <View style={styles.addressBox}>
            <Text style={styles.addressLabel}>Deliver To:</Text>
            <Text style={styles.addressText}>Add your address</Text>
          </View>

          {/* Payment */}
          <TouchableOpacity style={styles.payBtn}>
            <Text style={styles.payText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },

  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 8,
    position: "relative",
  },
  itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  itemName: { fontSize: 16, fontWeight: "600" },
  itemRestaurant: { fontSize: 13, color: "gray", marginTop: 2 },
  itemPrice: { fontSize: 14, color: "green", marginTop: 4 },

  qtyRow: { flexDirection: "row", alignItems: "center" },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { fontSize: 18, fontWeight: "bold" },
  qtyNumber: { marginHorizontal: 12, fontSize: 16, fontWeight: "600" },

  removeBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 4,
  },
  removeText: { fontSize: 16, color: "red" },

  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    textAlign: "right",
  },

  addMoreBtn: { marginVertical: 12, alignItems: "center" },
  addMoreText: { color: "blue", fontSize: 16 },

  addressBox: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
  },
  addressLabel: { fontWeight: "bold", marginBottom: 4 },
  addressText: { color: "gray" },

  payBtn: {
    backgroundColor: "green",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  payText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
