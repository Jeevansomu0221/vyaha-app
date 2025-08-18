// app/data/products.js
export const products = [
  {
    name: "Samosa",
    image: require("../../assets/images/foods/aloosamosa.jpg"),
    types: [
      { name: "Aloo Samosa", price: 20, image: require("../../assets/images/foods/aloosamosa.jpg") },
      { name: "Paneer Samosa", price: 30, image: require("../../assets/images/foods/paneersamosa.jpg") },
      { name: "Corn Samosa", price: 25, image: require("../../assets/images/foods/cornsamosa.jpg") },
    ],
  },
  {
    name: "Pani Puri",
    image: require("../../assets/images/foods/panipuri2.jpg"),
    types: [
      { name: "Classic Pani Puri", price: 40, image: require("../../assets/images/foods/panipuri2.jpg") },
      { name: "Masala Pani Puri", price: 50, image: require("../../assets/images/foods/panipuri2.jpg") },s
    ],
  },
  {
    name: "Vada Pav",
    image: require("../../assets/images/foods/vadapav.jpg"),
    types: [
      { name: "Classic Vada Pav", price: 25, image: require("../../assets/images/foods/vadapav.jpg") },
      { name: "Cheese Vada Pav", price: 35, image: require("../../assets/images/foods/vadapav.jpg") },
    ],
  },
  {
    name: "Pav Bhaji",
    image: require("../../assets/images/foods/pav bhaji.jpg"),
    types: [
      { name: "Classic Pav Bhaji", price: 60, image: require("../../assets/images/foods/pav bhaji.jpg") },
      { name: "Butter Pav Bhaji", price: 80, image: require("../../assets/images/foods/pav bhaji.jpg") },
    ],
  },
];
