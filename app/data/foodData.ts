// app/data/foodData.ts

export interface FoodItem {
  id?: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  time: string;
  isVeg: boolean;
  image: number;
  subCategory?: string;
  quantity?: number;
  restaurant?: string;
  unit?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface SubCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  linkedCategory?: string;
}

// Categories
export const categories: Category[] = [
  { id: "local", name: "Street Foods", icon: "🍲", color: "#FF6B35" },
  { id: "bakery", name: "Bakery Items", icon: "🥖", color: "#8B4513" },
  { id: "tiffin", name: "Tiffins", icon: "🥞", color: "#32CD32" },
  { id: "restaurant", name: "Biryani", icon: "🍚", color: "#FFD700" },
  { id: "drinks", name: "Drinkables", icon: "🥤", color: "#00CED1" },
  { id: "dessert", name: "Yummy", icon: "🍦", color: "#FF69B4" },
];

// Sub Categories
export const subCategories: Record<string, SubCategory[]> = {
  local: [
    { id: "streetfood", name: "Street Food", icon: "🍢", color: "#FF6B35" },
    { id: "samosa", name: "Samosa", icon: "🥟", color: "#FF9500" },
    { id: "pavbhaji", name: "Pav Bhaji", icon: "🍔", color: "#FF5722" },
    { id: "panipuri", name: "Pani Puri", icon: "🥡", color: "#4CAF50" },
    { id: "vadapav", name: "Vada Pav", icon: "🌭", color: "#795548" },
    { id: "manchuria", name: "Manchuria", icon: "🥘", color: "#E91E63" },
  ],
  bakery: [
    { id: "puffs", name: "Puffs", icon: "🥐", color: "#8B4513" },
    { id: "pizza", name: "Pizza", icon: "🍕", color: "#FF6347" },
    { id: "burger", name: "Burger", icon: "🍔", color: "#FF9800" },
    { id: "cakes", name: "Cakes", icon: "🍰", color: "#FF69B4" },
    { id: "pastries", name: "Pastries", icon: "🥮", color: "#D2691E" },
  ],
  tiffin: [
    { id: "vada", name: "Vada", icon: "🥟", color: "#32CD32" },
    { id: "poori", name: "Poori", icon: "🥯", color: "#FFD700" },
    { id: "dosa", name: "Dosa", icon: "🥞", color: "#CD853F" },
    { id: "idly", name: "Idly", icon: "🍘", color: "#F0E68C" },
    { id: "pongal", name: "Pongal", icon: "🍚", color: "#DAA520" },
  ],
  restaurant: [
    { id: "vegbiryani", name: "Veg Biryani", icon: "🍚", color: "#FFD700" },
    { id: "chickenbiryani", name: "Chicken Biryani", icon: "🍗", color: "#D2691E" },
    { id: "muttonbiryani", name: "Mutton Biryani", icon: "🥩", color: "#8B4513" },
    { id: "friedrice", name: "Fried Rice", icon: "🍛", color: "#FF6347" },
  ],
  drinks: [
    { id: "juices", name: "Juices", icon: "🍹", color: "#00CED1" },
    { id: "lassi", name: "Lassi", icon: "🥛", color: "#FFD700" },
    { id: "tea", name: "Tea", icon: "🍵", color: "#8B4513" },
    { id: "coffee", name: "Coffee", icon: "☕", color: "#795548" },
    { id: "milkshakes", name: "Milkshakes", icon: "🥤", color: "#FF69B4" },
  ],
  dessert: [
    { id: "icecream", name: "Ice Cream", icon: "🍦", color: "#FF69B4" },
    { id: "sweets", name: "Sweets", icon: "🍬", color: "#FF1493" },
    { id: "cakes", name: "Cakes", icon: "🍰", color: "#FF6347" },
    { id: "pastries", name: "Pastries", icon: "🥮", color: "#D2691E" },
  ],
  quick: [
    { id: "streetfood", name: "Street Food", icon: "🍢", color: "#FF6B35", linkedCategory: "local" },
    { id: "samosa", name: "Samosa", icon: "🥟", color: "#FF9500", linkedCategory: "local" },
    { id: "pavbhaji", name: "Pav Bhaji", icon: "🍔", color: "#FF5722", linkedCategory: "local" },
    { id: "panipuri", name: "Pani Puri", icon: "🥡", color: "#4CAF50", linkedCategory: "local" },
    { id: "biryani", name: "Biryani", icon: "🍚", color: "#FFD700", linkedCategory: "restaurant" },
    { id: "juices", name: "Juices", icon: "🍹", color: "#00CED1", linkedCategory: "drinks" },
    { id: "icecream", name: "Ice Cream", icon: "🍦", color: "#FF69B4", linkedCategory: "dessert" },
    { id: "burger", name: "Burger", icon: "🍔", color: "#FF9800", linkedCategory: "bakery" },
  ],
};

// Food data with sub-categories
export const foodData: Record<Category["id"], FoodItem[]> = {
  local: [
    {
      name: "Samosa",
      price: 20,
      originalPrice: 25,
      rating: 4.5,
      time: "15-20 min",
      isVeg: true,
      image: require("../../assets/images/foods/samosa.jpg"),
      subCategory: "samosa",
    },
    {
      name: "Pav Bhaji",
      price: 60,
      originalPrice: 70,
      rating: 4.7,
      time: "20-25 min",
      isVeg: true,
      image: require("../../assets/images/foods/pav bhaji.jpg"),
      subCategory: "pavbhaji",
    },
    {
      name: "Pani Puri",
      price: 30,
      originalPrice: 35,
      rating: 4.2,
      time: "10-15 min",
      isVeg: true,
      image: require("../../assets/images/foods/pani puri.jpg"),
      subCategory: "panipuri",
    },
    {
      name: "Vada Pav",
      price: 25,
      originalPrice: 30,
      rating: 4.6,
      time: "15-20 min",
      isVeg: true,
      image: require("../../assets/images/foods/vadapav.jpg"),
      subCategory: "vadapav",
    },
    {
      name: "Shawarma",
      price: 90,
      originalPrice: 110,
      rating: 4.8,
      time: "25-30 min",
      isVeg: false,
      image: require("../../assets/images/foods/shawarma.jpg"),
      subCategory: "streetfood",
    },
    {
      name: "Manchuria",
      price: 90,
      originalPrice: 100,
      rating: 4.8,
      time: "20-25 min",
      isVeg: true,
      image: require("../../assets/images/foods/manchuria.jpg"),
      subCategory: "streetfood",
    },
    {
      name: "Noodles",
      price: 90,
      originalPrice: 105,
      rating: 4.8,
      time: "25-30 min",
      isVeg: true,
      image: require("../../assets/images/foods/noodles.jpg"),
      subCategory: "streetfood",
    },
    
  ],
  bakery: [
    {
      name: "Puffs",
      price: 25,
      originalPrice: 30,
      rating: 4.2,
      time: "10-15 min",
      isVeg: true,
      image: require("../../assets/images/foods/vegpuff.jpg"),
      subCategory: "puffs",
    },
    {
      name: "Pizza",
      price: 250,
      originalPrice: 300,
      rating: 4.6,
      time: "30-35 min",
      isVeg: true,
      image: require("../../assets/images/foods/pizza.jpg"),
      subCategory: "pizza",
    },
    {
      name: "Burger",
      price: 80,
      originalPrice: 100,
      rating: 4.2,
      time: "15-20 min",
      isVeg: true,
      image: require("../../assets/images/foods/burger.jpg"),
      subCategory: "burger",
    },
    {
      name: "Cakes",
      price: 250,
      originalPrice: 300,
      rating: 4.6,
      time: "5-10 min",
      isVeg: true,
      image: require("../../assets/images/foods/cakes.jpg"),
      subCategory: "cakes",
    },
  ],
  tiffin: [
    {
      name: "Vada",
      price: 35,
      originalPrice: 40,
      rating: 4.4,
      time: "15-20 min",
      isVeg: true,
      image: require("../../assets/images/foods/vada.jpg"),
      subCategory: "vada",
    },
    {
      name: "Poori",
      price: 50,
      originalPrice: 60,
      rating: 4.3,
      time: "20-25 min",
      isVeg: true,
      image: require("../../assets/images/foods/poori.jpg"),
      subCategory: "poori",
    },
    {
      name: "Dosa",
      price: 45,
      originalPrice: 55,
      rating: 4.4,
      time: "25-30 min",
      isVeg: true,
      image: require("../../assets/images/foods/dosa.jpg"),
      subCategory: "dosa",
    },
    {
      name: "Idly",
      price: 35,
      originalPrice: 45,
      rating: 4.3,
      time: "15-20 min",
      isVeg: true,
      image: require("../../assets/images/foods/idly.jpg"),
      subCategory: "idly",
    },
  ],
  restaurant: [
    {
      name: "Veg Biryani",
      price: 120,
      originalPrice: 140,
      rating: 4.6,
      time: "35-40 min",
      isVeg: true,
      image: require("../../assets/images/foods/vegbiryani.jpg"),
      subCategory: "vegbiryani",
    },
    {
      name: "Non-veg Biryani",
      price: 180,
      originalPrice: 220,
      rating: 4.6,
      time: "40-45 min",
      isVeg: false,
      image: require("../../assets/images/foods/chickenbiryani.jpg"),
      subCategory: "chickenbiryani",
    },
    {
      name: "Veg Fried Rice",
      price: 110,
      originalPrice: 130,
      rating: 4.4,
      time: "30-35 min",
      isVeg: true,
      image: require("../../assets/images/foods/vegbiryani.jpg"),
      subCategory: "friedrice",
    },

  ],
  drinks: [
    {
      name: "Juices",
      price: 60,
      originalPrice: 80,
      rating: 4.6,
      time: "5-10 min",
      isVeg: true,
      image: require("../../assets/images/foods/juices.jpg"),
      subCategory: "juices",
    },
    {
      name: "Lassi",
      price: 50,
      originalPrice: 60,
      rating: 4.7,
      time: "5-10 min",
      isVeg: true,
      image: require("../../assets/images/foods/lassi.jpg"),
      subCategory: "lassi",
    },
    {
      name: "Tea",
      price: 20,
      originalPrice: 25,
      rating: 4.6,
      time: "5-10 min",
      isVeg: true,
      image: require("../../assets/images/foods/tea.jpg"),
      subCategory: "tea",
    },
    {
      name: "Cappuccino",
      price: 30,
      originalPrice: 40,
      rating: 4.7,
      time: "5-10 min",
      isVeg: true,
      image: require("../../assets/images/foods/coffe.jpg"),
      subCategory: "coffee",
    },
    {
      name: "Orange Juice",
      price: 55,
      originalPrice: 70,
      rating: 4.5,
      time: "5-10 min",
      isVeg: true,
      image: require("../../assets/images/foods/juices.jpg"),
      subCategory: "juices",
    },
    {
      name: "Milkshake",
      price: 70,
      originalPrice: 85,
      rating: 4.8,
      time: "10-15 min",
      isVeg: true,
      image: require("../../assets/images/foods/juices.jpg"),
      subCategory: "juices",
    },
  ],
  dessert: [
    {
      name: "Ice Cream",
      price: 60,
      originalPrice: 75,
      rating: 4.6,
      time: "5-10 min",
      isVeg: true,
      image: require("../../assets/images/foods/vanillaicecream.jpg"),
      subCategory: "icecream",
    },
    {
      name: "Gulab Jamun",
      price: 70,
      originalPrice: 85,
      rating: 4.6,
      time: "5-10 min",
      isVeg: true,
      image: require("../../assets/images/foods/sweets0.jpg"),
      subCategory: "sweets",
    },
    {
      name: "Chocolate Pastry",
      price: 45,
      originalPrice: 55,
      rating: 4.7,
      time: "5-10 min",
      isVeg: true,
      image: require("../../assets/images/foods/cakes.jpg"),
      subCategory: "pastries",
    },
    {
      name: "Chocolate Ice Cream",
      price: 65,
      originalPrice: 80,
      rating: 4.8,
      time: "5-10 min",
      isVeg: true,
      image: require("../../assets/images/foods/vanillaicecream.jpg"),
      subCategory: "icecream",
    },
  ],
};

// Helper function to get food items by sub-category
export const getFoodItemsBySubCategory = (categoryId: string, subCategoryId?: string): FoodItem[] => {
  const items = foodData[categoryId] || [];
  if (!subCategoryId) return items;
  return items.filter(item => item.subCategory === subCategoryId);
};