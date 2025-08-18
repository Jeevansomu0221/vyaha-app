import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "./context/CartContext"; // ✅

export default function ProductDetail() {
  const { name } = useLocalSearchParams();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(
    null
  );

  const { addToCart } = useCart();

  // ✅ Inline product data
  const products = [
    {
      name: "Samosa",
      image: require("../assets/images/foods/samosa.jpg"),
      types: [
        {
          name: "Aloo Samosa",
          price: 20,
          image: require("../assets/images/foods/samosa.jpg"),
        },
        {
          name: "Paneer Samosa",
          price: 30,
          image: require("../assets/images/foods/paneersamosa.jpg"),
        },
        {
          name: "Corn Samosa",
          price: 25,
          image: require("../assets/images/foods/cornsamosa.jpg"),
        },
      ],
      restaurants: ["Bombay Chaat", "Biryani House", "Street Foods"],
    },
    {
      name: "Pani Puri",
      image: require("../assets/images/foods/panipuri.jpg"),
      types: [
        {
          name: "Classic Pani Puri",
          price: 40,
          image: require("../assets/images/foods/panipuri.jpg"),
        },
        {
          name: "Dahi Puri",
          price: 50,
          image: require("../assets/images/foods/panipuri2.jpg"),
        },
        {
          name: "Bhel Puri",
          price: 40,
          image: require("../assets/images/foods/panipuri3.jpg"),
        },
      ],
      restaurants: ["Chatori Gali", "Delhi Chat Center", "Street Foods"],
    },
    {
      name: "Vada Pav",
      image: require("../assets/images/foods/vadapav.jpg"),
      types: [
        {
          name: "Classic Vada Pav",
          price: 25,
          image: require("../assets/images/foods/vadapav.jpg"),
        },
        {
          name: "Spicy Vada Pav",
          price: 35,
          image: require("../assets/images/foods/vadapav.jpg"),
        },
      ],
      restaurants: ["Mumbai Junction", "Bombay Bites", "Quick Eats"],
    },
    {
      name: "Shawarma",
      image: require("../assets/images/foods/shawarma.jpg"),
      types: [
        {
          name: "Classic Chicken Shawarma",
          price: 60,
          image: require("../assets/images/foods/shawarma1.jpg"),
        },
        {
          name: "Paneer shawarma",
          price: 80,
          image: require("../assets/images/foods/shawarma.jpg"),
        },
      ],
      restaurants: ["Shiv Sagar", "Cream Centre", "Food Street"],
    },
    {
      name: "Manchuria",
      image: require("../assets/images/foods/manchuria.jpg"),
      types: [
        {
          name: "Gobi Manchuria",
          price: 60,
          image: require("../assets/images/foods/manchuria1.jpg"),
        },
        {
          name: "Veg Manchuria",
          price: 80,
          image: require("../assets/images/foods/manchuria2.jpg"),
        },
        {
          name: "Paneer Manchuria",
          price: 60,
          image: require("../assets/images/foods/manchuria3.jpg"),
        },
        {
          name: "Mushroom Manchuria",
          price: 80,
          image: require("../assets/images/foods/manchuria4.jpg"),
        },
      ],
      restaurants: ["Shiv Sagar", "Cream Centre", "Food Street"],
    },
    {
      name: "Noodles",
      image: require("../assets/images/foods/noodles.jpg"),
      types: [
        {
          name: "chicken noodles",
          price: 60,
          image: require("../assets/images/foods/noodles1.jpg"),
        },
        {
          name: "Egg noodles",
          price: 80,
          image: require("../assets/images/foods/noodles2.jpg"),
        },
        {
          name: "Maggie",
          price: 80,
          image: require("../assets/images/foods/noodles3.jpg"),
        },
      ],
      restaurants: ["Shiv Sagar", "Cream Centre", "Food Street"],
    },
    {
      name: "Puffs",
      image: require("../assets/images/foods/vegpuff.jpg"),
      types: [
        {
          name: "chicken puff",
          price: 60,
          image: require("../assets/images/foods/puff1.jpg"),
        },
        {
          name: "Egg puff",
          price: 80,
          image: require("../assets/images/foods/puff2.jpg"),
        },
        {
          name: "veg puff",
          price: 80,
          image: require("../assets/images/foods/vegpuff.jpg"),
        },
      ],
      restaurants: ["Shiv Sagar", "Cream Centre", "Food Street"],
    },
    {
      name: "Pizza",
      image: require("../assets/images/foods/pizza.jpg"),
      types: [
        {
          name: "chicken pizza",
          price: 60,
          image: require("../assets/images/foods/pizza1.jpg"),
        },
        {
          name: "paneer pizza",
          price: 80,
          image: require("../assets/images/foods/pizza2.jpg"),
        },
        {
          name: "veg pizza",
          price: 80,
          image: require("../assets/images/foods/pizza3.jpg"),
        },
      ],
      restaurants: ["Shiv Sagar", "Cream Centre", "Food Street"],
    },
    {
      name: "Burger",
      image: require("../assets/images/foods/burger.jpg"),
      types: [
        {
          name: "chicken Burger",
          price: 60,
          image: require("../assets/images/foods/burger1.jpg"),
        },
        {
          name: "Veg Burger",
          price: 80,
          image: require("../assets/images/foods/burger2.jpg"),
        },
      ],
      restaurants: ["Shiv Sagar", "Cream Centre", "Food Street"],
    },
    {
      name: "Cakes",
      image: require("../assets/images/foods/cakes.jpg"),
      types: [
        {
          name: "Chocolate cake",
          price: 60,
          image: require("../assets/images/foods/cakes.jpg"),
        },
        {
          name: "Vanila cake",
          price: 80,
          image: require("../assets/images/foods/cakes.jpg"),
        },
        {
          name: "Strawberry cake",
          price: 80,
          image: require("../assets/images/foods/cakes.jpg"),
        },
      ],
      restaurants: ["Shiv Sagar", "Cream Centre", "Food Street"],
    },
    {
      name: "Dosa",
      image: require("../assets/images/foods/dosa.jpg"),
      types: [
        {
          name: "Masala Dosa",
          price: 60,
          image: require("../assets/images/foods/dosa1.jpg"),
        },
        {
          name: "aloo dosa",
          price: 80,
          image: require("../assets/images/foods/dosa2.jpg"),
        },
        {
          name: "Egg Dosa",
          price: 80,
          image: require("../assets/images/foods/dosa3.jpg"),
        },
      ],
      restaurants: ["Shiv Sagar", "Cream Centre", "Food Street"],
    },
    {
      name: "Juices",
      image: require("../assets/images/foods/juices.jpg"),
      types: [
        {
          name: "Banana Juice",
          price: 60,
          image: require("../assets/images/foods/juice1.jpg"),
        },
        {
          name: "Mango Juice",
          price: 80,
          image: require("../assets/images/foods/juice2.jpg"),
        },
        {
          name: "Apple Juice",
          price: 80,
          image: require("../assets/images/foods/juice3.jpg"),
        },
        {
          name: "papaya Juice",
          price: 80,
          image: require("../assets/images/foods/juice4.jpg"),
        },
      ],
      restaurants: ["Shiv Sagar", "Cream Centre", "Food Street"],
    },
  ];

  const product = products.find((p) => p.name === name);

  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const toggleType = (typeName: string) => {
    if (selectedTypes.includes(typeName)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== typeName));
    } else {
      setSelectedTypes([...selectedTypes, typeName]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={product.image} style={styles.mainImage} />
      <Text style={styles.title}>{product.name}</Text>

      {/* Product Variants */}
      <Text style={styles.subTitle}>Select Types</Text>
      <View style={styles.typeRow}>
        {product.types.map((p, index) => {
          const isSelected = selectedTypes.includes(p.name);
          return (
            <TouchableOpacity
              key={index}
              style={styles.typeOption}
              onPress={() => toggleType(p.name)}
            >
              <View style={styles.imageWrapper}>
                <Image
                  source={p.image}
                  style={[
                    styles.typeImage,
                    isSelected && styles.typeImageSelected,
                  ]}
                />
                {isSelected && (
                  <View style={styles.tickIcon}>
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color="green"
                    />
                  </View>
                )}
              </View>
              <Text numberOfLines={1} style={styles.typeName}>
                {p.name}
              </Text>
              <Text style={styles.typePrice}>₹{p.price}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Restaurants */}
      <Text style={styles.subTitle}>Available In</Text>
      {(product.restaurants || []).map((r, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            selectedRestaurant === r && styles.optionSelected,
          ]}
          onPress={() => setSelectedRestaurant(r)}
        >
          <Text>{r}</Text>
        </TouchableOpacity>
      ))}

      {/* Add to Cart */}
      <TouchableOpacity
        style={styles.cartBtn}
        onPress={() => {
  const selectedItems = product.types.filter((t) =>
    selectedTypes.includes(t.name)
  );

  if (selectedItems.length === 0 || !selectedRestaurant) {
    alert("Please select at least one type and a restaurant.");
    return;
  }

  selectedItems.forEach((item) => {
    addToCart({
      name: item.name,          // ✅ use variant as unique name
      price: item.price,
      image: item.image,
      product: product.name,    // ✅ keep category for grouping
      restaurant: selectedRestaurant,
      quantity: 1,
    });
  });

  router.push("/cart");
}}
      >
        <Text style={styles.cartText}>Add to cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  mainImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 12,
  },

  /** Product Types */
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  typeOption: { alignItems: "center", marginBottom: 16, width: 100 },
  imageWrapper: { position: "relative" },
  typeImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "transparent",
  },
  typeImageSelected: { borderColor: "green" },
  tickIcon: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  typeName: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
    textAlign: "center",
  },
  typePrice: { fontSize: 13, color: "green", fontWeight: "bold" },

  /** Restaurant List */
  option: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionSelected: { borderColor: "green", backgroundColor: "#eaffea" },

  /** Cart Button */
  cartBtn: {
    marginTop: 24,
    backgroundColor: "green",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  cartText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
