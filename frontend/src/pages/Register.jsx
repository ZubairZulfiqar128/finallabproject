import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

/**
 * Registration page — creates MongoDB user and merges guest cart.
 */
export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { getGuestItems, clearGuestCart, items } = useCart()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const guestCount = items.reduce((sum, line) => sum + line.quantity, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.')
      return
    }
    if (!email.trim()) {
      setError('Email is required.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)

    try {
      const guestItems = getGuestItems()
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        guestItems,
      })
      clearGuestCart()
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed. Try a different email.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-layout">
      <aside className="auth-aside" aria-hidden="true">
        <p className="eyebrow">Join the maison</p>
        <h2 className="auth-aside-title">Create your account</h2>
        <p className="auth-aside-text">
          Register once and your cart, preferences, and concierge messages stay
          connected to MongoDB.
        </p>
        <ul className="auth-features">
          <li>Secure password hashing (bcrypt)</li>
          <li>JWT session — no re-login every visit</li>
          <li>Cart synced when you sign in on any device</li>
        </ul>
      </aside>

      <div className="auth-card">
        <header className="auth-card-header">
          <h1 className="page-title">Create account</h1>
          <p className="page-intro">
            Join Maison Chronos for a persistent cart synced across devices.
            {guestCount > 0 ? (
              <span className="auth-guest-note">
                {' '}
                {guestCount} guest item{guestCount !== 1 ? 's' : ''} will be saved to your account.
              </span>
            ) : null}
          </p>
        </header>

        <form className="contact-form auth-form" onSubmit={handleSubmit} noValidate>
          {error ? (
            <p className="field-error auth-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="form-field">
            <label htmlFor="register-name">Full name</label>
            <input
              id="register-name"
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="Your name"
              required
              minLength={2}
            />
          </div>

          <div className="form-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="register-password">Password</label>
            <div className="input-password-wrap">
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
              <button
                type="button"
                className="btn btn--ghost btn--sm input-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="field-hint">Minimum 6 characters. Stored hashed in MongoDB.</p>
          </div>

          <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
