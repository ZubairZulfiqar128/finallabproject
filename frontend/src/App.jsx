import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider, useCart } from './context/CartContext'
import { ProductsProvider } from './context/ProductsContext'
import Footer from './components/Footer'
import Modal from './components/Modal'
import Navbar from './components/Navbar'
import About from './pages/About'
import Admin from './pages/Admin'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Login from './pages/Login'
import ProductDetails from './pages/ProductDetails'
import Products from './pages/Products'
import Register from './pages/Register'

/**
 * Scrolls to top on route change for smoother SPA navigation.
 */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function QuickViewModal({ product, onClose }) {
  const { addToCart, syncing } = useCart()
  const [added, setAdded] = useState(false)

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(product.price)

  const handleAdd = async () => {
    await addToCart(product.id, 1)
    setAdded(true)
  }

  return (
    <Modal isOpen onClose={onClose} title={product.name}>
      <div className="quick-view">
        <img src={product.image} alt="" className="quick-view-image" />
        <p className="quick-view-brand">{product.brand}</p>
        <p className="quick-view-price">{formattedPrice}</p>
        <p className="quick-view-desc">{product.shortDescription}</p>
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleAdd}
            disabled={syncing}
          >
            {added ? 'Added ✓' : syncing ? 'Adding…' : 'Add to cart'}
          </button>
          <Link
            to={`/products/${product.id}`}
            className="btn btn--outline"
            onClick={onClose}
          >
            Full details
          </Link>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}

function AppRoutes() {
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home onQuickView={setQuickViewProduct} />} />
          <Route
            path="/products"
            element={<Products onQuickView={setQuickViewProduct} />}
          />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />

      {quickViewProduct ? (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      ) : null}
    </>
  )
}

/** Remount cart when auth changes so guest/server state stays in sync. */
function CartProviderWithKey({ children }) {
  const { user } = useAuth()
  return <CartProvider key={user?.id ?? 'guest'}>{children}</CartProvider>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductsProvider>
          <CartProviderWithKey>
            <AppRoutes />
          </CartProviderWithKey>
        </ProductsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
