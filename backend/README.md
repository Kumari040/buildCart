# 🛒 MERN E-Commerce Web App

A full-stack E-Commerce web application built using **React + TypeScript** on the frontend and **Node.js + Express + MongoDB** on the backend.  
Includes JWT authentication, role-based authorization, product listing, and cart features.



## Features

- User Registration & Login
- Password Encryption with Bcrypt
- JWT Authentication
- Role-Based Access (User / Admin)
- Product Listing
- User Cart
- Protected Routes
- Responsive UI with Tailwind CSS
- Animated UI with Framer Motion



## 🧰 Tech Stack

**Frontend**
- React + TypeScript
- React Router DOM
- Tailwind CSS
- Sonner Toast Notifications

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt Password Hashing

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/buildCart.git
cd buildCart

## Backend Setup
cd backend
npm install

Create .env file inside /backend
PORT=
MONGO_URL=
JWT_KEY=your_secret_jwt_key_here

## Frontend setup
cd frontend
npm install
npm run dev