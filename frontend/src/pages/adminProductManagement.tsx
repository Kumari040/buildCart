import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Edit,
  Trash2,
  ShoppingBag,
  LogOut,
  User as UserIcon,
  Package,
  X,
  Save,
} from 'lucide-react';
import type { Product }  from './productCard';
//import { useNavigate } from 'react-router-dom';

interface AdminProductManagementProps {
  onLogout: () => void;
  onViewOrders: () => void;
  userName: string;
}

export default function AdminProductManagement({
  onLogout,
  onViewOrders,
  userName,
}: AdminProductManagementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    stock: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  //const navigate = useNavigate();
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).token : '';

  useEffect(() => {
    fetchProducts();    
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/products', {
        headers: {
            "Content-Type": "application/json",
             authorization: token,
        },
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = 'Valid price is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';
    if (!formData.stock || parseInt(formData.stock) < 0)
      newErrors.stock = 'Valid stock quantity is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProduct = async () => {
    if (!validateForm()) return;

    try {
      const res = await fetch('http://localhost:3000/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to add product');

      setProducts([...products, data]);
      resetForm();
      setShowAddModal(false);
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
    }
  };

  const handleEditProduct = async () => {
    if (!validateForm() || !editingProduct) return;

    try {
      const res = await fetch(`http://localhost:3000/api/admin/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: token ,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to update product');

      setProducts(products.map((p) => (p._id === editingProduct._id ? data : p)));
      resetForm();
      setEditingProduct(null);
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { authorization: token },
      });
      if (!res.ok) throw new Error('Failed to delete product');

      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      imageUrl: '',
      stock: '',
    });
    setErrors({});
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      imageUrl: product.imageUrl,
      stock: product.stock.toString(),
    });
  };

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
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900">Admin Dashboard</h2>
                <p className="text-xs text-gray-500">Product Management</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onViewOrders}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Package className="w-4 h-4" />
                View Orders
              </motion.button>
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg">
                <UserIcon className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-700">{userName}</p>
                  <p className="text-xs text-red-600">Admin</p>
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
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Product Button */}
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-gray-900"
          >
            Products ({products.length})
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </motion.button>
        </div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-red-100"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Image</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Stock</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {products.map((product, index) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-200 hover:bg-red-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {product.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-red-600">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            product.stock === 0
                              ? 'bg-red-100 text-red-700'
                              : product.stock < 10
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => openEditModal(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteProduct(product._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {(showAddModal || editingProduct) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              if (!editingProduct && !showAddModal) return;
              setShowAddModal(false);
              setEditingProduct(null);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                    placeholder="Enter product name"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className={`w-full px-4 py-3 border ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                      placeholder="0.00"
                    />
                    {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className={`w-full px-4 py-3 border ${
                        errors.stock ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                      placeholder="0"
                    />
                    {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-4 py-3 border ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none`}
                    rows={3}
                    placeholder="Enter product description"
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Image URL</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className={`w-full px-4 py-3 border ${
                      errors.imageUrl ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.imageUrl && (
                    <p className="text-red-600 text-sm mt-1">{errors.imageUrl}</p>
                  )}
                </div>

                {/* Image Preview */}
                {formData.imageUrl && (
                  <div className="mt-4">
                    <label className="block text-gray-700 mb-2">Preview</label>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={editingProduct ? handleEditProduct : handleAddProduct}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
