// app/data/foodData.ts

export interface FoodItem {
  id?: string;            // optional here, will be added in cart
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  time: string;
  isVeg: boolean;
  image: number;          // require() in RN returns a number

  // Extra fields used in Cart (optional for initial foodData)
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

// Categories
export const categories: Category[] = [
  { id: "local", name: "Street Foods", icon: "🍲", color: "#FF6B35" },
  { id: "bakery", name: "Bakery Items", icon: "🥖", color: "#8B4513" },
  { id: "tiffin", name: "Tiffins", icon: "🥞", color: "#32CD32" },
  { id: "restaurant", name: "Biryani", icon: "🍚", color: "#FFD700" },
  { id: "drinks", name: "Drinkables", icon: "🥤", color: "#00CED1" },
  { id: "dessert", name: "Yummy", icon: "🍦", color: "#FF69B4" },
];

// Food data
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
    },
    {
      name: "Pav Bhaji",
      price: 60,
      originalPrice: 70,
      rating: 4.7,
      time: "20-25 min",
      isVeg: true,
      image: require("../../assets/images/foods/pav bhaji.jpg"),
    },
    {
      name: "Pani Puri",
      price: 30,
      originalPrice: 35,
      rating: 4.2,
      time: "10-15 min",
      isVeg: true,
      image: require("../../assets/images/foods/pani puri.jpg"),
    },
    {
      name: "Vada Pav",
      price: 25,
      originalPrice: 30,
      rating: 4.6,
      time: "15-20 min",
      isVeg: true,
      image: require("../../assets/images/foods/vadapav.jpg"),
    },
    {
      name: "Shawarma",
      price: 90,
      originalPrice: 110,
      rating: 4.8,
      time: "25-30 min",
      isVeg: false,
      image: require("../../assets/images/foods/shawarma.jpg"),
    },
    {
      name: "Manchuria",
      price: 90,
      originalPrice: 100,
      rating: 4.8,
      time: "20-25 min",
      isVeg: true,
      image: require("../../assets/images/foods/manchuria.jpg"),
    },
    {
      name: "Noodles",
      price: 90,
      originalPrice: 105,
      rating: 4.8,
      time: "25-30 min",
      isVeg: true,
      image: require("../../assets/images/foods/noodles.jpg"),
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
    },
    {
      name: "Pizza",
      price: 250,
      originalPrice: 300,
      rating: 4.6,
      time: "30-35 min",
      isVeg: true,
      image: require("../../assets/images/foods/pizza.jpg"),
    },
    {
      name: "Burger",
      price: 80,
      originalPrice: 100,
      rating: 4.2,
      time: "15-20 min",
      isVeg: true,
      image: require("../../assets/images/foods/burger.jpg"),
    },
    {
      name: "Cakes",
      price: 250,
      originalPrice: 300,
      rating: 4.6,
      time: "5-10 min",
      isVeg: true,
      image: require("../../assets/images/foods/cakes.jpg"),
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
    },
    {
      name: "Poori",
      price: 50,
      originalPrice: 60,
      rating: 4.3,
      time: "20-25 min",
      isVeg: true,
      image: require("../../assets/images/foods/poori.jpg"),
    },
    {
      name: "Dosa",
      price: 45,
      originalPrice: 55,
      rating: 4.4,
      time: "25-30 min",
      isVeg: true,
      image: require("../../assets/images/foods/dosa.jpg"),
    },
    {
      name: "Idly",
      price: 35,
      originalPrice: 45,
      rating: 4.3,
      time: "15-20 min",
      isVeg: true,
      image: require("../../assets/images/foods/idly.jpg"),
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
    },
    {
      name: "Chicken Biryani",
      price: 180,
      originalPrice: 220,
      rating: 4.6,
      time: "40-45 min",
      isVeg: false,
      image: require("../../assets/images/foods/chickenbiryani.jpg"),
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
    },
    {
      name: "Lassi",
      price: 50,
      originalPrice: 60,
      rating: 4.7,
      time: "5-10 min",
      isVeg: true,
      image: require("../../assets/images/foods/lassi.jpg"),
    },
    {
      name: "Tea",
      price: 20,
      originalPrice: 25,
      rating: 4.6,
      time: "5-10 min",
      isVeg: true,
      image: require("../../assets/images/foods/tea.jpg"),
    },
    {
      name: "Coffee",
      price: 30,
      originalPrice: 40,
      rating: 4.7,
      time: "5-10 min",
      isVeg: true,
      image: require("../../assets/images/foods/coffe.jpg"),
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
    },
    {
      name: "Sweets",
      price: 70,
      originalPrice: 85,
      rating: 4.6,
      time: "5-10 min",
      isVeg: true,
      image: require("../../assets/images/foods/sweets0.jpg"),
    },
  ],
};
