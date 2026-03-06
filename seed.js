const mongoose = require("mongoose");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Cart = require("./models/Cart");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/fsd_store";

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Clear existing data
  await Promise.all([
    User.deleteMany(),
    Product.deleteMany(),
    Order.deleteMany(),
    Cart.deleteMany(),
  ]);
  console.log("Cleared old data");

  // --- Users ---
  const users = await User.insertMany([
    { name: "Alice Johnson", email: "alice@example.com", password: "password123", role: "admin" },
    { name: "Bob Smith", email: "bob@example.com", password: "password123", role: "customer" },
    { name: "Charlie Brown", email: "charlie@example.com", password: "password123", role: "customer" },
    { name: "Diana Prince", email: "diana@example.com", password: "password123", role: "customer" },
    { name: "Eve Davis", email: "eve@example.com", password: "password123", role: "customer" },
  ]);
  console.log("Inserted 5 users");

  // --- Products ---
  const products = await Product.insertMany([
    { name: "Wireless Mouse", description: "Ergonomic wireless mouse", price: 29.99, category: "Electronics", stock: 150, image: "mouse.jpg" },
    { name: "Mechanical Keyboard", description: "RGB mechanical keyboard", price: 79.99, category: "Electronics", stock: 75, image: "keyboard.jpg" },
    { name: "Running Shoes", description: "Lightweight running shoes", price: 119.99, category: "Footwear", stock: 200, image: "shoes.jpg" },
    { name: "Backpack", description: "Water-resistant laptop backpack", price: 49.99, category: "Accessories", stock: 120, image: "backpack.jpg" },
    { name: "Headphones", description: "Noise-cancelling over-ear headphones", price: 199.99, category: "Electronics", stock: 60, image: "headphones.jpg" },
    { name: "Water Bottle", description: "Insulated stainless steel bottle", price: 24.99, category: "Accessories", stock: 300, image: "bottle.jpg" },
    { name: "T-Shirt", description: "Cotton crew-neck t-shirt", price: 19.99, category: "Clothing", stock: 500, image: "tshirt.jpg" },
    { name: "Desk Lamp", description: "LED adjustable desk lamp", price: 39.99, category: "Home", stock: 90, image: "lamp.jpg" },
  ]);
  console.log("Inserted 8 products");

  // --- Orders ---
  await Order.insertMany([
    {
      user: users[1]._id,
      items: [
        { product: products[0]._id, quantity: 1, price: 29.99 },
        { product: products[4]._id, quantity: 1, price: 199.99 },
      ],
      totalAmount: 229.98,
      status: "delivered",
      shippingAddress: { street: "123 Main St", city: "New York", state: "NY", zip: "10001", country: "USA" },
    },
    {
      user: users[2]._id,
      items: [
        { product: products[2]._id, quantity: 2, price: 119.99 },
      ],
      totalAmount: 239.98,
      status: "shipped",
      shippingAddress: { street: "456 Oak Ave", city: "Chicago", state: "IL", zip: "60601", country: "USA" },
    },
    {
      user: users[3]._id,
      items: [
        { product: products[6]._id, quantity: 3, price: 19.99 },
        { product: products[3]._id, quantity: 1, price: 49.99 },
      ],
      totalAmount: 109.96,
      status: "pending",
      shippingAddress: { street: "789 Pine Rd", city: "Austin", state: "TX", zip: "73301", country: "USA" },
    },
  ]);
  console.log("Inserted 3 orders");

  // --- Carts ---
  await Cart.insertMany([
    {
      user: users[1]._id,
      items: [
        { product: products[1]._id, quantity: 1 },
        { product: products[5]._id, quantity: 2 },
      ],
    },
    {
      user: users[4]._id,
      items: [
        { product: products[7]._id, quantity: 1 },
      ],
    },
  ]);
  console.log("Inserted 2 carts");

  console.log("\nSeeding complete!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
