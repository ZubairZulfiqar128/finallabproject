import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

/**
 * Product teaser with image, price, quick-view, and add-to-cart (guest or MongoDB).
 */
export default function ProductCard({ product, onQuickView }) {
  const { addToCart, syncing } = useCart()
  const [added, setAdded] = useState(false)

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(product.price)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    try {
      await addToCart(product.id, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch {
      /* cart context surfaces errors via API */
    }
  }

  return (
    <article className="product-card">
      <div className="product-card-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />
        <div className="product-card-actions">
          {onQuickView ? (
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => onQuickView(product)}
            >
              Quick view
            </button>
          ) : null}
          <Link to={`/products/${product.id}`} className="btn btn--primary btn--sm">
            Details
          </Link>
        </div>
      </div>
      <div className="product-card-body">
        <p className="product-card-brand">{product.brand}</p>
        <h3 className="product-card-name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-card-meta">
          <span className="product-card-category">{product.category}</span>
          <span className="product-card-price">{formatted}</span>
        </p>
        <button
          type="button"
          className={`btn btn--outline btn--sm btn--block product-card-cart ${added ? 'product-card-cart--added' : ''}`}
          onClick={handleAddToCart}
          disabled={syncing}
        >
          {added ? 'Added ✓' : syncing ? 'Adding…' : 'Add to cart'}
        </button>
      </div>
    </article>
  )
}
