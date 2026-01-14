import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/login";
import Register from "./pages/register";
import ProductListing from "./pages/productListing";
import Cart from "./pages/cart";
import AdminProductManagement from "./pages/adminProductManagement";
// import AdminOrders from "./pages/AdminOrders";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>

          <Route path="/" element={
            user ? (
              <ProductListing
                onLogout={logout}
                userRole={user.role}
                userName={user.name}
              />
            ) : (
              <Navigate to="/login" />
            )
          } />

          <Route path="/login" element={!user ? <Login /> : <Navigate to="/products" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/products" />} />

          <Route path="/products" element={
            user ? <ProductListing 
            onLogout={logout}
            userRole={user.role}
            userName={user.name}
            /> : <Navigate to="/login" />
          }/>

          <Route path="/cart" element={
            user?.role === "user" ? <Cart /> : <Navigate to="/products" />
          }/>

          <Route path="/admin/products" element={
            user?.role === "admin" ? <AdminProductManagement onLogout={logout} onViewOrders={() => {}} userName={user.name} /> : <Navigate to="/login" />
          }/>

          {/*<Route path="/admin/orders" element={
            user?.role === "admin" ? <AdminOrders /> : <Navigate to="/login" />
          }/>*/}

        </Routes>
      </BrowserRouter>
    </>
  );
}