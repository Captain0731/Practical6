# FSD Store — MongoDB E-Commerce REST API

A fully functional **Node.js + Express + MongoDB (Mongoose)** backend API for an e-commerce store with **Product**, **User**, **Order**, and **Cart** schemas and complete CRUD operations.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Seed Dummy Data](#seed-dummy-data)
- [Start the Server](#start-the-server)
- [Database Schemas](#database-schemas)
  - [User](#user-schema)
  - [Product](#product-schema)
  - [Order](#order-schema)
  - [Cart](#cart-schema)
- [API Endpoints](#api-endpoints)
  - [Users](#users-api)
  - [Products](#products-api)
  - [Orders](#orders-api)
  - [Cart](#cart-api)
- [Sample API Requests](#sample-api-requests)
- [Dummy Data Summary](#dummy-data-summary)

---

## Project Structure

```
fsd/
├── models/
│   ├── User.js            # User schema & model
│   ├── Product.js         # Product schema & model
│   ├── Order.js           # Order schema & model
│   └── Cart.js            # Cart schema & model
├── routes/
│   ├── userRoutes.js      # CRUD routes for users
│   ├── productRoutes.js   # CRUD routes for products
│   ├── orderRoutes.js     # CRUD routes for orders
│   └── cartRoutes.js      # CRUD routes for cart
├── server.js              # Express app entry point + MongoDB connection
├── seed.js                # Script to populate the database with dummy data
├── package.json           # Project metadata & dependencies
└── README.md              # Project documentation (this file)
```

---

## Tech Stack

| Technology | Purpose              |
|------------|----------------------|
| Node.js    | JavaScript runtime   |
| Express.js | Web framework        |
| MongoDB    | NoSQL database       |
| Mongoose   | MongoDB ODM library  |

---

## Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (running locally on `mongodb://localhost:27017` or a remote URI)

---

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd fsd

# Install dependencies
npm install
```

This installs:
- `express` — web framework
- `mongoose` — MongoDB object modeling

---

## Environment Variables

| Variable    | Default                                  | Description              |
|-------------|------------------------------------------|--------------------------|
| `PORT`      | `3000`                                   | Server port              |
| `MONGO_URI` | `mongodb://localhost:27017/fsd_store`    | MongoDB connection string|

You can set these before starting the server:

```bash
# Windows PowerShell
$env:PORT = "5000"
$env:MONGO_URI = "mongodb://localhost:27017/fsd_store"

# Linux / macOS
export PORT=5000
export MONGO_URI="mongodb://localhost:27017/fsd_store"
```

---

## Seed Dummy Data

Populate the database with sample users, products, orders, and carts:

```bash
node seed.js
```

**Output:**
```
Connected to MongoDB
Cleared old data
Inserted 5 users
Inserted 8 products
Inserted 3 orders
Inserted 2 carts

Seeding complete!
```

> **Note:** Running `seed.js` clears all existing data before inserting fresh records.

---

## Start the Server

```bash
node server.js
```

**Output:**
```
Connected to MongoDB
Server running on port 3000
```

The API is now accessible at `http://localhost:3000`.

---

## Database Schemas

### User Schema

| Field      | Type   | Required | Constraints                        |
|------------|--------|----------|------------------------------------|
| `name`     | String | Yes      | Trimmed                            |
| `email`    | String | Yes      | Unique, lowercase, trimmed         |
| `password` | String | Yes      | Minimum 6 characters               |
| `role`     | String | No       | Enum: `customer`, `admin` (default: `customer`) |
| `createdAt`| Date   | Auto     | Mongoose timestamp                 |
| `updatedAt`| Date   | Auto     | Mongoose timestamp                 |

### Product Schema

| Field         | Type   | Required | Constraints          |
|---------------|--------|----------|----------------------|
| `name`        | String | Yes      | Trimmed              |
| `description` | String | No       | Default: `""`        |
| `price`       | Number | Yes      | Min: 0               |
| `category`    | String | Yes      | —                    |
| `stock`       | Number | No       | Default: 0, min: 0   |
| `image`       | String | No       | Default: `""`        |
| `createdAt`   | Date   | Auto     | Mongoose timestamp   |
| `updatedAt`   | Date   | Auto     | Mongoose timestamp   |

### Order Schema

| Field             | Type     | Required | Constraints                                                        |
|-------------------|----------|----------|--------------------------------------------------------------------|
| `user`            | ObjectId | Yes      | References `User`                                                  |
| `items`           | Array    | —        | Array of `{ product (ObjectId → Product), quantity (min 1), price }`|
| `totalAmount`     | Number   | Yes      | —                                                                  |
| `status`          | String   | No       | Enum: `pending`, `processing`, `shipped`, `delivered`, `cancelled` (default: `pending`) |
| `shippingAddress` | Object   | No       | `{ street, city, state, zip, country }`                            |
| `createdAt`       | Date     | Auto     | Mongoose timestamp                                                 |
| `updatedAt`       | Date     | Auto     | Mongoose timestamp                                                 |

### Cart Schema

| Field      | Type     | Required | Constraints                                           |
|------------|----------|----------|-------------------------------------------------------|
| `user`     | ObjectId | Yes      | References `User`, unique (one cart per user)          |
| `items`    | Array    | —        | Array of `{ product (ObjectId → Product), quantity (min 1, default 1) }` |
| `createdAt`| Date     | Auto     | Mongoose timestamp                                    |
| `updatedAt`| Date     | Auto     | Mongoose timestamp                                    |

---

## API Endpoints

### Users API

**Base URL:** `/api/users`

| Method | Endpoint    | Description                | Request Body                                          |
|--------|-------------|----------------------------|-------------------------------------------------------|
| POST   | `/`         | Create a new user          | `{ name, email, password, role? }`                    |
| GET    | `/`         | Get all users              | —                                                     |
| GET    | `/:id`      | Get a user by ID           | —                                                     |
| PUT    | `/:id`      | Update a user by ID        | `{ name?, email?, password?, role? }`                 |
| DELETE | `/:id`      | Delete a user by ID        | —                                                     |

> **Note:** GET responses exclude the `password` field for security.

---

### Products API

**Base URL:** `/api/products`

| Method | Endpoint    | Description                          | Request Body / Query                                      |
|--------|-------------|--------------------------------------|-----------------------------------------------------------|
| POST   | `/`         | Create a new product                 | `{ name, description?, price, category, stock?, image? }` |
| GET    | `/`         | Get all products                     | Query: `?category=Electronics` (optional filter)          |
| GET    | `/:id`      | Get a product by ID                  | —                                                         |
| PUT    | `/:id`      | Update a product by ID               | `{ name?, description?, price?, category?, stock?, image? }` |
| DELETE | `/:id`      | Delete a product by ID               | —                                                         |

---

### Orders API

**Base URL:** `/api/orders`

| Method | Endpoint    | Description                          | Request Body / Query                                      |
|--------|-------------|--------------------------------------|-----------------------------------------------------------|
| POST   | `/`         | Create a new order                   | `{ user, items: [{product, quantity, price}], totalAmount, status?, shippingAddress? }` |
| GET    | `/`         | Get all orders (populated)           | Query: `?user=<userId>` (optional filter)                 |
| GET    | `/:id`      | Get an order by ID (populated)       | —                                                         |
| PUT    | `/:id`      | Update an order by ID                | `{ status?, shippingAddress?, ... }`                      |
| DELETE | `/:id`      | Delete an order by ID                | —                                                         |

> **Note:** GET responses populate `user` (name, email) and `items.product` (name, price).

---

### Cart API

**Base URL:** `/api/cart`

| Method | Endpoint                | Description                          | Request Body                      |
|--------|-------------------------|--------------------------------------|-----------------------------------|
| GET    | `/:userId`              | Get cart for a user (populated)      | —                                 |
| POST   | `/:userId`              | Add item to cart (creates if none)   | `{ productId, quantity? }`        |
| PUT    | `/:userId/:productId`   | Update item quantity in cart         | `{ quantity }`                    |
| DELETE | `/:userId/:productId`   | Remove a specific item from cart     | —                                 |
| DELETE | `/:userId`              | Clear entire cart for a user         | —                                 |

> **Note:** GET populates `items.product` with name, price, and image.

---

## Sample API Requests

### Create a User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "secret123"}'
```

### Get All Products

```bash
curl http://localhost:3000/api/products
```

### Filter Products by Category

```bash
curl http://localhost:3000/api/products?category=Electronics
```

### Create a Product

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Tablet", "description": "10-inch tablet", "price": 299.99, "category": "Electronics", "stock": 50}'
```

### Update a Product

```bash
curl -X PUT http://localhost:3000/api/products/<product_id> \
  -H "Content-Type: application/json" \
  -d '{"price": 249.99, "stock": 40}'
```

### Delete a Product

```bash
curl -X DELETE http://localhost:3000/api/products/<product_id>
```

### Add Item to Cart

```bash
curl -X POST http://localhost:3000/api/cart/<user_id> \
  -H "Content-Type: application/json" \
  -d '{"productId": "<product_id>", "quantity": 2}'
```

### Get User's Cart

```bash
curl http://localhost:3000/api/cart/<user_id>
```

### Create an Order

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user": "<user_id>",
    "items": [{"product": "<product_id>", "quantity": 1, "price": 29.99}],
    "totalAmount": 29.99,
    "shippingAddress": {"street": "123 Main St", "city": "New York", "state": "NY", "zip": "10001", "country": "USA"}
  }'
```

### Update Order Status

```bash
curl -X PUT http://localhost:3000/api/orders/<order_id> \
  -H "Content-Type: application/json" \
  -d '{"status": "shipped"}'
```

---

## Dummy Data Summary

### Users (5)

| Name           | Email               | Role     |
|----------------|---------------------|----------|
| Alice Johnson  | alice@example.com   | admin    |
| Bob Smith      | bob@example.com     | customer |
| Charlie Brown  | charlie@example.com | customer |
| Diana Prince   | diana@example.com   | customer |
| Eve Davis      | eve@example.com     | customer |

### Products (8)

| Name                | Category    | Price   | Stock |
|---------------------|-------------|---------|-------|
| Wireless Mouse      | Electronics | $29.99  | 150   |
| Mechanical Keyboard | Electronics | $79.99  | 75    |
| Running Shoes       | Footwear    | $119.99 | 200   |
| Backpack            | Accessories | $49.99  | 120   |
| Headphones          | Electronics | $199.99 | 60    |
| Water Bottle        | Accessories | $24.99  | 300   |
| T-Shirt             | Clothing    | $19.99  | 500   |
| Desk Lamp           | Home        | $39.99  | 90    |

### Orders (3)

| User          | Items                       | Total    | Status    |
|---------------|-----------------------------|----------|-----------|
| Bob Smith     | Mouse + Headphones          | $229.98  | delivered |
| Charlie Brown | Running Shoes x2            | $239.98  | shipped   |
| Diana Prince  | T-Shirt x3 + Backpack       | $109.96  | pending   |

### Carts (2)

| User      | Items                          |
|-----------|--------------------------------|
| Bob Smith | Mechanical Keyboard + Water Bottle x2 |
| Eve Davis | Desk Lamp                      |

---

## Mongoose CRUD Methods Used

| Operation | Mongoose Method                  | Description                          |
|-----------|----------------------------------|--------------------------------------|
| Create    | `Model.create(data)`             | Insert a new document                |
| Read All  | `Model.find(filter)`             | Retrieve multiple documents          |
| Read One  | `Model.findById(id)`             | Retrieve a single document by ID     |
| Update    | `Model.findByIdAndUpdate(id, data, { new: true, runValidators: true })` | Update and return updated doc |
| Delete    | `Model.findByIdAndDelete(id)`    | Remove a document by ID              |
| Populate  | `.populate("field", "select")`   | Replace ObjectId with actual document data |

---

## License

ISC
