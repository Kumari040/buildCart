import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Filter,
  X,
  ShoppingBag,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { ProductCard,} from "./productCard";
import type { Product } from "./productCard";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:3000";

interface ProductListingProps {
  onLogout: () => void;
  userRole: "user" | "admin";
  userName: string;
}

export default function ProductListing({
  onLogout,
  userRole,
  userName,
}: ProductListingProps) {
  const navigate = useNavigate();
  const isAdmin = userRole === "admin";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);

  // FETCH PRODUCTS 
  async function fetchProducts() {
    try {
      const res = await fetch(`${BACKEND_URL}/api/products`);
      const data = await res.json();
      console.log("API DATA:", data);

      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  //  ADD TO CART 
  async function handleAddToCart(product: Product) {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token= user?.token;
    if (!token) {
      navigate("/login");
      return;
    }

    await fetch(`${BACKEND_URL}/api/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({ productId: product._id }),
    });
  }

  // FILTERING 
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPrice =
      product.price >= priceRange[0] &&
      product.price <= priceRange[1];

    return matchesSearch && matchesPrice;
  });

  // LOADING   
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="bg-white shadow-md border-b-2 border-red-600 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/products")}
            >
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900">ShopHub</h2>
                <p className="text-xs text-gray-500">Your Shopping Destination</p>
              </div>
            </motion.div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              {isAdmin && (
                <button
                    onClick={() => navigate("/admin/products")}
                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                    Admin Dashboard
                </button>
                )}
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg">
                <UserIcon className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-700">{userName}</p>
                  <p className="text-xs text-red-600 capitalize">{userRole}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-gray-700 mb-3">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="flex-1 accent-red-600"
                  />
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="flex-1 accent-red-600"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-gray-900"
          >
            All products
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            {filteredProducts.length} products found
          </motion.p>
        </div>

        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                index={index}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}