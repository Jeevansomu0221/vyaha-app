import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* 1️⃣ Top Bar */}
      <View style={styles.topBar}>
        <Ionicons name="location-outline" size={20} color="black" />
        <Text style={styles.location}>Hyderabad</Text>
        <Ionicons name="person-circle-outline" size={28} color="black" style={{ marginLeft: "auto" }} />
      </View>

      {/* 2️⃣ Search + Veg Toggle */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="gray" />
          <TextInput placeholder="Search for food..." style={styles.searchInput} />
        </View>
        <TouchableOpacity style={styles.vegBtn}>
          <MaterialIcons name="eco" size={20} color="green" />
          <Text>Veg</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 3️⃣ Hero Section */}
        <Image source={{ uri: "https://source.unsplash.com/800x300/?food" }} style={styles.hero} />

        {/* 4️⃣ Local Food */}
        <Category title="Local Food" items={["Samosa", "Pav Bhaji", "Panipuri", "Vada Pav", "Shawarma", "Noodles"]} />

        {/* 5️⃣ Bakery */}
        <Category title="Bakery" items={["Veg Puff", "Egg Puff", "Cakes", "Burger", "Pizza"]} />

        {/* 6️⃣ Tiffins */}
        <Category title="Tiffins" items={["Dosa", "Idly", "Vada", "Poori", "Parotta"]} />

        {/* 7️⃣ Restaurant */}
        <Category title="Restaurant" items={["Veg Biryani", "Chicken Biryani", "Paneer"]} />

        {/* 8️⃣ Juices */}
        <Category title="Juices" items={["Mango Shake", "Milkshake", "Fruit Juice"]} />

        {/* 9️⃣ Ice Creams */}
        <Category title="Ice Creams" items={["Vanilla", "Chocolate", "Kulfi"]} />
      </ScrollView>
    </View>
  );
}

function Category({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={{ marginVertical: 12 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((item, i) => (
          <TouchableOpacity key={i} style={styles.card}>
            <Image source={{ uri: `https://source.unsplash.com/100x100/?${item}` }} style={styles.cardImg} />
            <Text style={styles.cardText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  topBar: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  location: { fontSize: 16, fontWeight: "bold", marginLeft: 5 },
  searchRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  searchBox: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#f2f2f2", borderRadius: 8, padding: 8 },
  searchInput: { marginLeft: 6, flex: 1 },
  vegBtn: { flexDirection: "row", alignItems: "center", marginLeft: 8, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: "#e6ffe6" },
  hero: { width: "100%", height: 180, borderRadius: 10, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  card: { marginRight: 10, alignItems: "center" },
  cardImg: { width: 100, height: 100, borderRadius: 10 },
  cardText: { marginTop: 4, fontSize: 12, fontWeight: "500" },
});
